import { Request, Response, NextFunction } from 'express';

export enum UserRole {
  ADMIN = 'ADMIN',
  TRAINER = 'TRAINER',
  LEARNER = 'LEARNER',
}

/**
 * Role-Based Access Control middleware
 * Requires authentication middleware to run first
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    const userRole = req.user.role as UserRole;

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
        requiredRoles: allowedRoles,
        userRole: userRole,
      });
      return;
    }

    next();
  };
};

/**
 * Check if user is ADMIN
 */
export const isAdmin = authorize(UserRole.ADMIN);

/**
 * Check if user is ADMIN or TRAINER
 */
export const isAdminOrTrainer = authorize(UserRole.ADMIN, UserRole.TRAINER);

/**
 * Allow all authenticated users
 */
export const isAuthenticated = authorize(UserRole.ADMIN, UserRole.TRAINER, UserRole.LEARNER);
