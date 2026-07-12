import { z } from 'zod';
import { db } from '../config/db.js';
import { assets } from '../models/schema.js';
import { eq, desc, like, and, or } from 'drizzle-orm';
import QRCode from 'qrcode';

async function generateAssetTag() {
  const [last] = await db.select({ tag: assets.assetTag }).from(assets).orderBy(desc(assets.assetTag)).limit(1);
  const num = last ? parseInt(last.tag.split('-')[1]) + 1 : 1;
  return `AF-${String(num).padStart(4, '0')}`;
}

export async function list(req, res, next) {
  try {
    const { search, category, status, location } = req.query;
    const conditions = [];
    if (search) conditions.push(or(like(assets.assetTag, `%${search}%`), like(assets.name, `%${search}%`), like(assets.serialNumber, `%${search}%`)));
    if (category) conditions.push(eq(assets.categoryId, parseInt(category)));
    if (status) conditions.push(eq(assets.status, status));
    if (location) conditions.push(like(assets.location, `%${location}%`));
    const items = await db.select().from(assets).where(conditions.length ? and(...conditions) : undefined).orderBy(desc(assets.createdAt));
    res.json(items);
  } catch (err) { next(err); }
}

export async function getById(req, res, next) {
  try {
    const [asset] = await db.select().from(assets).where(eq(assets.id, parseInt(req.params.id))).limit(1);
    if (!asset) return res.status(404).json({ error: 'Asset not found' });
    res.json(asset);
  } catch (err) { next(err); }
}

export async function create(req, res, next) {
  try {
    const data = z.object({ name: z.string().min(1), categoryId: z.number(), serialNumber: z.string().optional(), acquisitionDate: z.string().optional(), acquisitionCost: z.string().optional(), condition: z.string().optional(), location: z.string().optional(), isBookable: z.boolean().optional() }).parse(req.body);
    const assetTag = await generateAssetTag();
    const qrCode = await QRCode.toDataURL(`${req.protocol}://${req.get('host')}/assets/${assetTag}`);
    const [asset] = await db.insert(assets).values({ ...data, assetTag, qrCode, status: 'available' }).returning();
    res.status(201).json(asset);
  } catch (err) { next(err); }
}

export async function update(req, res, next) {
  try {
    const data = z.object({ name: z.string().optional(), condition: z.string().optional(), location: z.string().optional(), status: z.string().optional() }).parse(req.body);
    const [asset] = await db.update(assets).set({ ...data, updatedAt: new Date() }).where(eq(assets.id, parseInt(req.params.id))).returning();
    if (!asset) return res.status(404).json({ error: 'Not found' });
    res.json(asset);
  } catch (err) { next(err); }
}
