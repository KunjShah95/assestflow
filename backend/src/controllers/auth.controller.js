import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db } from '../config/db.js';
import { employees } from '../models/schema.js';
import { eq } from 'drizzle-orm';
import { env } from '../config/env.js';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function signup(req, res, next) {
  try {
    const { email, password, name } = signupSchema.parse(req.body);

    const [existing] = await db.select().from(employees).where(eq(employees.email, email)).limit(1);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

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
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const [employee] = await db.select().from(employees).where(eq(employees.email, email)).limit(1);
    if (!employee) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, employee.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (employee.status !== 'active') {
      return res.status(403).json({ error: 'Account is inactive' });
    }

    const token = jwt.sign({ id: employee.id, role: employee.role }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });

    res.json({
      token,
      user: { id: employee.id, email: employee.email, name: employee.name, role: employee.role, departmentId: employee.departmentId },
    });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const [employee] = await db.select().from(employees).where(eq(employees.id, req.user.id)).limit(1);
    if (!employee) return res.status(404).json({ error: 'User not found' });
    res.json({
      id: employee.id, email: employee.email, name: employee.name,
      role: employee.role, departmentId: employee.departmentId,
    });
  } catch (err) {
    next(err);
  }
}
