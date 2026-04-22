require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const { initDb } = require('./db/database');
const authRoutes = require('./routes/auth');
const contractRoutes = require('./routes/contracts');
const analysisRoutes = require('./routes/analysis');
const billingRoutes = require('./routes/billing');
const feedbackRoutes = require('./routes/feedback');

const app = express();

// Stripe webhook needs raw body — mount BEFORE express.json()
app.use('/api/billing/webhook', express.raw({ type: 'application/json' }));

// In production the frontend is served from the same origin, so CORS is only
// needed in development (Vite dev server on a different port).
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }));
}

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Global error handler (must stay before static/SPA handlers)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// In production, serve the built React frontend and handle SPA client-side routing.
// This block comes last so API routes always take priority.
if (process.env.NODE_ENV === 'production') {
  const DIST = path.join(__dirname, '../frontend/dist');
  app.use(express.static(DIST));
  app.get('*', (req, res) => res.sendFile(path.join(DIST, 'index.html')));
}

// Initialise the database before accepting any traffic.
const PORT = process.env.PORT || 3001;
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`ScopeGuard backend running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialise database:', err);
    process.exit(1);
  });
