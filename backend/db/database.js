const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let pool = null;

// Thin query helper — all routes use this instead of managing a client directly.
async function query(text, params) {
  return pool.query(text, params);
}

async function initDb() {
  console.log('[DB] Connecting to PostgreSQL...');
  console.log('[DB] DATABASE_URL present:', !!process.env.DATABASE_URL);
  console.log('[DB] NODE_ENV:', process.env.NODE_ENV);

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Railway and most hosted Postgres require SSL in production.
    // rejectUnauthorized: false accepts self-signed certs from Railway.
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  // Verify the connection before proceeding.
  const client = await pool.connect();
  console.log('[DB] PostgreSQL connection established');
  client.release();

  // Apply schema — CREATE TABLE IF NOT EXISTS is idempotent.
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  await pool.query(schema);
  console.log('[DB] Schema applied — tables ready');
}

module.exports = { query, initDb };
