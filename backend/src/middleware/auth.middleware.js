import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { db } from '../config/db.js';
import { employees } from '../models/schema.js';
import { eq } from 'drizzle-orm';
import { AppError } from '../utils/AppError.js';

export async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401));
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const [employee] = await db.select()
      .from(employees)
      .where(eq(employees.id, decoded.id))
      .limit(1);

    if (!employee || employee.status !== 'active') {
      return next(new AppError('Account not found or inactive', 401));
    }

    req.user = { id: employee.id, email: employee.email, role: employee.role, name: employee.name, departmentId: employee.departmentId };
    next();
  } catch (err) {
    next(err);
  }
}
