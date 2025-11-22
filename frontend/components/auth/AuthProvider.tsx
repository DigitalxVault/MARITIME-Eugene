'use client';

/**
 * Authentication Context Provider
 * Manages authentication state and provides auth methods to the app
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import type {
  AuthContextType,
  User,
  LoginCredentials,
  RegisterData,
} from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login handler
   */
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        setLoading(true);
        const response = await authService.login(credentials);
        setUser(response.user);
        router.push('/dashboard');
      } catch (error) {
        setUser(null);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  /**
   * Register handler
   */
  const register = useCallback(
    async (data: RegisterData) => {
      try {
        setLoading(true);
        const response = await authService.register(data);
        setUser(response.user);
        router.push('/dashboard');
      } catch (error) {
        setUser(null);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  /**
   * Logout handler
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  /**
   * Refresh tokens handler
   */
  const refreshTokens = useCallback(async () => {
    try {
      const response = await authService.refreshToken();
      setUser(response.user);
    } catch (error) {
      console.error('Token refresh failed:', error);
      setUser(null);
      router.push('/login');
      throw error;
    }
  }, [router]);

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    register,
    refreshTokens,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
