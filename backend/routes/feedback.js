const express = require('express');
const { sendTelegram } = require('../utils/telegram');

const router = express.Router();

// Simple per-IP rate limit: max 5 submissions per 10 minutes
const hits = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimit(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX_PER_WINDOW) return false;
  arr.push(now);
  hits.set(ip, arr);
  return true;
}

function escapeHtml(s = '') {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// POST /api/feedback
router.post('/', async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || 'unknown';
  if (!rateLimit(ip)) return res.status(429).json({ error: 'Too many requests, try again later' });

  const { type = 'feature', email = '', message = '' } = req.body || {};
  const clean = {
    type: String(type).slice(0, 32),
    email: String(email).slice(0, 200),
    message: String(message).trim().slice(0, 4000),
  };

  if (clean.message.length < 5) return res.status(400).json({ error: 'Message is too short' });

  const typeEmoji = { feature: '💡', bug: '🐛', other: '💬' }[clean.type] || '💬';
  const text = [
    `${typeEmoji} <b>New ${escapeHtml(clean.type)}</b>`,
    clean.email ? `From: <code>${escapeHtml(clean.email)}</code>` : 'From: anonymous',
    `IP: <code>${escapeHtml(ip)}</code>`,
    '',
    escapeHtml(clean.message),
  ].join('\n');

  try {
    await sendTelegram(text);
    res.json({ ok: true });
  } catch (err) {
    console.error('[feedback] telegram send failed:', err.message);
    // Still succeed to user so submission isn't lost from their POV; log server-side
    res.status(502).json({ error: 'Could not deliver message, try again later' });
  }
});

module.exports = router;
