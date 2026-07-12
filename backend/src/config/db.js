import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { env } from './env.js';

const sql = neon(env.DATABASE_URL);
const db = drizzle(sql);

export { db, sql };
