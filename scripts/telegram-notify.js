#!/usr/bin/env node
/**
 * Telegram notification utility.
 *
 * Usage (as module):
 *   import { sendTelegram } from './telegram-notify.js';
 *   await sendTelegram('Hello');
 *
 * Usage (CLI):
 *   node scripts/telegram-notify.js "message text"
 *   echo "piped text" | node scripts/telegram-notify.js
 *
 * Requires env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_ENV = resolve(__dirname, '..', '.env');

if (existsSync(ROOT_ENV)) {
  for (const line of readFileSync(ROOT_ENV, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}

const TG_API = 'https://api.telegram.org';

export async function sendTelegram(text, { parseMode = 'HTML', disablePreview = true } = {}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) throw new Error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set');

  const res = await fetch(`${TG_API}/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: parseMode,
      disable_web_page_preview: disablePreview,
    }),
  });

  const data = await res.json();
  if (!data.ok) throw new Error(`Telegram error: ${data.description}`);
  return data.result;
}

// CLI entrypoint
if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = process.argv.slice(2).join(' ');
  const stdinText = process.stdin.isTTY ? '' : readFileSync(0, 'utf8');
  const text = (arg || stdinText).trim();
  if (!text) {
    console.error('Usage: node telegram-notify.js "message" | echo "msg" | node telegram-notify.js');
    process.exit(1);
  }
  sendTelegram(text)
    .then((r) => console.log(`Sent (message_id=${r.message_id})`))
    .catch((e) => { console.error(e.message); process.exit(1); });
}
