const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { getDb } = require('../db/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Store uploads in /uploads directory, keep original extension
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') return cb(null, true);
    cb(new Error('Only PDF files are accepted'));
  },
});

// GET /api/contracts — list all contracts for current user
router.get('/', authMiddleware, (req, res) => {
  const db = getDb();
  const contracts = db.prepare(
    `SELECT id, name, filename, created_at,
       (SELECT COUNT(*) FROM analyses WHERE contract_id = contracts.id) AS analysis_count
     FROM contracts WHERE user_id = ? ORDER BY created_at DESC`
  ).all(req.userId);

  res.json({ contracts });
});

// POST /api/contracts — upload a new contract PDF
router.post('/', authMiddleware, upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file uploaded' });
  }

  const { name } = req.body;
  if (!name || !name.trim()) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: 'Contract name is required' });
  }

  let textContent;
  try {
    const buffer = fs.readFileSync(req.file.path);
    const parsed = await pdfParse(buffer);
    textContent = parsed.text.trim();
    if (!textContent) {
      throw new Error('PDF appears to be empty or image-only');
    }
  } catch (err) {
    fs.unlinkSync(req.file.path);
    return res.status(422).json({ error: `Could not extract text from PDF: ${err.message}` });
  }

  // Clean up the uploaded file — we store text in DB, no need to keep the PDF
  fs.unlinkSync(req.file.path);

  const db = getDb();
  const result = db.prepare(
    'INSERT INTO contracts (user_id, name, filename, text_content) VALUES (?, ?, ?, ?)'
  ).run(req.userId, name.trim(), req.file.originalname, textContent);

  res.status(201).json({
    contract: {
      id: result.lastInsertRowid,
      name: name.trim(),
      filename: req.file.originalname,
      analysis_count: 0,
      created_at: new Date().toISOString(),
    },
  });
});

// GET /api/contracts/:id — get single contract (with text preview)
router.get('/:id', authMiddleware, (req, res) => {
  const db = getDb();
  const contract = db.prepare(
    'SELECT id, name, filename, text_content, created_at FROM contracts WHERE id = ? AND user_id = ?'
  ).get(req.params.id, req.userId);

  if (!contract) return res.status(404).json({ error: 'Contract not found' });
  res.json({ contract });
});

// DELETE /api/contracts/:id
router.delete('/:id', authMiddleware, (req, res) => {
  const db = getDb();
  const contract = db.prepare(
    'SELECT id FROM contracts WHERE id = ? AND user_id = ?'
  ).get(req.params.id, req.userId);

  if (!contract) return res.status(404).json({ error: 'Contract not found' });

  db.prepare('DELETE FROM contracts WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// Multer error handler
router.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large. Maximum size is 10 MB.' });
  }
  res.status(400).json({ error: err.message });
});

module.exports = router;
