import bcrypt from 'bcrypt';
import { prisma } from '../../config/database';
import { jwtService, TokenPair } from '../../services/jwt.service';
import { cacheService, CacheKeys, CacheTTL } from '../../services/cache.service';

export interface LoginResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
  };
  tokens?: TokenPair;
  message?: string;
}

export class AuthService {
  /**
   * Login user with email and password
   */
  async login(email: string, password: string): Promise<LoginResult> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          role: true,
          deletedAt: true,
        },
      });

      if (!user || user.deletedAt) {
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }

      // Generate JWT tokens
      const tokens = jwtService.generateTokenPair({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Cache user session
      await cacheService.set(
        CacheKeys.userSession(user.id),
        {
          userId: user.id,
          email: user.email,
          role: user.role,
          loginAt: new Date().toISOString(),
        },
        CacheTTL.SESSION
      );

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        tokens,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed',
      };
    }
  }

  /**
   * Logout user
   */
  async logout(userId: string): Promise<boolean> {
    try {
      // Remove user session from cache
      await cacheService.del(CacheKeys.userSession(userId));
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<LoginResult> {
    try {
      // Verify refresh token
      const payload = jwtService.verifyRefreshToken(refreshToken);

      // Generate new token pair
      const tokens = jwtService.generateTokenPair({
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      });

      return {
        success: true,
        user: {
          id: payload.userId,
          email: payload.email,
          role: payload.role,
        },
        tokens,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Token refresh failed',
      };
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          playerProfile: {
            select: {
              id: true,
              username: true,
              rank: true,
              winRate: true,
              averageScore: true,
              missionsCompleted: true,
              totalTimeSpent: true,
            },
          },
        },
      });

      if (!user || user.deletedAt) {
        return null;
      }

      return user;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  }
}

export const authService = new AuthService();
