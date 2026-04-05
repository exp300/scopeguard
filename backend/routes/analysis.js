const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { query } = require('../db/database');
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

  try {
    // Check plan limits
    const { rows: userRows } = await query(
      'SELECT plan, analyses_used FROM users WHERE id = $1',
      [req.userId]
    );
    const user = userRows[0];
    if (user.plan === 'free' && user.analyses_used >= FREE_TIER_LIMIT) {
      return res.status(403).json({
        error: 'Free tier limit reached',
        code: 'UPGRADE_REQUIRED',
        message: `You've used all ${FREE_TIER_LIMIT} free analyses. Upgrade to Pro for unlimited.`,
      });
    }

    // Fetch the contract (must belong to this user)
    const { rows: contractRows } = await query(
      'SELECT text_content FROM contracts WHERE id = $1 AND user_id = $2',
      [contract_id, req.userId]
    );
    if (!contractRows[0]) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    const contractText = contractRows[0].text_content.slice(0, 40000);

    // Run Gemini analysis
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

      if (!['IN_SCOPE', 'OUT_SCOPE', 'AMBIGUOUS'].includes(result.verdict)) {
        throw new Error('Invalid verdict value from AI');
      }
    } catch (err) {
      console.error('Gemini API / parse error:', err);
      return res.status(502).json({ error: 'AI analysis failed. Please try again.' });
    }

    // Persist analysis
    const { rows: insertRows } = await query(
      `INSERT INTO analyses
         (user_id, contract_id, client_message, verdict, confidence,
          contract_clause, reasoning, suggested_reply, hours_at_risk)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, created_at`,
      [
        req.userId, contract_id, client_message.trim(),
        result.verdict, result.confidence,
        result.contract_clause, result.reasoning, result.suggested_reply,
        parseFloat(hours_at_risk) || 0,
      ]
    );
    const inserted = insertRows[0];

    // Increment usage counter
    await query(
      'UPDATE users SET analyses_used = analyses_used + 1 WHERE id = $1',
      [req.userId]
    );

    res.status(201).json({
      analysis: {
        id: inserted.id,
        contract_id,
        client_message: client_message.trim(),
        verdict: result.verdict,
        confidence: result.confidence,
        contract_clause: result.contract_clause,
        reasoning: result.reasoning,
        suggested_reply: result.suggested_reply,
        hours_at_risk: parseFloat(hours_at_risk) || 0,
        created_at: inserted.created_at,
      },
    });
  } catch (err) {
    console.error('[analysis] error:', err.message, err.stack);
    res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
});

// GET /api/analysis — full history for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { rows: analyses } = await query(
      `SELECT a.*, c.name AS contract_name
       FROM analyses a
       JOIN contracts c ON c.id = a.contract_id
       WHERE a.user_id = $1
       ORDER BY a.created_at DESC
       LIMIT 100`,
      [req.userId]
    );
    res.json({ analyses });
  } catch (err) {
    console.error('[analysis] history error:', err.message);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// GET /api/analysis/contract/:contractId — history for a specific contract
router.get('/contract/:contractId', authMiddleware, async (req, res) => {
  try {
    const { rows: contractRows } = await query(
      'SELECT id, name FROM contracts WHERE id = $1 AND user_id = $2',
      [req.params.contractId, req.userId]
    );
    if (!contractRows[0]) return res.status(404).json({ error: 'Contract not found' });

    const { rows: analyses } = await query(
      'SELECT * FROM analyses WHERE contract_id = $1 AND user_id = $2 ORDER BY created_at DESC',
      [req.params.contractId, req.userId]
    );

    res.json({ contract: contractRows[0], analyses });
  } catch (err) {
    console.error('[analysis] contract history error:', err.message);
    res.status(500).json({ error: 'Failed to fetch contract history' });
  }
});

// GET /api/analysis/stats/summary
router.get('/stats/summary', authMiddleware, async (req, res) => {
  try {
    const { rows: userRows } = await query(
      'SELECT hourly_rate, plan, analyses_used FROM users WHERE id = $1',
      [req.userId]
    );
    const user = userRows[0];

    const { rows: statsRows } = await query(
      `SELECT
         COUNT(*)::int                                                           AS total_analyses,
         COALESCE(SUM(CASE WHEN verdict = 'OUT_SCOPE' THEN hours_at_risk ELSE 0 END), 0) AS total_hours_at_risk,
         COUNT(CASE WHEN verdict = 'OUT_SCOPE'  THEN 1 END)::int                AS out_of_scope_count,
         COUNT(CASE WHEN verdict = 'IN_SCOPE'   THEN 1 END)::int                AS in_scope_count,
         COUNT(CASE WHEN verdict = 'AMBIGUOUS'  THEN 1 END)::int                AS ambiguous_count
       FROM analyses WHERE user_id = $1`,
      [req.userId]
    );
    const stats = statsRows[0];

    const revenueProtected = Math.round(
      parseFloat(stats.total_hours_at_risk) * (user.hourly_rate || 0)
    );

    res.json({
      stats: {
        ...stats,
        hourly_rate: user.hourly_rate,
        revenue_protected: revenueProtected,
        plan: user.plan,
        analyses_used: user.analyses_used,
        analyses_remaining: user.plan === 'free'
          ? Math.max(0, FREE_TIER_LIMIT - user.analyses_used)
          : null,
      },
    });
  } catch (err) {
    console.error('[analysis] stats error:', err.message);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
