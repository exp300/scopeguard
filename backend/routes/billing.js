const express = require('express');
const Stripe = require('stripe');
const { getDb } = require('../db/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Stripe is optional — only initialized when STRIPE_SECRET_KEY is present.
// Routes that need Stripe call requireStripe() which returns the instance or
// sends a 503 and returns null, letting the handler bail out early.
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

// POST /api/billing/checkout — create a Stripe checkout session for Pro plan
router.post('/checkout', authMiddleware, async (req, res) => {
  const stripe = requireStripe(res);
  if (!stripe) return;
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);

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
    db.prepare('UPDATE users SET stripe_customer_id = ? WHERE id = ?').run(customerId, req.userId);
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
});

// POST /api/billing/portal — create Stripe customer portal session for managing subscription
router.post('/portal', authMiddleware, async (req, res) => {
  const stripe = requireStripe(res);
  if (!stripe) return;
  const db = getDb();
  const user = db.prepare('SELECT stripe_customer_id FROM users WHERE id = ?').get(req.userId);

  if (!user.stripe_customer_id) {
    return res.status(400).json({ error: 'No billing account found' });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripe_customer_id,
    return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/billing`,
  });

  res.json({ url: session.url });
});

// POST /api/billing/webhook — Stripe event handler (no auth, uses signature verification)
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
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

  const db = getDb();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      if (userId && session.subscription) {
        db.prepare(
          'UPDATE users SET plan = ?, stripe_subscription_id = ? WHERE id = ?'
        ).run('pro', session.subscription, parseInt(userId));
        console.log(`User ${userId} upgraded to pro`);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      db.prepare(
        'UPDATE users SET plan = ?, stripe_subscription_id = NULL WHERE stripe_subscription_id = ?'
      ).run('free', sub.id);
      console.log(`Subscription ${sub.id} cancelled — user downgraded to free`);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      console.warn(`Payment failed for subscription: ${invoice.subscription}`);
      // You could send an email here in production
      break;
    }

    default:
      break;
  }

  res.json({ received: true });
});

// GET /api/billing/status
router.get('/status', authMiddleware, (req, res) => {
  const db = getDb();
  const user = db.prepare(
    'SELECT plan, stripe_customer_id, stripe_subscription_id, analyses_used FROM users WHERE id = ?'
  ).get(req.userId);

  res.json({
    plan: user.plan,
    analyses_used: user.analyses_used,
    has_stripe_account: !!user.stripe_customer_id,
  });
});

module.exports = router;
