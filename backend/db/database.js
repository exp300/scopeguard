const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

// Allow overriding DB path via env var (useful for Railway volumes)
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'scopeguard.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let db = null; // sql.js Database instance

// ─── Persistence ──────────────────────────────────────────────────────────────

function saveDb() {
  try {
    const data = db.export(); // returns Uint8Array
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  } catch (err) {
    // Log but don't crash — the in-memory DB is still usable for the request
    console.error('[DB] saveDb failed — data may not persist across restarts:', err.message);
  }
}

// ─── better-sqlite3-compatible wrapper ────────────────────────────────────────

function prepare(sql) {
  return {
    get(...params) {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      const row = stmt.step() ? stmt.getAsObject() : undefined;
      stmt.free();
      return row;
    },

    all(...params) {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      const rows = [];
      while (stmt.step()) rows.push(stmt.getAsObject());
      stmt.free();
      return rows;
    },

    run(...params) {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      stmt.step();
      stmt.free();

      const idResult = db.exec('SELECT last_insert_rowid()');
      const lastInsertRowid = idResult[0]?.values[0][0] ?? 0;

      saveDb();
      return { lastInsertRowid };
    },
  };
}

function exec(sql) {
  // db.exec() handles multiple semicolon-separated statements, db.run() does not
  db.exec(sql);
  saveDb();
}

const dbProxy = { prepare, exec };

function getDb() {
  if (!db) throw new Error('Database not initialised — call initDb() first');
  return dbProxy;
}

// ─── Async initialisation ─────────────────────────────────────────────────────

async function initDb() {
  console.log('[DB] Initialising sql.js...');
  console.log('[DB] DB_PATH:', DB_PATH);
  console.log('[DB] SCHEMA_PATH:', SCHEMA_PATH);
  console.log('[DB] NODE_ENV:', process.env.NODE_ENV);

  const SQL = await initSqlJs();
  console.log('[DB] sql.js WASM loaded');

  if (fs.existsSync(DB_PATH)) {
    console.log('[DB] Existing database file found, loading from disk');
    const fileBuffer = fs.readFileSync(DB_PATH);
    console.log('[DB] File size:', fileBuffer.length, 'bytes');
    db = new SQL.Database(fileBuffer);
  } else {
    console.log('[DB] No database file found, creating fresh database');
    db = new SQL.Database();
  }

  // Enable foreign key enforcement
  db.run('PRAGMA foreign_keys = ON');

  // Apply schema — MUST use db.exec() here, not db.run().
  // db.run() only executes the FIRST statement; db.exec() handles all three
  // CREATE TABLE statements in schema.sql.
  console.log('[DB] Applying schema...');
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  try {
    db.exec(schema);
    console.log('[DB] Schema applied successfully');
  } catch (err) {
    console.error('[DB] Schema application failed:', err.message);
    throw err;
  }

  // Verify all three tables exist
  const tables = db
    .exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
    [0]?.values.map(r => r[0]) ?? [];
  console.log('[DB] Tables present:', tables.join(', ') || '(none)');

  const expected = ['analyses', 'contracts', 'users'];
  const missing = expected.filter(t => !tables.includes(t));
  if (missing.length > 0) {
    throw new Error(`[DB] Missing tables after schema init: ${missing.join(', ')}`);
  }

  // Persist initial state
  saveDb();
  console.log('[DB] Database ready');
}

module.exports = { getDb, initDb };
