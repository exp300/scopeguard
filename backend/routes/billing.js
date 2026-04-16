const express = require('express');
const { Paddle, Environment } = require('@paddle/paddle-node-sdk');
const { query } = require('../db/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const paddle = process.env.PADDLE_API_KEY
  ? new Paddle(process.env.PADDLE_API_KEY, {
      environment: process.env.NODE_ENV === 'production'
        ? Environment.production
        : Environment.sandbox,
    })
  : null;

function requirePaddle(res) {
  if (!paddle) {
    res.status(503).json({
      error: 'Billing is not configured on this server.',
      code: 'PADDLE_NOT_CONFIGURED',
    });
    return null;
  }
  return paddle;
}

// POST /api/billing/checkout
router.post('/checkout', authMiddleware, async (req, res) => {
  if (!requirePaddle(res)) return;

  try {
    const { rows } = await query('SELECT * FROM users WHERE id = $1', [req.userId]);
    const user = rows[0];

    if (user.plan === 'pro') {
      return res.status(400).json({ error: 'You are already on the Pro plan' });
    }

    const transaction = await paddle.transactions.create({
      items: [{ priceId: process.env.PADDLE_PRO_PRICE_ID, quantity: 1 }],
      customData: { userId: String(req.userId) },
      ...(user.paddle_customer_id ? { customerId: user.paddle_customer_id } : {}),
      checkoutSettings: {
        successUrl: `${FRONTEND_URL}/billing?success=1`,
      },
    });

    const checkoutUrl = transaction.checkout?.url;
    if (!checkoutUrl) {
      console.error('[billing] No checkout URL in Paddle transaction:', transaction);
      return res.status(500).json({ error: 'Failed to get checkout URL' });
    }

    res.json({ url: checkoutUrl });
  } catch (err) {
    console.error('[billing] checkout error:', err.message);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// POST /api/billing/portal — returns stored subscription management URL
router.post('/portal', authMiddleware, async (req, res) => {
  if (!requirePaddle(res)) return;

  try {
    const { rows } = await query(
      'SELECT paddle_cancel_url, paddle_subscription_id FROM users WHERE id = $1',
      [req.userId]
    );
    const user = rows[0];

    if (!user.paddle_subscription_id) {
      return res.status(400).json({ error: 'No active subscription found' });
    }

    // Return the cancel URL stored from the subscription webhook,
    // or fall back to Paddle's customer portal.
    const url = user.paddle_cancel_url || 'https://customer.paddle.com/';
    res.json({ url });
  } catch (err) {
    console.error('[billing] portal error:', err.message);
    res.status(500).json({ error: 'Failed to get portal URL' });
  }
});

// POST /api/billing/webhook
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    if (!requirePaddle(res)) return;

    const signature = req.headers['paddle-signature'];
    let event;
    try {
      event = paddle.webhooks.unmarshal(
        req.body.toString(),
        process.env.PADDLE_WEBHOOK_SECRET,
        signature
      );
    } catch (err) {
      console.error('[billing] Webhook signature error:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.eventType) {
        // Payment completed — upgrade user to Pro
        case 'transaction.completed': {
          const txn = event.data;
          const userId = txn.customData?.userId;
          const customerId = txn.customerId;
          const subscriptionId = txn.subscriptionId;

          if (userId) {
            await query(
              `UPDATE users
               SET plan = $1,
                   paddle_customer_id = COALESCE(paddle_customer_id, $2),
                   paddle_subscription_id = COALESCE($3, paddle_subscription_id)
               WHERE id = $4`,
              ['pro', customerId || null, subscriptionId || null, parseInt(userId)]
            );
            console.log(`[billing] User ${userId} upgraded to pro`);
          }
          break;
        }

        // Subscription activated — store management URLs
        case 'subscription.activated': {
          const sub = event.data;
          const userId = sub.customData?.userId;
          const cancelUrl = sub.managementUrls?.cancel || null;

          if (userId) {
            await query(
              `UPDATE users
               SET paddle_subscription_id = $1,
                   paddle_customer_id = COALESCE(paddle_customer_id, $2),
                   paddle_cancel_url = $3
               WHERE id = $4`,
              [sub.id, sub.customerId || null, cancelUrl, parseInt(userId)]
            );
            console.log(`[billing] Subscription activated for user ${userId}`);
          }
          break;
        }

        // Subscription updated — refresh management URLs
        case 'subscription.updated': {
          const sub = event.data;
          const cancelUrl = sub.managementUrls?.cancel || null;
          if (sub.id) {
            await query(
              'UPDATE users SET paddle_cancel_url = $1 WHERE paddle_subscription_id = $2',
              [cancelUrl, sub.id]
            );
          }
          break;
        }

        // Subscription canceled — downgrade to free
        case 'subscription.canceled': {
          const sub = event.data;
          await query(
            `UPDATE users
             SET plan = 'free',
                 paddle_subscription_id = NULL,
                 paddle_cancel_url = NULL
             WHERE paddle_subscription_id = $1`,
            [sub.id]
          );
          console.log(`[billing] Subscription ${sub.id} cancelled — user downgraded to free`);
          break;
        }

        default:
          break;
      }
    } catch (err) {
      console.error('[billing] webhook DB error:', err.message);
      // Return 200 so Paddle doesn't retry — investigate separately
    }

    res.json({ received: true });
  }
);

// POST /api/billing/redeem-promo
const PROMO_CODES = {
  PRODUCTHUNT: {
    days: 30,
    expiresAt: new Date('2026-05-12T23:59:59Z'),
  },
};

router.post('/redeem-promo', authMiddleware, async (req, res) => {
  const { code } = req.body;
  if (!code?.trim()) {
    return res.status(400).json({ error: 'Promo code is required' });
  }

  const promo = PROMO_CODES[code.trim().toUpperCase()];
  if (!promo) {
    return res.status(400).json({ error: 'Invalid promo code' });
  }
  if (new Date() > promo.expiresAt) {
    return res.status(400).json({ error: 'This promo code has expired' });
  }

  try {
    const { rows: userRows } = await query('SELECT plan FROM users WHERE id = $1', [req.userId]);
    const user = userRows[0];
    if (user.plan === 'pro') {
      return res.status(400).json({ error: 'You already have a Pro plan' });
    }

    const { rows: existing } = await query(
      'SELECT id FROM promo_redemptions WHERE user_id = $1 AND code = $2',
      [req.userId, code.trim().toUpperCase()]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: 'You have already redeemed this promo code' });
    }

    const proExpiresAt = new Date(Date.now() + promo.days * 24 * 60 * 60 * 1000);

    await query(
      'INSERT INTO promo_redemptions (user_id, code, pro_expires_at) VALUES ($1, $2, $3)',
      [req.userId, code.trim().toUpperCase(), proExpiresAt]
    );
    await query('UPDATE users SET plan = $1 WHERE id = $2', ['pro', req.userId]);

    console.log(`[billing] Promo ${code} redeemed by userId ${req.userId} — Pro until ${proExpiresAt.toISOString()}`);

    res.json({
      success: true,
      message: `${promo.days} days of Pro access activated!`,
      pro_expires_at: proExpiresAt,
    });
  } catch (err) {
    console.error('[billing] redeem-promo error:', err.message);
    res.status(500).json({ error: 'Failed to redeem promo code' });
  }
});

// GET /api/billing/status
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT plan, paddle_customer_id, paddle_subscription_id, analyses_used FROM users WHERE id = $1',
      [req.userId]
    );
    const user = rows[0];
    res.json({
      plan: user.plan,
      analyses_used: user.analyses_used,
      has_paddle_account: !!user.paddle_customer_id,
    });
  } catch (err) {
    console.error('[billing] status error:', err.message);
    res.status(500).json({ error: 'Failed to fetch billing status' });
  }
});

module.exports = router;
