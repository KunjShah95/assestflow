import { db } from '../config/db.js';
import { assets, allocations, transfers } from '../models/schema.js';
import { eq, and } from 'drizzle-orm';
import * as notificationEngine from './notification.engine.js';
import * as policyEngine from './policy.engine.js';
import { AppError } from '../utils/AppError.js';

export async function allocate(assetId, employeeId, departmentId, expectedReturnDate, allocatorId) {
  const [asset] = await db.select().from(assets).where(eq(assets.id, assetId)).limit(1);
  if (!asset) throw new AppError('Asset not found', 404);
  if (asset.status !== 'available') {
    const [activeAlloc] = await db.select().from(allocations).where(and(eq(allocations.assetId, assetId), eq(allocations.status, 'active'))).limit(1);
    throw new AppError('Asset is not available', 409, { currentHolder: activeAlloc?.employeeId, suggestion: 'Use transfer request instead' });
  }

  const policyResult = await policyEngine.evaluate('allocate', { asset, employeeId, departmentId });
  if (!policyResult.allowed) throw new AppError(policyResult.reason, 403);

  const [allocation] = await db.insert(allocations).values({ assetId, employeeId, departmentId, expectedReturnDate: expectedReturnDate || null, status: 'active' }).returning();
  await db.update(assets).set({ status: 'allocated', currentHolderEmployeeId: employeeId, currentDepartmentId: departmentId }).where(eq(assets.id, assetId));
  await notificationEngine.send(employeeId, 'asset_assigned', `Asset ${asset.assetTag} (${asset.name}) assigned to you`, 'allocation', allocation.id);
  await notificationEngine.logActivity(allocatorId, 'asset_allocated', { assetId, employeeId, allocationId: allocation.id });
  return allocation;
}

export async function requestTransfer(assetId, fromEmployeeId, toEmployeeId, reason) {
  const [asset] = await db.select().from(assets).where(eq(assets.id, assetId)).limit(1);
  if (!asset || asset.status !== 'allocated') throw new AppError('Asset is not currently allocated', 400);
  const [transfer] = await db.insert(transfers).values({ assetId, fromEmployeeId, toEmployeeId, reason, status: 'requested' }).returning();
  return transfer;
}

export async function approveTransfer(transferId, approverId) {
  const [transfer] = await db.select().from(transfers).where(eq(transfers.id, transferId)).limit(1);
  if (!transfer || transfer.status !== 'requested') throw new AppError('Transfer not pending', 400);
  await db.update(transfers).set({ status: 'approved', approvedBy: approverId, resolvedAt: new Date() }).where(eq(transfers.id, transferId));
  await db.update(assets).set({ currentHolderEmployeeId: transfer.toEmployeeId }).where(eq(assets.id, transfer.assetId));
  await db.update(allocations).set({ status: 'completed', returnedAt: new Date() }).where(and(eq(allocations.assetId, transfer.assetId), eq(allocations.status, 'active')));
  await db.insert(allocations).values({ assetId: transfer.assetId, employeeId: transfer.toEmployeeId, status: 'active' });
  return { message: 'Transfer approved and re-allocated' };
}

export async function returnAsset(allocationId, conditionNotes, returnerId) {
  const [alloc] = await db.select().from(allocations).where(eq(allocations.id, allocationId)).limit(1);
  if (!alloc || alloc.status !== 'active') throw new AppError('Allocation not active', 400);
  await db.update(allocations).set({ status: 'completed', returnedAt: new Date(), conditionCheckinNotes: conditionNotes }).where(eq(allocations.id, allocationId));
  await db.update(assets).set({ status: 'available', currentHolderEmployeeId: null }).where(eq(assets.id, alloc.assetId));
  return { message: 'Asset returned successfully' };
}
