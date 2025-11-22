'use client';

/**
 * Protected Route Component
 * Wraps pages that require authentication
 */

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Check role-based access
    if (!loading && user && requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(user.role)) {
        // Unauthorized - redirect to dashboard
        router.push('/dashboard');
      }
    }
  }, [user, loading, isAuthenticated, requiredRoles, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-950">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
          <p className="text-dark-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Check role-based access
  if (user && requiredRoles && requiredRoles.length > 0) {
    if (!requiredRoles.includes(user.role)) {
      return null; // Will redirect in useEffect
    }
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
}
