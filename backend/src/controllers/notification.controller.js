import { db } from '../config/db.js';
import { notifications, activityLogs, assets, employees, departments, bookings, assetCategories } from '../models/schema.js';
import { eq, and, desc, inArray } from 'drizzle-orm';

function formatTimeRange(start, end) {
  const fmt = (d) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${fmt(start)} to ${fmt(end)}`;
}

function categoryLabel(name) {
  if (!name) return 'Asset';
  const lower = name.toLowerCase();
  if (lower.includes('laptop')) return 'Laptop';
  if (lower.includes('phone') || lower.includes('mobile')) return 'Phone';
  if (lower.includes('projector')) return 'Projector';
  if (lower.includes('space') || lower.includes('room')) return 'Room';
  if (lower.includes('vehicle')) return 'Vehicle';
  if (lower.includes('furniture')) return 'Furniture';
  return name;
}

function buildDisplayText(log, maps) {
  const action = (log.action || '').toLowerCase();
  const details = log.details && typeof log.details === 'object' ? log.details : {};
  const asset = details.assetId ? maps.assets.get(details.assetId) : null;
  const employee = details.employeeId ? maps.employees.get(details.employeeId) : null;
  const booking = details.bookingId ? maps.bookings.get(details.bookingId) : null;

  const assetLabel = asset
    ? `${categoryLabel(asset.categoryName)} ${asset.assetTag}`
    : details.assetTag
      ? `Asset ${details.assetTag}`
      : details.assetId
        ? `Asset #${details.assetId}`
        : 'Asset';

  const deptName = employee?.departmentId
    ? maps.departments.get(employee.departmentId) || ''
    : '';

  if (action.includes('alloc')) {
    const who = employee?.name || `employee #${details.employeeId || '?'}`;
    const dept = deptName ? ` - ${deptName}` : '';
    return `${assetLabel} - allocated to ${who}${dept}`;
  }

  if (action.includes('book')) {
    const roomName = asset?.name || assetLabel;
    if (booking) {
      const start = new Date(booking.startTime);
      const end = new Date(booking.endTime);
      return `${roomName} - booking confirmed - ${formatTimeRange(start, end)}`;
    }
    return `${roomName} - booking confirmed`;
  }

  if (action.includes('maintenance')) {
    const status = action.includes('approved') ? 'maintenance approved'
      : action.includes('requested') ? 'maintenance requested'
      : action.includes('resolved') ? 'maintenance resolved'
      : 'maintenance updated';
    return `${assetLabel} - ${status}`;
  }

  if (action.includes('transfer')) {
    const to = details.toEmployeeId ? maps.employees.get(details.toEmployeeId)?.name : null;
    return `${assetLabel} - transfer requested${to ? ` to ${to}` : ''}`;
  }

  if (action.includes('return')) {
    const who = employee?.name || 'employee';
    return `${assetLabel} - returned by ${who}`;
  }

  if (details.name) {
    return `${details.name} - ${action.replace(/_/g, ' ')}`;
  }

  return `${action.replace(/_/g, ' ') || 'activity'} recorded`;
}

export async function list(req, res) {
  const { unread } = req.query;
  const conditions = [eq(notifications.employeeId, req.user.id)];
  if (unread === 'true') conditions.push(eq(notifications.isRead, false));
  const items = await db.select().from(notifications).where(and(...conditions)).orderBy(desc(notifications.createdAt)).limit(50);
  res.json(items);
}

export async function markRead(req, res) {
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, parseInt(req.params.id)));
  res.json({ message: 'Marked as read' });
}

export async function activityLog(req, res) {
  const logs = await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(100);

  const assetIds = new Set();
  const employeeIds = new Set();
  const bookingIds = new Set();

  for (const log of logs) {
    const d = log.details && typeof log.details === 'object' ? log.details : {};
    if (d.assetId) assetIds.add(d.assetId);
    if (d.employeeId) employeeIds.add(d.employeeId);
    if (d.toEmployeeId) employeeIds.add(d.toEmployeeId);
    if (d.bookingId) bookingIds.add(d.bookingId);
  }

  const [assetRows, employeeRows, bookingRows, deptRows, catRows] = await Promise.all([
    assetIds.size
      ? db.select({
          id: assets.id,
          name: assets.name,
          assetTag: assets.assetTag,
          categoryId: assets.categoryId,
        }).from(assets).where(inArray(assets.id, [...assetIds]))
      : [],
    employeeIds.size
      ? db.select({
          id: employees.id,
          name: employees.name,
          departmentId: employees.departmentId,
        }).from(employees).where(inArray(employees.id, [...employeeIds]))
      : [],
    bookingIds.size
      ? db.select({
          id: bookings.id,
          startTime: bookings.startTime,
          endTime: bookings.endTime,
        }).from(bookings).where(inArray(bookings.id, [...bookingIds]))
      : [],
    db.select({ id: departments.id, name: departments.name }).from(departments),
    db.select({ id: assetCategories.id, name: assetCategories.name }).from(assetCategories),
  ]);

  const categoryMap = new Map(catRows.map((c) => [c.id, c.name]));
  const assetMap = new Map(assetRows.map((a) => [a.id, {
    ...a,
    categoryName: a.categoryId ? categoryMap.get(a.categoryId) : null,
  }]));
  const employeeMap = new Map(employeeRows.map((e) => [e.id, e]));
  const bookingMap = new Map(bookingRows.map((b) => [b.id, b]));
  const departmentMap = new Map(deptRows.map((d) => [d.id, d.name]));

  const enriched = logs.map((log) => ({
    ...log,
    displayText: buildDisplayText(log, {
      assets: assetMap,
      employees: employeeMap,
      bookings: bookingMap,
      departments: departmentMap,
    }),
  }));

  res.json(enriched);
}
