'use client';

/**
 * Dashboard Home Page
 * Overview and quick stats
 */

import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { UserRole } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="mb-2 font-display text-3xl font-bold text-dark-50">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-dark-400">
          {user?.role === UserRole.ADMIN && 'System Administration Dashboard'}
          {user?.role === UserRole.TRAINER && 'Training Management Dashboard'}
          {user?.role === UserRole.PLAYER && 'Your Training Progress'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Missions"
          value="24"
          icon={<MissionIcon />}
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          title="Active Players"
          value="156"
          icon={<UsersIcon />}
          trend="+8%"
          trendUp={true}
        />
        <StatCard
          title="Completion Rate"
          value="87%"
          icon={<ChartIcon />}
          trend="+3%"
          trendUp={true}
        />
        <StatCard
          title="Average Score"
          value="82.5"
          icon={<TrophyIcon />}
          trend="-2%"
          trendUp={false}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-dark-50">Recent Activity</h2>
          <div className="space-y-4">
            <ActivityItem
              type="mission_completed"
              message="Player John Doe completed Mission Alpha"
              time="2 hours ago"
            />
            <ActivityItem
              type="mission_created"
              message="New mission 'Coastal Navigation' created"
              time="4 hours ago"
            />
            <ActivityItem
              type="player_registered"
              message="New player Sarah Chen registered"
              time="6 hours ago"
            />
          </div>
        </div>

        <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-dark-50">Quick Actions</h2>
          <div className="space-y-3">
            {user?.role !== UserRole.PLAYER && (
              <QuickActionButton href="/dashboard/missions/new" label="Create New Mission" />
            )}
            <QuickActionButton href="/dashboard/missions" label="Browse Missions" />
            <QuickActionButton href="/dashboard/leaderboard" label="View Leaderboard" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon,
  trend,
  trendUp,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-6 shadow-sci-fi backdrop-blur-sm transition-all hover:border-primary-500/50">
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-lg bg-primary-500/10 p-3 text-primary-500">{icon}</div>
        <div className={`text-sm font-medium ${trendUp ? 'text-success' : 'text-error'}`}>
          {trend}
        </div>
      </div>
      <h3 className="mb-1 text-sm font-medium text-dark-400">{title}</h3>
      <p className="font-display text-2xl font-bold text-dark-50">{value}</p>
    </div>
  );
}

// Activity Item Component
function ActivityItem({ type, message, time }: { type: string; message: string; time: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-dark-800 bg-dark-800/30 p-3">
      <div className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary-500"></div>
      <div className="flex-1">
        <p className="text-sm text-dark-200">{message}</p>
        <p className="mt-1 text-xs text-dark-500">{time}</p>
      </div>
    </div>
  );
}

// Quick Action Button Component
function QuickActionButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="block rounded-lg border border-dark-700 bg-dark-800 px-4 py-3 text-sm font-medium text-dark-200 transition-colors hover:border-primary-500/50 hover:bg-dark-700 hover:text-dark-50"
    >
      {label}
    </a>
  );
}

// Icon Components
function MissionIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
      />
    </svg>
  );
}
