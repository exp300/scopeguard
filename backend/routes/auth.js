const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../db/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

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
    const db = getDb();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = db.prepare(
      'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)'
    ).run(email.toLowerCase(), passwordHash, name);

    console.log('[auth] Register success — userId:', result.lastInsertRowid, 'email:', email.toLowerCase());

    const token = jwt.sign({ userId: result.lastInsertRowid }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      token,
      user: { id: result.lastInsertRowid, email: email.toLowerCase(), name, plan: 'free', analyses_used: 0 },
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
    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
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

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

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

// GET /api/auth/me — returns current user info
router.get('/me', authMiddleware, (req, res) => {
  const db = getDb();
  const user = db.prepare(
    'SELECT id, email, name, plan, analyses_used, hourly_rate FROM users WHERE id = ?'
  ).get(req.userId);

  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

// PATCH /api/auth/hourly-rate — update hourly rate for revenue calc
router.patch('/hourly-rate', authMiddleware, (req, res) => {
  const { hourly_rate } = req.body;
  if (typeof hourly_rate !== 'number' || hourly_rate < 0) {
    return res.status(400).json({ error: 'hourly_rate must be a non-negative number' });
  }

  const db = getDb();
  db.prepare('UPDATE users SET hourly_rate = ? WHERE id = ?').run(hourly_rate, req.userId);
  res.json({ success: true });
});

module.exports = router;
