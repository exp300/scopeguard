const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Shared in-memory rate limit store
// Key: "check:<ip>" or "co:<ip>", value: { count, resetAt }
const limits = new Map();
const DAY_MS = 24 * 60 * 60 * 1000;

function getIp(req) {
  return (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown')
    .split(',')[0].trim();
}

function consume(key, maxPerDay) {
  const now = Date.now();
  const e = limits.get(key);
  if (!e || now > e.resetAt) {
    limits.set(key, { count: 1, resetAt: now + DAY_MS });
    return { ok: true };
  }
  if (e.count >= maxPerDay) {
    return { ok: false, resetInMin: Math.ceil((e.resetAt - now) / 60000) };
  }
  e.count++;
  return { ok: true };
}

// POST /api/free/check — anonymous contract checker, 1/day per IP
router.post('/check', async (req, res) => {
  const { contract_text, client_request } = req.body || {};

  if (!contract_text?.trim() || !client_request?.trim()) {
    return res.status(400).json({ error: 'contract_text and client_request are required' });
  }

  const ip = getIp(req);
  const { ok, resetInMin } = consume(`check:${ip}`, 1);
  if (!ok) {
    return res.status(429).json({
      error: `You've used your free check for today. Try again in ${resetInMin} minutes, or sign up for unlimited checks.`,
      code: 'RATE_LIMITED',
    });
  }

  const contractText = contract_text.trim().slice(0, 30000);
  const clientRequest = client_request.trim().slice(0, 2000);

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      systemInstruction:
        'You are a contract compliance expert specializing in freelance agreements. ' +
        'Analyze whether a client\'s request falls within the scope of the provided contract. ' +
        'Be precise, cite exact clauses word-for-word, and protect the freelancer\'s interests. ' +
        'Always respond with valid JSON only — no markdown fences, no extra text.',
      generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 1024 },
    });

    const prompt =
      `CONTRACT:\n${contractText}\n\n` +
      `CLIENT REQUEST:\n${clientRequest}\n\n` +
      `Respond ONLY in this exact JSON format:\n` +
      `{\n` +
      `  "verdict": "IN_SCOPE" | "OUT_SCOPE" | "AMBIGUOUS",\n` +
      `  "confidence": <integer 0-100>,\n` +
      `  "contract_clause": "<exact verbatim quote from the contract that is most relevant>",\n` +
      `  "reasoning": "<2-3 sentence explanation of your decision>",\n` +
      `  "suggested_reply": "<professional, firm but polite message the freelancer can send directly to the client>"\n` +
      `}`;

    const response = await model.generateContent(prompt);
    const result = JSON.parse(response.response.text().trim());

    if (!['IN_SCOPE', 'OUT_SCOPE', 'AMBIGUOUS'].includes(result.verdict)) {
      throw new Error('Invalid verdict');
    }

    res.json({ result });
  } catch (err) {
    console.error('[free/check] error:', err.message);
    res.status(502).json({ error: 'AI analysis failed. Please try again.' });
  }
});

// POST /api/free/change-order — change order generator, 2/day per IP
router.post('/change-order', async (req, res) => {
  const { client_name, project_name, original_scope, new_request, hourly_rate, estimated_hours } =
    req.body || {};

  if (!project_name?.trim() || !new_request?.trim()) {
    return res.status(400).json({ error: 'project_name and new_request are required' });
  }

  const ip = getIp(req);
  const { ok, resetInMin } = consume(`co:${ip}`, 2);
  if (!ok) {
    return res.status(429).json({
      error: `You've used your free change orders for today. Try again in ${resetInMin} minutes.`,
      code: 'RATE_LIMITED',
    });
  }

  const rate = parseFloat(hourly_rate) || null;
  const hours = parseFloat(estimated_hours) || null;
  const totalCost = rate && hours ? (rate * hours).toFixed(2) : null;

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      systemInstruction:
        'You are a freelance business expert. Generate professional change order documents. ' +
        'Always respond with valid JSON only — no markdown fences, no extra text.',
      generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 1500 },
    });

    const prompt =
      `Generate a professional change order document for a freelance project.\n\n` +
      `Client: ${client_name?.trim() || 'Client'}\n` +
      `Project: ${project_name.trim()}\n` +
      `Original scope: ${original_scope?.trim() || 'As previously agreed'}\n` +
      `New request: ${new_request.trim()}\n` +
      `Hourly rate: ${rate ? '$' + rate + '/hr' : 'not specified'}\n` +
      `Estimated additional hours: ${hours || 'not specified'}\n` +
      `Total additional cost: ${totalCost ? '$' + totalCost : 'to be determined'}\n\n` +
      `Respond ONLY in this exact JSON format:\n` +
      `{\n` +
      `  "subject": "<concise email subject line for sending this change order>",\n` +
      `  "document": "<the full change order document as plain text, with clear sections: header, description of change, cost breakdown, approval section>"\n` +
      `}`;

    const response = await model.generateContent(prompt);
    const result = JSON.parse(response.response.text().trim());

    res.json({ result });
  } catch (err) {
    console.error('[free/change-order] error:', err.message);
    res.status(502).json({ error: 'Generation failed. Please try again.' });
  }
});

module.exports = router;
