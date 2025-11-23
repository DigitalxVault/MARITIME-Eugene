/**
 * PlayerCard Component
 * Card component for displaying player information in list view
 */

import React from 'react';
import Link from 'next/link';
import { UserRole } from '@/types';
import { cn, formatDate } from '@/lib/utils';

interface PlayerStats {
  totalMissions: number;
  completedMissions: number;
  activeMissions: number;
  avgScore: number;
  completionRate: number;
}

interface PlayerCardProps {
  player: {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    rank: string;
    createdAt: string;
    stats: PlayerStats;
  };
}

export function PlayerCard({ player }: PlayerCardProps) {
  const getRoleBadgeColor = (role: UserRole): string => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-error/10 text-error';
      case UserRole.TRAINER:
        return 'bg-primary-500/10 text-primary-500';
      case UserRole.PLAYER:
        return 'bg-info/10 text-info';
      default:
        return 'bg-dark-400/10 text-dark-400';
    }
  };

  const getCompletionBarColor = (rate: number): string => {
    if (rate >= 75) return 'bg-success';
    if (rate >= 50) return 'bg-info';
    if (rate >= 25) return 'bg-warning';
    return 'bg-error';
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-info';
    if (score >= 40) return 'text-warning';
    return 'text-error';
  };

  return (
    <Link
      href={`/dashboard/players/${player.id}`}
      className="block rounded-lg border border-dark-800 bg-dark-900/50 p-6 transition-all hover:border-primary-500/50 hover:shadow-sci-fi"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500/20 text-lg font-semibold text-primary-500">
            {player.username.substring(0, 2).toUpperCase()}
          </div>

          {/* Name and Email */}
          <div>
            <h3 className="text-lg font-semibold text-dark-50">{player.username}</h3>
            <p className="text-sm text-dark-400">{player.email}</p>
          </div>
        </div>

        {/* Role Badge */}
        <span
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium',
            getRoleBadgeColor(player.role)
          )}
        >
          {player.role}
        </span>
      </div>

      {/* Rank and Joined Date */}
      <div className="mb-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-dark-400">
          <RankIcon className="h-4 w-4" />
          <span>{player.rank}</span>
        </div>
        <div className="text-dark-500">
          Joined {formatDate(player.createdAt, 'short')}
        </div>
      </div>

      {/* Completion Progress Bar */}
      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="text-dark-300">Completion Rate</span>
          <span className="font-semibold text-dark-200">
            {player.stats.completionRate.toFixed(1)}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-dark-800">
          <div
            className={cn(
              'h-full transition-all duration-300',
              getCompletionBarColor(player.stats.completionRate)
            )}
            style={{ width: `${player.stats.completionRate}%` }}
          />
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-3 gap-4 border-t border-dark-800 pt-4">
        <div className="text-center">
          <div className="text-sm text-dark-400">Active</div>
          <div className="mt-1 text-lg font-semibold text-warning">
            {player.stats.activeMissions}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-dark-400">Completed</div>
          <div className="mt-1 text-lg font-semibold text-success">
            {player.stats.completedMissions}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-dark-400">Avg Score</div>
          <div className={cn('mt-1 text-lg font-semibold', getScoreColor(player.stats.avgScore))}>
            {player.stats.avgScore.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* View Details Button */}
      <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-primary-500 transition-colors group-hover:text-primary-400">
        View Details
        <ArrowRightIcon className="h-4 w-4" />
      </div>
    </Link>
  );
}

// Icon Components
function RankIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
