import { Router } from 'express';
import { authController } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { loginSchema, refreshTokenSchema } from '../../schemas/auth.schema';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for auth endpoints
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per IP
  message: 'Too many login attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post('/login', loginLimiter, validate(loginSchema), (req, res) =>
  authController.login(req, res)
);

/**
 * POST /api/auth/logout
 * Logout current user
 */
router.post('/logout', authenticate, (req, res) =>
  authController.logout(req, res)
);

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh', validate(refreshTokenSchema), (req, res) =>
  authController.refresh(req, res)
);

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get('/me', authenticate, (req, res) =>
  authController.me(req, res)
);

export default router;
