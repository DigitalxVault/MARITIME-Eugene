import { Request, Response, NextFunction } from 'express';
import { jwtService, JWTPayload } from '../services/jwt.service';

// Extend Express Request to include user data
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Authentication middleware - Verifies JWT token from httpOnly cookie or Authorization header
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Try to get token from httpOnly cookie first
    let token = req.cookies?.accessToken;

    // Fallback to Authorization header (Bearer token)
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.',
      });
      return;
    }

    // Verify token
    const payload = jwtService.verifyAccessToken(token);

    // Attach user data to request
    req.user = payload;

    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Authentication failed',
      });
    }
  }
};

/**
 * Optional authentication middleware - Sets user if token is valid, but doesn't fail if missing
 */
export const optionalAuthenticate = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    let token = req.cookies?.accessToken;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (token) {
      const payload = jwtService.verifyAccessToken(token);
      req.user = payload;
    }

    next();
  } catch (error) {
    // Silently fail for optional authentication
    next();
  }
};
