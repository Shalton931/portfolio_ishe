'use strict';
const { Pool } = require('pg');

// Connection settings come from the standard PG* environment variables
// (PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD). No secrets live in code.
const pool = new Pool({
  max: 5,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  statement_timeout: 5_000,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : false,
});

// An idle-client error must never crash the process or leak details.
pool.on('error', (err) => console.error('db pool error:', err.code || 'unknown'));

module.exports = { pool };
