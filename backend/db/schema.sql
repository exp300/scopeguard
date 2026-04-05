-- ScopeGuard database schema

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free',         -- 'free' | 'pro'
  analyses_used INTEGER NOT NULL DEFAULT 0,  -- lifetime count for free tier
  hourly_rate INTEGER NOT NULL DEFAULT 0,    -- for revenue protected calc
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contracts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                        -- e.g. "Nike redesign project"
  filename TEXT NOT NULL,                    -- original filename
  text_content TEXT NOT NULL,               -- extracted PDF text
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analyses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contract_id INTEGER NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  client_message TEXT NOT NULL,
  verdict TEXT NOT NULL,                     -- 'IN_SCOPE' | 'OUT_SCOPE' | 'AMBIGUOUS'
  confidence INTEGER NOT NULL,               -- 0-100
  contract_clause TEXT NOT NULL,
  reasoning TEXT NOT NULL,
  suggested_reply TEXT NOT NULL,
  hours_at_risk REAL NOT NULL DEFAULT 0,     -- user-estimated hours this request would take
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
