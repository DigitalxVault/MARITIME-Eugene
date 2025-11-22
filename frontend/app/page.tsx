'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page
    router.push('/login');
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-950 bg-grid-pattern">
      <div className="text-center">
        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        <p className="text-dark-300">Loading...</p>
      </div>
    </div>
  );
}
