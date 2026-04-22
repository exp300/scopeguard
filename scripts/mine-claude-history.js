#!/usr/bin/env node
/**
 * Claude Code conversation miner.
 *
 * Reads all .jsonl files from the local Claude Code project directory,
 * extracts the user's own messages (not tool results, not assistant replies),
 * and writes them to scripts/user-voice.json.
 *
 * Useful as a source of authentic voice/topics when drafting content
 * (Reddit posts, blog articles, video scripts).
 *
 * Usage: node scripts/mine-claude-history.js
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { homedir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_DIR = resolve(
  homedir(),
  '.claude/projects/-Users-oleksandr-projects-market-research-scopeguard',
);
const OUTPUT_PATH = join(__dirname, 'user-voice.json');

// Messages shorter than this are likely reactions ("ok", "yes") — low signal
const MIN_LENGTH = 30;
// System reminders and tool results we don't want
const SKIP_PREFIXES = ['<system-reminder>', '<command-name>', 'Caveat:', '<local-command-stdout>'];

function extractText(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return null;
  // Skip list items that are tool_result or image — keep only plain text
  const textParts = content
    .filter((c) => c && typeof c === 'object' && c.type === 'text' && typeof c.text === 'string')
    .map((c) => c.text);
  return textParts.join('\n') || null;
}

function isAuthentic(text) {
  if (!text) return false;
  const t = text.trim();
  if (t.length < MIN_LENGTH) return false;
  if (SKIP_PREFIXES.some((p) => t.startsWith(p))) return false;
  // Skip paste-in code/logs — heuristic: >70% non-letter chars
  const letters = (t.match(/[a-zA-Zа-яА-ЯёЁ]/g) || []).length;
  if (letters / t.length < 0.3) return false;
  return true;
}

function main() {
  let files;
  try {
    files = readdirSync(PROJECT_DIR).filter((f) => f.endsWith('.jsonl'));
  } catch (err) {
    console.error(`Could not read ${PROJECT_DIR}: ${err.message}`);
    process.exit(1);
  }

  console.log(`Scanning ${files.length} session file(s)…\n`);

  const messages = [];

  for (const file of files) {
    const path = join(PROJECT_DIR, file);
    const lines = readFileSync(path, 'utf8').split('\n').filter(Boolean);
    let kept = 0;
    for (const line of lines) {
      let row;
      try { row = JSON.parse(line); } catch { continue; }
      if (row.type !== 'user') continue;
      const text = extractText(row.message?.content);
      if (!isAuthentic(text)) continue;
      messages.push({
        session: file.replace('.jsonl', ''),
        timestamp: row.timestamp || null,
        text: text.trim(),
        length: text.trim().length,
      });
      kept++;
    }
    console.log(`  ${file.slice(0, 8)}… → ${kept} authentic user messages`);
  }

  // Sort newest first
  messages.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));

  const stats = {
    total_messages: messages.length,
    total_sessions: files.length,
    total_chars: messages.reduce((s, m) => s + m.length, 0),
    avg_length: messages.length ? Math.round(messages.reduce((s, m) => s + m.length, 0) / messages.length) : 0,
    generated_at: new Date().toISOString(),
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify({ stats, messages }, null, 2));
  console.log(`\nSaved ${messages.length} messages to ${OUTPUT_PATH}`);
  console.log(`Total: ${stats.total_chars.toLocaleString()} chars across ${stats.total_sessions} sessions`);
}

main();
