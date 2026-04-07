const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
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

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Always return 200 so we don't reveal whether the email exists
  res.json({ message: 'If that email is registered, a reset link has been logged to the server console.' });

  try {
    const { rows } = await query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    if (!rows[0]) return; // silent — already responded

    const userId = rows[0].id;
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, token, expiresAt]
    );

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
    console.log('');
    console.log('=== PASSWORD RESET TOKEN ===');
    console.log(`Email: ${email.toLowerCase()}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log(`Expires: ${expiresAt.toISOString()}`);
    console.log('============================');
    console.log('');
  } catch (err) {
    console.error('[auth] forgot-password error:', err.message);
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  try {
    const { rows } = await query(
      'SELECT * FROM password_reset_tokens WHERE token = $1',
      [token]
    );
    const resetToken = rows[0];

    if (!resetToken) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    if (resetToken.used) {
      return res.status(400).json({ error: 'This reset link has already been used' });
    }
    if (new Date() > new Date(resetToken.expires_at)) {
      return res.status(400).json({ error: 'Reset link has expired. Please request a new one.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, resetToken.user_id]);
    await query('UPDATE password_reset_tokens SET used = TRUE WHERE id = $1', [resetToken.id]);

    console.log('[auth] Password reset success — userId:', resetToken.user_id);

    res.json({ message: 'Password updated successfully. You can now log in.' });
  } catch (err) {
    console.error('[auth] reset-password error:', err.message);
    res.status(500).json({ error: 'Password reset failed. Please try again.' });
  }
});

module.exports = router;
