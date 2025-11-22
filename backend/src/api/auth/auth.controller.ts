import { Request, Response } from 'express';
import { authService } from './auth.service';
import { LoginInput, RefreshTokenInput } from '../../schemas/auth.schema';

export class AuthController {
  /**
   * POST /api/auth/login
   * Login user with email and password
   */
  async login(req: Request<{}, {}, LoginInput>, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      if (!result.success) {
        res.status(401).json({
          success: false,
          message: result.message || 'Login failed',
        });
        return;
      }

      // Set httpOnly cookies for tokens (secure in production)
      const isProduction = process.env.NODE_ENV === 'production';

      res.cookie('accessToken', result.tokens!.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      res.cookie('refreshToken', result.tokens!.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: result.user,
        // Also send tokens in response for non-browser clients
        tokens: result.tokens,
      });
    } catch (error) {
      console.error('Login controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  /**
   * POST /api/auth/logout
   * Logout current user
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Not authenticated',
        });
        return;
      }

      await authService.logout(req.user.userId);

      // Clear cookies
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      console.error('Logout controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  /**
   * POST /api/auth/refresh
   * Refresh access token using refresh token
   */
  async refresh(req: Request<{}, {}, RefreshTokenInput>, res: Response): Promise<void> {
    try {
      // Get refresh token from cookie or body
      const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        res.status(401).json({
          success: false,
          message: 'Refresh token required',
        });
        return;
      }

      const result = await authService.refreshToken(refreshToken);

      if (!result.success) {
        res.status(401).json({
          success: false,
          message: result.message || 'Token refresh failed',
        });
        return;
      }

      // Set new httpOnly cookies
      const isProduction = process.env.NODE_ENV === 'production';

      res.cookie('accessToken', result.tokens!.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.cookie('refreshToken', result.tokens!.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        user: result.user,
        tokens: result.tokens,
      });
    } catch (error) {
      console.error('Refresh controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  /**
   * GET /api/auth/me
   * Get current user profile
   */
  async me(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Not authenticated',
        });
        return;
      }

      const profile = await authService.getProfile(req.user.userId);

      if (!profile) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      console.error('Get profile controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}

export const authController = new AuthController();
