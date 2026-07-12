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
