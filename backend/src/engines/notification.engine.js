import { db } from '../config/db.js';
import { notifications, activityLogs } from '../models/schema.js';

export async function send(employeeId, type, message, referenceType, referenceId) {
  const [notification] = await db.insert(notifications).values({ employeeId, type, message, referenceType, referenceId }).returning();
  return notification;
}

export async function logActivity(employeeId, action, details) {
  await db.insert(activityLogs).values({ employeeId, action, details });
}
