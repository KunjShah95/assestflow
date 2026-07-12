import { z } from 'zod';
import { db } from '../config/db.js';
import { env } from '../config/env.js';
import { assets } from '../models/schema.js';
import { eq, desc, like, and, or } from 'drizzle-orm';
import QRCode from 'qrcode';
import { AppError } from '../utils/AppError.js';

async function generateAssetTag() {
  try {
    const [last] = await db.select({ tag: assets.assetTag }).from(assets).orderBy(desc(assets.assetTag)).limit(1);
    const num = last ? parseInt(last.tag.split('-')[1]) + 1 : 1;
    return `AF-${String(num).padStart(4, '0')}`;
  } catch (err) {
    throw new AppError('Failed to generate asset tag', 500);
  }
}

export async function list(req, res) {
  const { search, category, status, location } = req.query;
  const conditions = [];
  if (search) conditions.push(or(like(assets.assetTag, `%${search}%`), like(assets.name, `%${search}%`), like(assets.serialNumber, `%${search}%`)));
  if (category) conditions.push(eq(assets.categoryId, parseInt(category)));
  if (status) conditions.push(eq(assets.status, status));
  if (location) conditions.push(like(assets.location, `%${location}%`));
  const items = await db.select().from(assets).where(conditions.length ? and(...conditions) : undefined).orderBy(desc(assets.createdAt));
  res.json(items);
}

export async function getById(req, res) {
  const [asset] = await db.select().from(assets).where(eq(assets.id, parseInt(req.params.id))).limit(1);
  if (!asset) throw new AppError('Asset not found', 404);
  res.json(asset);
}

export async function create(req, res, next) {
  try {
    const data = z.object({ name: z.string().min(1), categoryId: z.number(), serialNumber: z.string().optional(), acquisitionDate: z.string().optional(), acquisitionCost: z.string().optional(), condition: z.string().optional(), location: z.string().optional(), isBookable: z.boolean().optional() }).parse(req.body);
    const assetTag = await generateAssetTag();
    const qrCode = await QRCode.toDataURL(`${env.BASE_URL}/assets/${assetTag}`);
    const [asset] = await db.insert(assets).values({ ...data, assetTag, qrCode, status: 'available' }).returning();
    res.status(201).json(asset);
  } catch (err) { next(err); }
}

export async function update(req, res) {
  const data = z.object({ name: z.string().optional(), condition: z.string().optional(), location: z.string().optional(), status: z.string().optional() }).parse(req.body);
  const [asset] = await db.update(assets).set({ ...data, updatedAt: new Date() }).where(eq(assets.id, parseInt(req.params.id))).returning();
  if (!asset) throw new AppError('Not found', 404);
  res.json(asset);
}
