const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../db/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'temporary-hardcoded-secret-for-railway-debug';
console.log('[auth] JWT_SECRET present:', !!process.env.JWT_SECRET, 'length:', process.env.JWT_SECRET?.length);
console.log('[auth] JWT_SECRET source:', process.env.JWT_SECRET ? 'from env' : 'using fallback');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  try {
    const { rows: existing } = await query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const { rows } = await query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id',
      [email.toLowerCase(), passwordHash, name]
    );
    const userId = rows[0].id;

    console.log('[auth] Register success — userId:', userId, 'email:', email.toLowerCase());

    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: userId, email: email.toLowerCase(), name, plan: 'free', analyses_used: 0 },
    });
  } catch (err) {
    console.error('[auth] Register error:', err.message, err.stack);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { rows } = await query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    const user = rows[0];

    if (!user) {
      console.log('[auth] Login failed — no user found for:', email.toLowerCase());
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      console.log('[auth] Login failed — wrong password for:', email.toLowerCase());
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('[auth] Login success — userId:', user.id, 'email:', user.email);

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        analyses_used: user.analyses_used,
        hourly_rate: user.hourly_rate,
      },
    });
  } catch (err) {
    console.error('[auth] Login error:', err.message, err.stack);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT id, email, name, plan, analyses_used, hourly_rate FROM users WHERE id = $1',
      [req.userId]
    );
    const user = rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error('[auth] /me error:', err.message);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PATCH /api/auth/hourly-rate
router.patch('/hourly-rate', authMiddleware, async (req, res) => {
  const { hourly_rate } = req.body;
  if (typeof hourly_rate !== 'number' || hourly_rate < 0) {
    return res.status(400).json({ error: 'hourly_rate must be a non-negative number' });
  }

  try {
    await query('UPDATE users SET hourly_rate = $1 WHERE id = $2', [hourly_rate, req.userId]);
    res.json({ success: true });
  } catch (err) {
    console.error('[auth] hourly-rate error:', err.message);
    res.status(500).json({ error: 'Failed to update hourly rate' });
  }
});

module.exports = router;
