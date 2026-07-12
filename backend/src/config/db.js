const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

const db = drizzle(pool);

module.exports = { db, pool };
