export class ApiError extends Error {
  readonly status: number;
  readonly details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}

export function getErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (isApiError(err)) return err.message;
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return fallback;
}

export function isUnauthorized(err: unknown): boolean {
  return isApiError(err) && err.status === 401;
}

export function isForbidden(err: unknown): boolean {
  return isApiError(err) && err.status === 403;
}

export function isNotFound(err: unknown): boolean {
  return isApiError(err) && err.status === 404;
}
