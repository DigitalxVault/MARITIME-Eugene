'use client';

/**
 * Root Landing Page
 * Redirects to login page for authentication
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export default function RootPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is authenticated, redirect to dashboard
        router.push('/dashboard');
      } else {
        // User is not authenticated, redirect to login
        router.push('/auth/login');
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-950">
      <div className="text-center">
        <div className="mb-4 inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        <p className="text-dark-400">Loading...</p>
      </div>
    </div>
  );
}
