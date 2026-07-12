const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected pool error', err);
  process.exit(1);
});

const db = drizzle(pool);

module.exports = { db, pool };
