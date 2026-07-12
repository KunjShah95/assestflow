import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db } from '../config/db.js';
import { employees } from '../models/schema.js';
import { eq } from 'drizzle-orm';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function signup(req, res) {
  const { email, password, name } = signupSchema.parse(req.body);

  const [existing] = await db.select().from(employees).where(eq(employees.email, email)).limit(1);
  if (existing) throw new AppError('Email already registered', 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const [employee] = await db.insert(employees).values({
    email, passwordHash, name, role: 'employee',
  }).returning();

  const token = jwt.sign({ id: employee.id, role: employee.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    token,
    user: { id: employee.id, email: employee.email, name: employee.name, role: employee.role },
  });
}

export async function login(req, res) {
  const { email, password } = loginSchema.parse(req.body);

  const [employee] = await db.select().from(employees).where(eq(employees.email, email)).limit(1);
  if (!employee) throw new AppError('Invalid credentials', 401);

  const valid = await bcrypt.compare(password, employee.passwordHash);
  if (!valid) throw new AppError('Invalid credentials', 401);

  if (employee.status !== 'active') throw new AppError('Account is inactive', 403);

  const token = jwt.sign({ id: employee.id, role: employee.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  res.json({
    token,
    user: { id: employee.id, email: employee.email, name: employee.name, role: employee.role, departmentId: employee.departmentId },
  });
}

export async function me(req, res) {
  const [employee] = await db.select().from(employees).where(eq(employees.id, req.user.id)).limit(1);
  if (!employee) throw new AppError('User not found', 404);
  res.json({
    id: employee.id, email: employee.email, name: employee.name,
    role: employee.role, departmentId: employee.departmentId,
  });
}

const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

export async function updateProfile(req, res, next) {
  try {
    const data = updateProfileSchema.parse(req.body);
    if (!data.name && !data.email) {
      return res.status(400).json({ error: 'Nothing to update' });
    }

    if (data.email) {
      const [existing] = await db.select().from(employees)
        .where(eq(employees.email, data.email)).limit(1);
      if (existing && existing.id !== req.user.id) {
        return res.status(409).json({ error: 'Email already in use' });
      }
    }

    const updates = {};
    if (data.name) updates.name = data.name;
    if (data.email) updates.email = data.email;

    const [updated] = await db.update(employees)
      .set(updates)
      .where(eq(employees.id, req.user.id))
      .returning();

    res.json({
      id: updated.id, email: updated.email, name: updated.name,
      role: updated.role, departmentId: updated.departmentId,
    });
  } catch (err) {
    next(err);
  }
}

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

    const [employee] = await db.select().from(employees)
      .where(eq(employees.id, req.user.id)).limit(1);
    if (!employee) return res.status(404).json({ error: 'User not found' });

    const valid = await bcrypt.compare(currentPassword, employee.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db.update(employees)
      .set({ passwordHash })
      .where(eq(employees.id, req.user.id));

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
}

