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
