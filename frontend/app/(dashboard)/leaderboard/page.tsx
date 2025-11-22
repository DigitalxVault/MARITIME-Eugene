'use client';

/**
 * Leaderboard Page
 * Display top performing players
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { LeaderboardEntry } from '@/types';
import { formatNumber, formatPercentage, getInitials } from '@/lib/utils';

export default function LeaderboardPage() {
  // Fetch leaderboard data
  const { data: leaderboard, isLoading, error } = useQuery<LeaderboardEntry[]>({
    queryKey: ['leaderboard'],
    queryFn: () => api.get<LeaderboardEntry[]>('/leaderboard'),
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-dark-50">Leaderboard</h1>
        <p className="mt-1 text-sm text-dark-400">
          Top performing players ranked by experience points
        </p>
      </div>

      {/* Leaderboard */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-error/20 bg-error/10 p-6 text-center text-error">
          Failed to load leaderboard. Please try again.
        </div>
      ) : !leaderboard?.length ? (
        <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-12 text-center">
          <p className="text-dark-400">No players on the leaderboard yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry) => (
            <LeaderboardRow key={entry.player.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

// Leaderboard Row Component
function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  const username = entry.player.user?.username || 'Unknown';
  const initials = getInitials(username);

  // Medal colors for top 3
  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'bg-warning text-warning';
    if (rank === 2) return 'bg-dark-400 text-dark-400';
    if (rank === 3) return 'bg-warning/60 text-warning/60';
    return 'bg-dark-700 text-dark-400';
  };

  return (
    <div className="flex items-center gap-4 rounded-lg border border-dark-800 bg-dark-900/50 p-4 transition-all hover:border-primary-500/50 hover:shadow-sci-fi">
      {/* Rank */}
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-lg ${getMedalColor(entry.rank)} bg-opacity-10 font-display text-xl font-bold`}
      >
        #{entry.rank}
      </div>

      {/* Player Avatar */}
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500/20 font-semibold text-primary-500">
        {initials}
      </div>

      {/* Player Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-dark-50">{username}</h3>
        <div className="mt-1 flex items-center gap-3 text-sm text-dark-400">
          <span>Level {entry.player.level}</span>
          <span>•</span>
          <span>{formatNumber(entry.player.experiencePoints)} XP</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-8 text-sm">
        <div className="text-center">
          <p className="text-xs text-dark-400">Missions</p>
          <p className="mt-0.5 font-semibold text-dark-50">{entry.completedMissions}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-dark-400">Avg Score</p>
          <p className="mt-0.5 font-semibold text-dark-50">
            {formatPercentage(entry.player.averageScore, 0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-dark-400">Total Score</p>
          <p className="mt-0.5 font-display text-lg font-bold text-primary-500">
            {formatNumber(entry.score)}
          </p>
        </div>
      </div>
    </div>
  );
}
