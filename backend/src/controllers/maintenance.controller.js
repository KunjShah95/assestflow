import { db } from '../config/db.js';
import { maintenanceRequests } from '../models/schema.js';
import { desc } from 'drizzle-orm';
import * as maintenanceEngine from '../engines/maintenance.engine.js';

export async function create(req, res, next) {
  try {
    const { assetId, description, priority, photoUrl } = req.body;
    const result = await maintenanceEngine.createRequest(assetId, req.user.id, description, priority, photoUrl);
    res.status(201).json(result);
  } catch (err) { next(err); }
}

export async function approve(req, res, next) {
  try {
    const result = await maintenanceEngine.approveRequest(parseInt(req.params.id), req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}

export async function reject(req, res, next) {
  try {
    const result = await maintenanceEngine.rejectRequest(parseInt(req.params.id), req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}

export async function resolve(req, res, next) {
  try {
    const result = await maintenanceEngine.resolveRequest(parseInt(req.params.id));
    res.json(result);
  } catch (err) { next(err); }
}

export async function list(req, res, next) {
  try {
    const items = await db.select().from(maintenanceRequests).orderBy(desc(maintenanceRequests.createdAt));
    res.json(items);
  } catch (err) { next(err); }
}
