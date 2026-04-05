const jwt = require('jsonwebtoken');

// Must match the fallback used in routes/auth.js when JWT_SECRET env var is absent.
const JWT_SECRET = process.env.JWT_SECRET || 'temporary-hardcoded-secret-for-railway-debug';

console.log('[middleware/auth] JWT_SECRET source:', process.env.JWT_SECRET ? 'env var' : 'hardcoded fallback');
console.log('[middleware/auth] JWT_SECRET first 6 chars:', JWT_SECRET.slice(0, 6));

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    console.warn('[middleware/auth]', req.method, req.path, '— no Authorization header');
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = header.slice(7);
  console.log('[middleware/auth]', req.method, req.path, '— token received, first 20 chars:', token.slice(0, 20));

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    console.log('[middleware/auth] token valid — userId:', payload.userId);
    req.userId = payload.userId;
    next();
  } catch (err) {
    console.error('[middleware/auth] jwt.verify failed:', err.message, '— secret first 6:', JWT_SECRET.slice(0, 6));
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
