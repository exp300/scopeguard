const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { query } = require('../db/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') return cb(null, true);
    cb(new Error('Only PDF files are accepted'));
  },
});

// GET /api/contracts
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { rows: contracts } = await query(
      `SELECT id, name, filename, created_at,
         (SELECT COUNT(*)::int FROM analyses WHERE contract_id = contracts.id) AS analysis_count
       FROM contracts WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.userId]
    );
    res.json({ contracts });
  } catch (err) {
    console.error('[contracts] list error:', err.message);
    res.status(500).json({ error: 'Failed to fetch contracts' });
  }
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
    if (!textContent) throw new Error('PDF appears to be empty or image-only');
  } catch (err) {
    fs.unlinkSync(req.file.path);
    return res.status(422).json({ error: `Could not extract text from PDF: ${err.message}` });
  }

  fs.unlinkSync(req.file.path);

  try {
    const { rows } = await query(
      `INSERT INTO contracts (user_id, name, filename, text_content)
       VALUES ($1, $2, $3, $4) RETURNING id, created_at`,
      [req.userId, name.trim(), req.file.originalname, textContent]
    );
    const contract = rows[0];

    res.status(201).json({
      contract: {
        id: contract.id,
        name: name.trim(),
        filename: req.file.originalname,
        analysis_count: 0,
        created_at: contract.created_at,
      },
    });
  } catch (err) {
    console.error('[contracts] insert error:', err.message);
    res.status(500).json({ error: 'Failed to save contract' });
  }
});

// GET /api/contracts/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT id, name, filename, text_content, created_at FROM contracts WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );
    const contract = rows[0];
    if (!contract) return res.status(404).json({ error: 'Contract not found' });
    res.json({ contract });
  } catch (err) {
    console.error('[contracts] get error:', err.message);
    res.status(500).json({ error: 'Failed to fetch contract' });
  }
});

// DELETE /api/contracts/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT id FROM contracts WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Contract not found' });

    await query('DELETE FROM contracts WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('[contracts] delete error:', err.message);
    res.status(500).json({ error: 'Failed to delete contract' });
  }
});

// Multer error handler
router.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large. Maximum size is 10 MB.' });
  }
  res.status(400).json({ error: err.message });
});

module.exports = router;
