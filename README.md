# ScopeGuard 🛡️

**AI-powered scope creep detector for freelancers.**

Upload your contract → paste a client message → Claude instantly tells you if the request is IN scope, OUT of scope, or AMBIGUOUS — with the exact contract clause cited and a ready-to-send professional reply.

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

The webhook handles these events:
- `checkout.session.completed` → upgrades user to Pro
- `customer.subscription.deleted` → downgrades back to Free
- `invoice.payment_failed` → logged (add email notification here)

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | ✓ | Get current user |
| PATCH | `/api/auth/hourly-rate` | ✓ | Set hourly rate |
| GET | `/api/contracts` | ✓ | List contracts |
| POST | `/api/contracts` | ✓ | Upload PDF contract |
| GET | `/api/contracts/:id` | ✓ | Get contract with text |
| DELETE | `/api/contracts/:id` | ✓ | Delete contract |
| POST | `/api/analysis` | ✓ | Run scope analysis |
| GET | `/api/analysis` | ✓ | Full history |
| GET | `/api/analysis/contract/:id` | ✓ | History per contract |
| GET | `/api/analysis/stats/summary` | ✓ | Stats + revenue protected |
| POST | `/api/billing/checkout` | ✓ | Create Stripe checkout session |
| POST | `/api/billing/portal` | ✓ | Create Stripe customer portal |
| POST | `/api/billing/webhook` | — | Stripe webhook (raw body) |
| GET | `/api/billing/status` | ✓ | Get billing status |

---

## Plans

| | Free | Pro |
|---|---|---|
| Analyses | 5 total | Unlimited |
| Contracts | Unlimited | Unlimited |
| Price | $0 | $19/month |

---

## Project Structure

```
scopeguard/
  backend/
    server.js              # Express app entry point
    routes/
      auth.js              # Register, login, /me
      contracts.js         # PDF upload, list, delete
      analysis.js          # Claude API analysis engine
      billing.js           # Stripe checkout, portal, webhook
    db/
      schema.sql           # SQLite table definitions
      database.js          # DB connection singleton
    middleware/
      auth.js              # JWT verification
    uploads/               # Temp PDF storage (cleared after parsing)
    .env.example
  frontend/
    src/
      api.js               # Axios instance with JWT interceptor
      App.jsx              # Router + auth gates
      context/
        AuthContext.jsx    # Global auth state
      components/
        Layout.jsx         # Sidebar navigation shell
        VerdictBadge.jsx   # IN_SCOPE / OUT_SCOPE / AMBIGUOUS badge
        ContractUploadModal.jsx  # Drag-and-drop PDF uploader
      pages/
        Login.jsx
        Register.jsx
        Dashboard.jsx      # Stats, contracts list, recent analyses
        Analyze.jsx        # Main analysis flow + result display
        History.jsx        # Full analysis history with expand/collapse
        Billing.jsx        # Plan comparison, Stripe checkout, portal
```
