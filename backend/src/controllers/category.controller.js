import { z } from 'zod';
import { db } from '../config/db.js';
import { assetCategories } from '../models/schema.js';
import { eq, asc } from 'drizzle-orm';
import { AppError } from '../utils/AppError.js';

export async function list(req, res) {
  const items = await db.select().from(assetCategories).orderBy(asc(assetCategories.name));
  res.json(items);
}

export async function create(req, res) {
  const data = z.object({ name: z.string().min(1), description: z.string().optional(), warrantyPeriodDays: z.number().optional() }).parse(req.body);
  const [item] = await db.insert(assetCategories).values(data).returning();
  res.status(201).json(item);
}

export async function update(req, res) {
  const data = z.object({ name: z.string().optional(), description: z.string().optional(), warrantyPeriodDays: z.number().optional() }).parse(req.body);
  const [item] = await db.update(assetCategories).set(data).where(eq(assetCategories.id, parseInt(req.params.id))).returning();
  if (!item) throw new AppError('Not found', 404);
  res.json(item);
}
