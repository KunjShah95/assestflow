import { z } from 'zod';
import { db } from '../config/db.js';
import { departments } from '../models/schema.js';
import { eq, asc } from 'drizzle-orm';

export async function list(req, res, next) {
  try {
    const items = await db.select().from(departments).orderBy(asc(departments.name));
    res.json(items);
  } catch (err) { next(err); }
}

export async function create(req, res, next) {
  try {
    const data = z.object({ name: z.string().min(1), description: z.string().optional() }).parse(req.body);
    const [item] = await db.insert(departments).values(data).returning();
    res.status(201).json(item);
  } catch (err) { next(err); }
}

export async function update(req, res, next) {
  try {
    const data = z.object({ name: z.string().min(1).optional(), description: z.string().optional(), status: z.string().optional() }).parse(req.body);
    const [item] = await db.update(departments).set(data).where(eq(departments.id, parseInt(req.params.id))).returning();
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { next(err); }
}
