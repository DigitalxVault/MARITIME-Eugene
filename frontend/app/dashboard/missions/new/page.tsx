'use client';

/**
 * Create New Mission Page
 * Form for creating a new mission (ADMIN/TRAINER only)
 */

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { UserRole } from '@/types';
import MissionForm from '@/components/missions/MissionForm';

export default function NewMissionPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // RBAC check: Only ADMIN and TRAINER can create missions
  useEffect(() => {
    if (!loading && (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.TRAINER))) {
      router.push('/dashboard/missions');
    }
  }, [user, loading, router]);

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  // Unauthorized redirect (belt & suspenders with useEffect)
  if (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.TRAINER)) {
    return null;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-sm text-dark-400 transition-colors hover:text-dark-200"
        >
          <BackIcon className="h-4 w-4" />
          Back to Missions
        </button>

        <div>
          <h1 className="font-display text-3xl font-bold text-dark-50">Create New Mission</h1>
          <p className="mt-2 text-dark-400">
            Design a new training mission with learning objectives and configuration.
          </p>
        </div>
      </div>

      {/* Mission Form */}
      <MissionForm mode="create" />
    </div>
  );
}

// Icon Component
function BackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}
