const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getDb } = require('../db/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const FREE_TIER_LIMIT = 5;

// POST /api/analysis — run a scope analysis
router.post('/', authMiddleware, async (req, res) => {
  const { contract_id, client_message, hours_at_risk = 0 } = req.body;

  if (!contract_id || !client_message?.trim()) {
    return res.status(400).json({ error: 'contract_id and client_message are required' });
  }

  const db = getDb();

  // Check plan limits
  const user = db.prepare('SELECT plan, analyses_used FROM users WHERE id = ?').get(req.userId);
  if (user.plan === 'free' && user.analyses_used >= FREE_TIER_LIMIT) {
    return res.status(403).json({
      error: 'Free tier limit reached',
      code: 'UPGRADE_REQUIRED',
      message: `You've used all ${FREE_TIER_LIMIT} free analyses. Upgrade to Pro for unlimited.`,
    });
  }

  // Fetch the contract (must belong to this user)
  const contract = db.prepare(
    'SELECT text_content FROM contracts WHERE id = ? AND user_id = ?'
  ).get(contract_id, req.userId);
  if (!contract) {
    return res.status(404).json({ error: 'Contract not found' });
  }

  // Trim contract text — gemini-1.5-flash has a 1M token window, 40K chars is plenty
  const contractText = contract.text_content.slice(0, 40000);

  let result;
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      systemInstruction:
        'You are a contract compliance expert specializing in freelance agreements. ' +
        'Analyze whether a client\'s request falls within the scope of the provided contract. ' +
        'Be precise, cite exact clauses word-for-word, and protect the freelancer\'s interests. ' +
        'Always respond with valid JSON only — no markdown fences, no extra text.',
      generationConfig: {
        responseMimeType: 'application/json',
        maxOutputTokens: 1024,
      },
    });

    const prompt =
      `CONTRACT:\n${contractText}\n\n` +
      `CLIENT REQUEST:\n${client_message.trim()}\n\n` +
      `Respond ONLY in this exact JSON format:\n` +
      `{\n` +
      `  "verdict": "IN_SCOPE" | "OUT_SCOPE" | "AMBIGUOUS",\n` +
      `  "confidence": <integer 0-100>,\n` +
      `  "contract_clause": "<exact verbatim quote from the contract that is most relevant>",\n` +
      `  "reasoning": "<2-3 sentence explanation of your decision>",\n` +
      `  "suggested_reply": "<professional, firm but polite message the freelancer can send directly to the client>"\n` +
      `}`;

    const response = await model.generateContent(prompt);
    const rawText = response.response.text().trim();
    result = JSON.parse(rawText);

    // Validate expected fields
    if (!['IN_SCOPE', 'OUT_SCOPE', 'AMBIGUOUS'].includes(result.verdict)) {
      throw new Error('Invalid verdict value from AI');
    }
  } catch (err) {
    console.error('Gemini API / parse error:', err);
    return res.status(502).json({ error: 'AI analysis failed. Please try again.' });
  }

  // Persist analysis
  const insert = db.prepare(
    `INSERT INTO analyses (user_id, contract_id, client_message, verdict, confidence,
       contract_clause, reasoning, suggested_reply, hours_at_risk)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    req.userId, contract_id, client_message.trim(),
    result.verdict, result.confidence,
    result.contract_clause, result.reasoning, result.suggested_reply,
    parseFloat(hours_at_risk) || 0
  );

  // Increment usage counter
  db.prepare('UPDATE users SET analyses_used = analyses_used + 1 WHERE id = ?').run(req.userId);

  res.status(201).json({
    analysis: {
      id: insert.lastInsertRowid,
      contract_id,
      client_message: client_message.trim(),
      verdict: result.verdict,
      confidence: result.confidence,
      contract_clause: result.contract_clause,
      reasoning: result.reasoning,
      suggested_reply: result.suggested_reply,
      hours_at_risk: parseFloat(hours_at_risk) || 0,
      created_at: new Date().toISOString(),
    },
  });
});

// GET /api/analysis — get analysis history for current user (all contracts)
router.get('/', authMiddleware, (req, res) => {
  const db = getDb();
  const analyses = db.prepare(
    `SELECT a.*, c.name AS contract_name
     FROM analyses a
     JOIN contracts c ON c.id = a.contract_id
     WHERE a.user_id = ?
     ORDER BY a.created_at DESC
     LIMIT 100`
  ).all(req.userId);

  res.json({ analyses });
});

// GET /api/analysis/contract/:contractId — history for a specific contract
router.get('/contract/:contractId', authMiddleware, (req, res) => {
  const db = getDb();

  // Verify ownership
  const contract = db.prepare(
    'SELECT id, name FROM contracts WHERE id = ? AND user_id = ?'
  ).get(req.params.contractId, req.userId);
  if (!contract) return res.status(404).json({ error: 'Contract not found' });

  const analyses = db.prepare(
    `SELECT * FROM analyses WHERE contract_id = ? AND user_id = ?
     ORDER BY created_at DESC`
  ).all(req.params.contractId, req.userId);

  res.json({ contract, analyses });
});

// GET /api/analysis/stats — revenue protected summary
router.get('/stats/summary', authMiddleware, (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT hourly_rate, plan, analyses_used FROM users WHERE id = ?').get(req.userId);

  const stats = db.prepare(
    `SELECT
       COUNT(*) AS total_analyses,
       SUM(CASE WHEN verdict = 'OUT_SCOPE' THEN hours_at_risk ELSE 0 END) AS total_hours_at_risk,
       COUNT(CASE WHEN verdict = 'OUT_SCOPE' THEN 1 END) AS out_of_scope_count,
       COUNT(CASE WHEN verdict = 'IN_SCOPE' THEN 1 END) AS in_scope_count,
       COUNT(CASE WHEN verdict = 'AMBIGUOUS' THEN 1 END) AS ambiguous_count
     FROM analyses WHERE user_id = ?`
  ).get(req.userId);

  const revenueProtected = Math.round((stats.total_hours_at_risk || 0) * (user.hourly_rate || 0));

  res.json({
    stats: {
      ...stats,
      hourly_rate: user.hourly_rate,
      revenue_protected: revenueProtected,
      plan: user.plan,
      analyses_used: user.analyses_used,
      analyses_remaining: user.plan === 'free' ? Math.max(0, FREE_TIER_LIMIT - user.analyses_used) : null,
    },
  });
});

module.exports = router;
