import { db } from '../config/db.js';
import { maintenanceRequests, assets } from '../models/schema.js';
import { eq } from 'drizzle-orm';
import { AppError } from '../utils/AppError.js';

export async function createRequest(assetId, employeeId, description, priority, photoUrl) {
  const [request] = await db.insert(maintenanceRequests).values({ assetId, requestedByEmployeeId: employeeId, description, priority: priority || 'medium', photoUrl, status: 'pending' }).returning();
  return request;
}

export async function approveRequest(requestId, approverId) {
  const [req] = await db.select().from(maintenanceRequests).where(eq(maintenanceRequests.id, requestId)).limit(1);
  if (!req || req.status !== 'pending') throw new AppError('Request not pending', 400);
  await db.update(maintenanceRequests).set({ status: 'approved', approvedBy: approverId }).where(eq(maintenanceRequests.id, requestId));
  await db.update(assets).set({ status: 'under_maintenance' }).where(eq(assets.id, req.assetId));
  return { message: 'Maintenance request approved, asset under maintenance' };
}

export async function rejectRequest(requestId, approverId) {
  await db.update(maintenanceRequests).set({ status: 'rejected', approvedBy: approverId }).where(eq(maintenanceRequests.id, requestId));
  return { message: 'Maintenance request rejected' };
}

export async function resolveRequest(requestId) {
  const [req] = await db.select().from(maintenanceRequests).where(eq(maintenanceRequests.id, requestId)).limit(1);
  if (!req) throw new AppError('Request not found', 404);
  await db.update(maintenanceRequests).set({ status: 'resolved', resolvedAt: new Date() }).where(eq(maintenanceRequests.id, requestId));
  await db.update(assets).set({ status: 'available' }).where(eq(assets.id, req.assetId));
  return { message: 'Maintenance resolved, asset available' };
}

export async function updateStatus(requestId, status) {
  const validTransitions = ['pending', 'approved', 'in_progress', 'resolved', 'rejected'];
  if (!validTransitions.includes(status)) {
    throw Object.assign(new Error('Invalid status'), { status: 400 });
  }
  const [req] = await db.select().from(maintenanceRequests).where(eq(maintenanceRequests.id, requestId)).limit(1);
  if (!req) throw Object.assign(new Error('Request not found'), { status: 404 });

  await db.update(maintenanceRequests).set({ status }).where(eq(maintenanceRequests.id, requestId));

  if (status === 'approved' || status === 'in_progress') {
    await db.update(assets).set({ status: 'under_maintenance' }).where(eq(assets.id, req.assetId));
  } else if (status === 'resolved') {
    await db.update(maintenanceRequests).set({ resolvedAt: new Date() }).where(eq(maintenanceRequests.id, requestId));
    await db.update(assets).set({ status: 'available' }).where(eq(assets.id, req.assetId));
  }

  return { message: `Status updated to ${status}` };
}
