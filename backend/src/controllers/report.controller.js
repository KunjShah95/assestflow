import { db } from '../config/db.js';
import { assets, allocations, bookings, maintenanceRequests, transfers, assetCategories } from '../models/schema.js';
import { eq, and, ne, gte, lt, count, desc } from 'drizzle-orm';

export async function kpi(req, res) {
  const [available] = await db.select({ count: count() }).from(assets).where(eq(assets.status, 'available'));
  const [allocated] = await db.select({ count: count() }).from(assets).where(eq(assets.status, 'allocated'));
  const [activeBookings] = await db.select({ count: count() }).from(bookings).where(eq(bookings.status, 'upcoming'));
  const [pendingTransfers] = await db.select({ count: count() }).from(transfers).where(eq(transfers.status, 'requested'));
  const [maintenanceToday] = await db.select({ count: count() }).from(maintenanceRequests).where(and(gte(maintenanceRequests.createdAt, new Date(new Date().setHours(0,0,0,0))), ne(maintenanceRequests.status, 'resolved')));
  const overdue = await db.select().from(allocations).where(and(eq(allocations.status, 'active'), lt(allocations.expectedReturnDate, new Date())));
  res.json({ availableAssets: available.count, allocatedAssets: allocated.count, activeBookings: activeBookings.count, maintenanceToday: maintenanceToday.count, pendingTransfers: pendingTransfers.count, overdueReturns: overdue.length });
}

export async function idleAssets(req, res) {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const items = await db.select().from(assets).where(and(eq(assets.status, 'available'), lt(assets.updatedAt, ninetyDaysAgo)));
  res.json(items);
}

export async function utilization(req, res) {
  const deptAllocations = await db.select({ departmentId: allocations.departmentId, count: count() }).from(allocations).where(eq(allocations.status, 'active')).groupBy(allocations.departmentId);
  res.json(deptAllocations);
}

export async function bookingHeatmap(req, res) {
  const all = await db.select().from(bookings).where(ne(bookings.status, 'cancelled'));
  res.json(all);
}

export async function maintenanceFrequency(req, res) {
  const result = await db.select({
    categoryId: assets.categoryId,
    categoryName: assetCategories.name,
    count: count(),
  }).from(maintenanceRequests)
    .innerJoin(assets, eq(maintenanceRequests.assetId, assets.id))
    .innerJoin(assetCategories, eq(assets.categoryId, assetCategories.id))
    .groupBy(assets.categoryId, assetCategories.name);
  res.json(result);
}
