const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'scopeguard.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let db = null; // sql.js Database instance

// ─── Persistence ──────────────────────────────────────────────────────────────
// sql.js is in-memory. We manually load from / save to disk so data survives
// restarts. saveDb() is called after every mutating statement.

function saveDb() {
  const data = db.export(); // returns Uint8Array
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

// ─── better-sqlite3-compatible wrapper ────────────────────────────────────────
// The routes use db.prepare(sql).get(...params) / .all(...params) / .run(...params)
// and db.exec(sql). This thin wrapper mirrors that API so no route code changes.

function prepare(sql) {
  return {
    // Return first matching row as a plain object, or undefined if none.
    get(...params) {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      const row = stmt.step() ? stmt.getAsObject() : undefined;
      stmt.free();
      return row;
    },

    // Return all matching rows as an array of plain objects.
    all(...params) {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      const rows = [];
      while (stmt.step()) rows.push(stmt.getAsObject());
      stmt.free();
      return rows;
    },

    // Execute a mutating statement (INSERT / UPDATE / DELETE).
    // Returns { lastInsertRowid } to match the better-sqlite3 contract.
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

// Execute one or more SQL statements (used for schema init).
function exec(sql) {
  db.run(sql);
  saveDb();
}

// ─── Public DB proxy ──────────────────────────────────────────────────────────
// Routes call getDb().prepare(...) etc. — returns the same proxy every time.
const dbProxy = { prepare, exec };

function getDb() {
  if (!db) throw new Error('Database not initialised — call initDb() first');
  return dbProxy;
}

// ─── Async initialisation ─────────────────────────────────────────────────────
// Must be awaited once at server startup before any request is handled.

async function initDb() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    // Load existing database from disk.
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    // First run — create fresh in-memory database and apply schema.
    db = new SQL.Database();
  }

  // Enable foreign key enforcement.
  db.run('PRAGMA foreign_keys = ON');

  // Apply schema (CREATE TABLE IF NOT EXISTS — safe to run on every start).
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  db.run(schema);

  // Persist initial state so the file always exists after first boot.
  saveDb();

  console.log('Database ready:', DB_PATH);
}

module.exports = { getDb, initDb };
