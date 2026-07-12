require('dotenv').config();

const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  PORT: parseInt(process.env.PORT || '3001', 10),
};

const missing = Object.entries(env).filter(([_, v]) => !v);
if (missing.length) {
  throw new Error(`Missing env vars: ${missing.map(([k]) => k).join(', ')}`);
}

module.exports = env;
