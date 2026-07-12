import { db } from '../config/db.js';
import { auditCycles, auditAssignments, auditResults, assets } from '../models/schema.js';
import { eq, and, ne } from 'drizzle-orm';

export async function createCycle(title, scopeDeptId, scopeLocation, startDate, endDate, adminId, auditorIds) {
  const [cycle] = await db.insert(auditCycles).values({ title, scopeDepartmentId: scopeDeptId, scopeLocation, startDate, endDate, createdByAdminId: adminId, status: 'open' }).returning();
  for (const auditorId of (auditorIds || [])) {
    await db.insert(auditAssignments).values({ auditCycleId: cycle.id, auditorEmployeeId: auditorId });
  }
  return cycle;
}

export async function markAsset(cycleId, assetId, status, notes, auditorId) {
  const [existing] = await db.select().from(auditResults).where(and(eq(auditResults.auditCycleId, cycleId), eq(auditResults.assetId, assetId))).limit(1);
  if (existing) {
    await db.update(auditResults).set({ status, notes, checkedByEmployeeId: auditorId, checkedAt: new Date() }).where(eq(auditResults.id, existing.id));
  } else {
    await db.insert(auditResults).values({ auditCycleId: cycleId, assetId, status, notes, checkedByEmployeeId: auditorId });
  }
  return { message: `Asset marked as ${status}` };
}

export async function closeCycle(cycleId, closerId) {
  const discrepancies = await db.select().from(auditResults).where(and(eq(auditResults.auditCycleId, cycleId), ne(auditResults.status, 'verified')));
  for (const d of discrepancies) {
    if (d.status === 'missing') await db.update(assets).set({ status: 'lost' }).where(eq(assets.id, d.assetId));
    else if (d.status === 'damaged') await db.update(assets).set({ condition: 'poor' }).where(eq(assets.id, d.assetId));
  }
  await db.update(auditCycles).set({ status: 'closed' }).where(eq(auditCycles.id, cycleId));
  return { message: 'Audit cycle closed', discrepancies: discrepancies.length };
}
