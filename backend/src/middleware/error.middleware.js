import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

const isDev = process.env.NODE_ENV !== 'production';

function getZodIssues(err) {
  return err.issues ?? err.errors ?? [];
}

function buildResponse(err) {
  if (err instanceof AppError) {
    return {
      status: err.status,
      body: {
        error: err.message,
        ...(err.details !== undefined && { details: err.details }),
      },
    };
  }

  if (err instanceof ZodError) {
    const issues = getZodIssues(err);
    return {
      status: 400,
      body: { error: 'Validation failed', details: issues },
    };
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return { status: 401, body: { error: 'Invalid or expired token' } };
  }

  const status = err.status || err.statusCode || 500;
  const body = {
    error: status >= 500 && !isDev ? 'Internal server error' : (err.message || 'Internal server error'),
  };

  if (err.details !== undefined) body.details = err.details;

  for (const key of ['conflictingBooking', 'currentHolder', 'suggestion']) {
    if (err[key] !== undefined) body[key] = err[key];
  }

  if (isDev && status >= 500 && err.stack) {
    body.stack = err.stack;
  }

  return { status, body };
}

export function errorHandler(err, req, res, _next) {
  const { status, body } = buildResponse(err);

  if (status >= 500) {
    console.error(`[${req.method}] ${req.originalUrl}`, err);
  }

  res.status(status).json(body);
}
