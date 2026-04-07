const express = require('express');
const Stripe = require('stripe');
const { query } = require('../db/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

function requireStripe(res) {
  if (!stripe) {
    res.status(503).json({
      error: 'Billing is not configured on this server.',
      code: 'STRIPE_NOT_CONFIGURED',
    });
    return null;
  }
  return stripe;
}

// POST /api/billing/checkout
router.post('/checkout', authMiddleware, async (req, res) => {
  const stripe = requireStripe(res);
  if (!stripe) return;

  try {
    const { rows } = await query('SELECT * FROM users WHERE id = $1', [req.userId]);
    const user = rows[0];

    if (user.plan === 'pro') {
      return res.status(400).json({ error: 'You are already on the Pro plan' });
    }

    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: String(user.id) },
      });
      customerId = customer.id;
      await query(
        'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
        [customerId, req.userId]
      );
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/billing?success=1`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/billing?canceled=1`,
      metadata: { userId: String(req.userId) },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('[billing] checkout error:', err.message);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// POST /api/billing/portal
router.post('/portal', authMiddleware, async (req, res) => {
  const stripe = requireStripe(res);
  if (!stripe) return;

  try {
    const { rows } = await query(
      'SELECT stripe_customer_id FROM users WHERE id = $1',
      [req.userId]
    );
    const user = rows[0];

    if (!user.stripe_customer_id) {
      return res.status(400).json({ error: 'No billing account found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/billing`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('[billing] portal error:', err.message);
    res.status(500).json({ error: 'Failed to open billing portal' });
  }
});

// POST /api/billing/webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const stripe = requireStripe(res);
  if (!stripe) return;

  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        if (userId && session.subscription) {
          await query(
            'UPDATE users SET plan = $1, stripe_subscription_id = $2 WHERE id = $3',
            ['pro', session.subscription, parseInt(userId)]
          );
          console.log(`User ${userId} upgraded to pro`);
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        await query(
          'UPDATE users SET plan = $1, stripe_subscription_id = NULL WHERE stripe_subscription_id = $2',
          ['free', sub.id]
        );
        console.log(`Subscription ${sub.id} cancelled — user downgraded to free`);
        break;
      }
      case 'invoice.payment_failed': {
        console.warn(`Payment failed for subscription: ${event.data.object.subscription}`);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error('[billing] webhook DB error:', err.message);
    // Still return 200 so Stripe doesn't retry — log and investigate separately
  }

  res.json({ received: true });
});

// POST /api/billing/redeem-promo
const PROMO_CODES = {
  PRODUCTHUNT: {
    days: 30,
    expiresAt: new Date('2026-05-12T23:59:59Z'), // code stops being accepted after this date
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

    // Check if already redeemed
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
      'SELECT plan, stripe_customer_id, stripe_subscription_id, analyses_used FROM users WHERE id = $1',
      [req.userId]
    );
    const user = rows[0];
    res.json({
      plan: user.plan,
      analyses_used: user.analyses_used,
      has_stripe_account: !!user.stripe_customer_id,
    });
  } catch (err) {
    console.error('[billing] status error:', err.message);
    res.status(500).json({ error: 'Failed to fetch billing status' });
  }
});

module.exports = router;
