const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Resend } = require('resend');
const { query } = require('../db/database');
const authMiddleware = require('../middleware/auth');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';

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
  res.json({ message: 'If that email is registered, you\'ll receive a reset link shortly.' });

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

    if (resend) {
      const { error: emailError } = await resend.emails.send({
        from: EMAIL_FROM,
        to: email.toLowerCase(),
        subject: 'Reset your ScopeGuard password',
        html: buildResetEmailHtml(resetUrl),
      });
      if (emailError) {
        console.error('[auth] Resend error:', emailError);
        // Fall through to console log as backup
      } else {
        console.log('[auth] Password reset email sent to:', email.toLowerCase());
        return;
      }
    }

    // Fallback: log to console when Resend is not configured
    console.log('');
    console.log('=== PASSWORD RESET TOKEN (no email service configured) ===');
    console.log(`Email: ${email.toLowerCase()}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log(`Expires: ${expiresAt.toISOString()}`);
    console.log('===========================================================');
    console.log('');
  } catch (err) {
    console.error('[auth] forgot-password error:', err.message);
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  console.log('[auth] reset-password hit — body keys:', Object.keys(req.body));
  const { token, password } = req.body;
  console.log('[auth] reset-password — token received:', token ? `${token.slice(0, 12)}… (${token.length} chars)` : 'MISSING');

  if (!token || !password) {
    console.warn('[auth] reset-password — missing token or password');
    return res.status(400).json({ error: 'Token and new password are required' });
  }
  if (password.length < 8) {
    console.warn('[auth] reset-password — password too short');
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  try {
    const { rows } = await query(
      'SELECT * FROM password_reset_tokens WHERE token = $1',
      [token]
    );
    const resetToken = rows[0];
    console.log('[auth] reset-password — DB lookup result:', resetToken ? `found (userId ${resetToken.user_id}, used ${resetToken.used}, expires ${resetToken.expires_at})` : 'NOT FOUND');

    if (!resetToken) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    if (resetToken.used) {
      console.warn('[auth] reset-password — token already used, userId:', resetToken.user_id);
      return res.status(400).json({ error: 'This reset link has already been used' });
    }
    if (new Date() > new Date(resetToken.expires_at)) {
      console.warn('[auth] reset-password — token expired at:', resetToken.expires_at);
      return res.status(400).json({ error: 'Reset link has expired. Please request a new one.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, resetToken.user_id]);
    await query('UPDATE password_reset_tokens SET used = TRUE WHERE id = $1', [resetToken.id]);

    console.log('[auth] reset-password success — userId:', resetToken.user_id);

    res.json({ message: 'Password updated successfully. You can now log in.' });
  } catch (err) {
    console.error('[auth] reset-password error:', err.message, err.stack);
    res.status(500).json({ error: 'Password reset failed. Please try again.' });
  }
});

function buildResetEmailHtml(resetUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset your ScopeGuard password</title>
</head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:#4f6ef7;padding:32px 40px;text-align:center;">
              <span style="font-size:36px;">🛡️</span>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">ScopeGuard</h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">AI Scope Creep Detector</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 12px;font-size:20px;color:#111827;font-weight:600;">Reset your password</h2>
              <p style="margin:0 0 24px;font-size:15px;color:#4b5563;line-height:1.6;">
                We received a request to reset the password for your ScopeGuard account.
                Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.
              </p>

              <!-- CTA button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 32px;">
                    <a href="${resetUrl}"
                       style="display:inline-block;background:#4f6ef7;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px;">
                      Reset password →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;">
                If the button doesn't work, copy and paste this URL into your browser:
              </p>
              <p style="margin:0 0 32px;font-size:12px;color:#6b7280;word-break:break-all;">
                <a href="${resetUrl}" style="color:#4f6ef7;">${resetUrl}</a>
              </p>

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 24px;" />

              <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
                If you didn't request a password reset, you can safely ignore this email —
                your password will not change. If you're concerned, please reply to this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #f3f4f6;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                © ${new Date().getFullYear()} ScopeGuard · AI-powered scope creep protection for freelancers
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = router;
