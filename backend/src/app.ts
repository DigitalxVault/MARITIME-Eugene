import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

// Middleware
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// Routes
import authRoutes from './api/auth/auth.routes';
import missionRoutes from './api/missions';
import playerRoutes from './api/players';
import analyticsRoutes from './api/analytics';
import activityRoutes from './api/activity';
import leaderboardRoutes from './api/leaderboard';

// Create Express app
export function createApp(): Application {
  const app = express();

  // ==================== SECURITY MIDDLEWARE ====================

  // Helmet - Security headers
  app.use(helmet());

  // CORS - Configure for frontend
  const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true, // Allow cookies
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));

  // Rate limiting - Global API protection
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '300'), // 300 requests per window (dashboard polling + buffer)
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later.',
  });
  app.use('/api', limiter);

  // ==================== BODY PARSERS ====================

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // ==================== HEALTH CHECK ====================

  app.get('/health', (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'Mission Control Backend is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // ==================== API ROUTES ====================

  app.use('/api/auth', authRoutes);
  app.use('/api/missions', missionRoutes);
  app.use('/api/players', playerRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/activity', activityRoutes);
  app.use('/api/leaderboard', leaderboardRoutes);

  // ==================== ERROR HANDLING ====================

  // 404 handler - must be after all routes
  app.use(notFoundHandler);

  // Global error handler - must be last
  app.use(errorHandler);

  return app;
}
