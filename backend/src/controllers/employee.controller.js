import { z } from 'zod';
import { db } from '../config/db.js';
import { employees } from '../models/schema.js';
import { eq, asc } from 'drizzle-orm';

export async function list(req, res, next) {
  try {
    const items = await db.select({ id: employees.id, email: employees.email, name: employees.name, departmentId: employees.departmentId, role: employees.role, status: employees.status, createdAt: employees.createdAt }).from(employees).orderBy(asc(employees.name));
    res.json(items);
  } catch (err) { next(err); }
}

export async function promote(req, res, next) {
  try {
    const { role } = z.object({ role: z.enum(['department_head', 'asset_manager']) }).parse(req.body);
    const id = parseInt(req.params.id);
    if (id === req.user.id) return res.status(400).json({ error: 'Cannot self-promote' });
    const [emp] = await db.update(employees).set({ role }).where(eq(employees.id, id)).returning();
    if (!emp) return res.status(404).json({ error: 'Employee not found' });
    res.json(emp);
  } catch (err) { next(err); }
}

export async function deactivate(req, res, next) {
  try {
    const [emp] = await db.update(employees).set({ status: 'inactive' }).where(eq(employees.id, parseInt(req.params.id))).returning();
    if (!emp) return res.status(404).json({ error: 'Employee not found' });
    res.json(emp);
  } catch (err) { next(err); }
}
