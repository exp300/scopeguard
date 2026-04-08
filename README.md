# ScopeGuard 🛡️

**AI-powered scope creep detector for freelancers.**

Upload your contract → paste a client message → Claude instantly tells you if the request is IN scope, OUT of scope, or AMBIGUOUS — with the exact contract clause cited and a ready-to-send professional reply.

🔗 **Live demo:** https://scopeguard-production-a7ef.up.railway.app/

---

## Why I built this

As a freelancer, I got burned by scope creep more than once. A client would send a "quick request" that turned into 10 hours of unpaid work — and I had no easy way to check if it was actually in the contract. I built ScopeGuard to solve exactly that: paste the message, get an instant answer with the exact clause cited. No more digging through PDFs at midnight.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Tailwind CSS, Vite |
| Backend | Node.js, Express |
| AI | Anthropic Claude (`claude-sonnet-4-20250514`) |
| Database | SQLite (better-sqlite3) |
| Auth | JWT (email/password) |
| Payments | Stripe Subscriptions |
| PDF parsing | pdf-parse |

---

## Plans

| | Free | Pro |
|---|---|---|
| Analyses | 5 total | Unlimited |
| Contracts | Unlimited | Unlimited |
| Price | $0 | $19/month |

---

## Setup

### 1. Clone & install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys
```

Required keys:
- `ANTHROPIC_API_KEY` — get from [console.anthropic.com](https://console.anthropic.com)
- `STRIPE_SECRET_KEY` — from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- `STRIPE_PRO_PRICE_ID` — create a $19/month recurring price in Stripe → Products
- `STRIPE_WEBHOOK_SECRET` — see Stripe Webhooks section below
- `JWT_SECRET` — any random string (32+ chars)

### 3. Run development servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# → http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# → http://localhost:5173
```

### 4. Stripe Webhooks (local testing)

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:

```bash
stripe listen --forward-to localhost:3001/api/billing/webhook
```

Copy the `whsec_...` secret it prints into your `.env` as `STRIPE_WEBHOOK_SECRET`.

---

## Project Structure
