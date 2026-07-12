import { db } from '../config/db.js';
import { notifications, activityLogs } from '../models/schema.js';
import { eq, and, desc } from 'drizzle-orm';

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
  res.json(logs);
}
