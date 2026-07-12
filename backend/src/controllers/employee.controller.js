import { z } from 'zod';
import { db } from '../config/db.js';
import { employees } from '../models/schema.js';
import { eq, asc } from 'drizzle-orm';
import { AppError } from '../utils/AppError.js';

export async function list(req, res) {
  const items = await db.select({ id: employees.id, email: employees.email, name: employees.name, departmentId: employees.departmentId, role: employees.role, status: employees.status, createdAt: employees.createdAt }).from(employees).orderBy(asc(employees.name));
  res.json(items);
}

export async function promote(req, res) {
  const { role } = z.object({ role: z.enum(['department_head', 'asset_manager']) }).parse(req.body);
  const id = parseInt(req.params.id);
  if (id === req.user.id) throw new AppError('Cannot self-promote', 400);
  const [emp] = await db.update(employees).set({ role }).where(eq(employees.id, id)).returning();
  if (!emp) throw new AppError('Employee not found', 404);
  res.json(emp);
}

export async function deactivate(req, res) {
  const [emp] = await db.update(employees).set({ status: 'inactive' }).where(eq(employees.id, parseInt(req.params.id))).returning();
  if (!emp) throw new AppError('Employee not found', 404);
  res.json(emp);
}
