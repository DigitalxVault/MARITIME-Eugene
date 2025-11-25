'use client';

/**
 * Edit Mission Page
 * Form for editing an existing mission (ADMIN/TRAINER only, ownership-based)
 */

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/api';
import { Mission, UserRole } from '@/types';
import MissionForm from '@/components/missions/MissionForm';

export default function EditMissionPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const missionId = params.id as string;

  // Fetch mission data
  const { data: mission, isLoading, error } = useQuery<Mission>({
    queryKey: ['mission', missionId],
    queryFn: () => api.get<Mission>(`/missions/${missionId}`),
    enabled: !!missionId && !!user,
  });

  // RBAC check: Only ADMIN and TRAINER can edit missions
  useEffect(() => {
    if (!authLoading && (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.TRAINER))) {
      router.push('/dashboard/missions');
    }
  }, [user, authLoading, router]);

  // Combined loading state
  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  // Unauthorized redirect
  if (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.TRAINER)) {
    return null;
  }

  // Error or mission not found
  if (error || !mission) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-error/20 bg-error/10 p-6 text-center text-error">
          Failed to load mission. Please try again.
        </div>
      </div>
    );
  }

  // Permission check: ADMIN and TRAINER can edit all missions
  const canEdit = user.role === UserRole.ADMIN || user.role === UserRole.TRAINER;

  if (!canEdit) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-warning/20 bg-warning/10 p-6 text-center text-warning">
          <p className="font-semibold">Permission Denied</p>
          <p className="mt-2 text-sm">
            You do not have permission to edit this mission.
          </p>
        </div>
      </div>
    );
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
          Back to Mission
        </button>

        <div>
          <h1 className="font-display text-3xl font-bold text-dark-50">Edit Mission</h1>
          <p className="mt-2 text-dark-400">
            Update mission details and configuration.
          </p>
        </div>
      </div>

      {/* Mission Form */}
      <MissionForm mode="edit" initialData={mission} />
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
