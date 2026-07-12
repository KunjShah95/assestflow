import { db } from '../config/db.js';
import { auditCycles, auditResults } from '../models/schema.js';
import { eq, desc } from 'drizzle-orm';
import * as auditEngine from '../engines/audit.engine.js';

export async function createCycle(req, res) {
  const { title, scopeDepartmentId, scopeLocation, startDate, endDate, auditorIds } = req.body;
  const cycle = await auditEngine.createCycle(title, scopeDepartmentId, scopeLocation, startDate, endDate, req.user.id, auditorIds);
  res.status(201).json(cycle);
}

export async function markAsset(req, res) {
  const { assetId, status, notes } = req.body;
  const result = await auditEngine.markAsset(parseInt(req.params.cycleId), assetId, status, notes, req.user.id);
  res.json(result);
}

export async function closeCycle(req, res) {
  const result = await auditEngine.closeCycle(parseInt(req.params.id), req.user.id);
  res.json(result);
}

export async function listCycles(req, res) {
  const items = await db.select().from(auditCycles).orderBy(desc(auditCycles.createdAt));
  res.json(items);
}

export async function getCycleResults(req, res) {
  const items = await db.select().from(auditResults).where(eq(auditResults.auditCycleId, parseInt(req.params.id)));
  res.json(items);
}
