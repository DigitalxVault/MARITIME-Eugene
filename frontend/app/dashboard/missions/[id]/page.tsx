'use client';

/**
 * Mission Detail Page
 * View mission details and objectives
 */

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/components/auth/AuthProvider';
import { Mission, UserRole } from '@/types';
import { formatDate, formatDuration, getDifficultyColor, getStatusColor } from '@/lib/utils';

export default function MissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const missionId = params.id as string;

  // Fetch mission details
  const { data: mission, isLoading, error } = useQuery<Mission>({
    queryKey: ['mission', missionId],
    queryFn: () => api.get<Mission>(`/missions/${missionId}`),
    enabled: !!missionId,
  });

  const canEdit = user?.role === UserRole.ADMIN || user?.role === UserRole.TRAINER;
  const canStart = user?.role === UserRole.LEARNER && mission?.status === 'ACTIVE';

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-error/20 bg-error/10 p-6 text-center text-error">
          Failed to load mission details. Please try again.
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
          Back to Missions
        </button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <h1 className="font-display text-3xl font-bold text-dark-50">{mission.title}</h1>
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(mission.status)}`}>
                {mission.status}
              </span>
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${getDifficultyColor(mission.difficulty)}`}>
                {mission.difficulty}
              </span>
            </div>
            <p className="text-dark-400">{mission.description}</p>
          </div>

          <div className="ml-6 flex gap-3">
            {canEdit && (
              <button
                onClick={() => router.push(`/dashboard/missions/${missionId}/edit`)}
                className="rounded-lg border border-dark-700 bg-dark-800 px-4 py-2 font-medium text-dark-200 transition-colors hover:border-primary-500/50 hover:bg-dark-700"
              >
                Edit Mission
              </button>
            )}
            {canStart && (
              <button className="rounded-lg bg-primary-500 px-6 py-2 font-semibold text-white shadow-sci-fi transition-all hover:bg-primary-600">
                Start Mission
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mission Info Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <InfoCard icon={<ClockIcon />} label="Duration" value={`${mission.duration} min`} />
        <InfoCard
          icon={<CalendarIcon />}
          label="Created"
          value={formatDate(mission.createdAt, 'short')}
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Objectives */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-6">
            <h2 className="mb-4 text-xl font-semibold text-dark-50">Learning Objectives</h2>
            {mission.learningObjectives && mission.learningObjectives.length > 0 ? (
              <ul className="space-y-2">
                {mission.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3 text-dark-300">
                    <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-500/20 text-xs font-semibold text-primary-500">
                      {index + 1}
                    </div>
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-dark-400">No learning objectives defined.</p>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-6">
          {mission._count?.results !== undefined && (
            <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-6">
              <h2 className="mb-4 text-lg font-semibold text-dark-50">Statistics</h2>
              <div className="space-y-3">
                <StatRow label="Total Attempts" value={mission._count.results.toString()} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Info Card Component
function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-4">
      <div className="mb-2 text-primary-500">{icon}</div>
      <p className="mb-1 text-xs font-medium text-dark-400">{label}</p>
      <p className="font-display text-lg font-semibold text-dark-50">{value}</p>
    </div>
  );
}

// Stat Row Component
function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-dark-400">{label}</span>
      <span className="font-semibold text-dark-200">{value}</span>
    </div>
  );
}

// Icon Components
function BackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function AttemptIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}
