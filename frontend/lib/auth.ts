/**
 * Authentication Service
 */

import { api, TokenManager } from './api';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
} from '@/types';

/**
 * Authentication API endpoints
 */
export const authService = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);

    // Store tokens
    TokenManager.setTokens(response.tokens.accessToken, response.tokens.refreshToken);

    return response;
  },

  /**
   * Register new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);

    // Store tokens
    TokenManager.setTokens(response.tokens.accessToken, response.tokens.refreshToken);

    return response;
  },

  /**
   * Logout - clear tokens
   */
  logout: async (): Promise<void> => {
    try {
      // Call logout endpoint if exists
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear tokens
      TokenManager.clearTokens();
    }
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User> => {
    return api.get<User>('/auth/me');
  },

  /**
   * Refresh access token
   */
  refreshToken: async (): Promise<AuthResponse> => {
    const refreshToken = TokenManager.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    });

    // Update stored tokens
    TokenManager.setTokens(response.tokens.accessToken, response.tokens.refreshToken);

    return response;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    const token = TokenManager.getAccessToken();
    return !!token;
  },

  /**
   * Verify token validity
   */
  verifyToken: async (): Promise<boolean> => {
    try {
      await authService.getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  },
};
