import { AppError } from '../utils/AppError.js';

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(`Access denied. Requires one of: ${roles.join(', ')}`, 403));
    }
    next();
  };
}
