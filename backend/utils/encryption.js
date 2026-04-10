const crypto = require('crypto');

// Derive a stable 32-byte AES-256 key from the env var (any length string).
// Falls back to null when ENCRYPTION_KEY is not set — callers skip encryption.
const KEY = process.env.ENCRYPTION_KEY
  ? crypto.scryptSync(process.env.ENCRYPTION_KEY, 'scopeguard-salt-v1', 32)
  : null;

console.log('[encryption] ENCRYPTION_KEY present:', !!process.env.ENCRYPTION_KEY);

/**
 * Encrypt a UTF-8 string with AES-256-GCM.
 * Returns a prefixed string: `enc:v1:<iv>:<tag>:<ciphertext>` (all hex).
 * If ENCRYPTION_KEY is not set, returns plaintext unchanged (dev fallback).
 */
function encrypt(text) {
  if (!KEY) return text;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `enc:v1:${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * Decrypt a string produced by encrypt().
 * Passes through plaintext that was stored before encryption was enabled.
 */
function decrypt(stored) {
  if (!stored || !stored.startsWith('enc:v1:')) return stored;
  if (!KEY) throw new Error('ENCRYPTION_KEY is required to decrypt contract data');
  const parts = stored.split(':');
  // parts: ['enc', 'v1', ivHex, tagHex, ciphertextHex]
  const [, , ivHex, tagHex, ctHex] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const ct = Buffer.from(ctHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString('utf8');
}

module.exports = { encrypt, decrypt };
