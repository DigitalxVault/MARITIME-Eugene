'use client';

/**
 * Leaderboard Page
 * Display top performing players with filters for period and metric
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/components/auth/AuthProvider';
import { formatNumber, getInitials } from '@/lib/utils';

// Leaderboard API Response Types
interface LeaderboardRanking {
  playerId: string;
  username: string;
  rank: string;
  position: number;
  score: number;
  averageScore: number;
  completions: number;
  totalTimeSpent: number;
}

interface LeaderboardResponse {
  rankings: LeaderboardRanking[];
  period: string;
  metric: string;
  totalPlayers: number;
}

interface MyRankResponse {
  playerId: string;
  username: string;
  rank: string;
  position: number;
  score: number;
  averageScore: number;
  completions: number;
  totalTimeSpent: number;
  period: string;
  metric: string;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<'all-time' | 'weekly' | 'monthly'>('all-time');
  const [metric, setMetric] = useState<'score' | 'completions' | 'averageScore'>('score');
  const [limit, setLimit] = useState(50);

  // Fetch leaderboard data with auto-refresh every 30 seconds
  const { data: leaderboard, isLoading, error } = useQuery<LeaderboardResponse>({
    queryKey: ['leaderboard', period, metric, limit],
    queryFn: () => api.get<LeaderboardResponse>(`/leaderboard?period=${period}&metric=${metric}&limit=${limit}`),
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    staleTime: 20000, // Consider data stale after 20 seconds
  });

  // Fetch current user rank
  const { data: myRank } = useQuery<MyRankResponse>({
    queryKey: ['leaderboard', 'me', period, metric],
    queryFn: () => api.get<MyRankResponse>(`/leaderboard/me?period=${period}&metric=${metric}`),
    refetchInterval: 30000,
    staleTime: 20000,
    enabled: !!user,
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-dark-50">Leaderboard</h1>
        <p className="mt-1 text-sm text-dark-400">
          Top performing players ranked by {metric === 'score' ? 'total score' : metric === 'completions' ? 'mission completions' : 'average score'}
        </p>
      </div>

      {/* My Rank Card */}
      {myRank && (
        <div className="mb-6 rounded-lg border border-primary-500/50 bg-primary-500/10 p-4 shadow-sci-fi">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-medium text-dark-300">Your Rank</h2>
            <span className="rounded-full bg-primary-500/20 px-3 py-1 text-xs font-semibold text-primary-500">
              #{myRank.position}
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-dark-400">Score: </span>
              <span className="font-semibold text-dark-50">{formatNumber(myRank.score)}</span>
            </div>
            <div>
              <span className="text-dark-400">Completions: </span>
              <span className="font-semibold text-dark-50">{myRank.completions}</span>
            </div>
            <div>
              <span className="text-dark-400">Avg Score: </span>
              <span className="font-semibold text-dark-50">{myRank.averageScore.toFixed(1)}%</span>
            </div>
            {myRank.rank && (
              <div>
                <span className="text-dark-400">Rank: </span>
                <span className="font-semibold text-warning">{myRank.rank}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 rounded-lg border border-dark-800 bg-dark-900/50 p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dark-300">Time Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="w-full rounded-lg border border-dark-700 bg-dark-800 px-3 py-2 text-dark-50 focus:border-primary-500 focus:outline-none"
            >
              <option value="all-time">All Time</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-dark-300">Metric</label>
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value as any)}
              className="w-full rounded-lg border border-dark-700 bg-dark-800 px-3 py-2 text-dark-50 focus:border-primary-500 focus:outline-none"
            >
              <option value="score">Total Score</option>
              <option value="completions">Mission Completions</option>
              <option value="averageScore">Average Score</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-dark-300">Show</label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full rounded-lg border border-dark-700 bg-dark-800 px-3 py-2 text-dark-50 focus:border-primary-500 focus:outline-none"
            >
              <option value="10">Top 10</option>
              <option value="25">Top 25</option>
              <option value="50">Top 50</option>
              <option value="100">Top 100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-error/20 bg-error/10 p-6 text-center text-error">
          Failed to load leaderboard. Please try again.
        </div>
      ) : !leaderboard?.rankings.length ? (
        <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-12 text-center">
          <p className="text-dark-400">No players on the leaderboard yet.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-dark-800 bg-dark-900/50 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-800 bg-dark-800/30">
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-dark-400">
                    Position
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-dark-400">
                    Player
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-dark-400">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-dark-400">
                    Score
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-dark-400">
                    Completions
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-dark-400">
                    Avg Score
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800">
                {leaderboard.rankings.map((ranking) => (
                  <LeaderboardRow key={ranking.playerId} ranking={ranking} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3 p-4">
            {leaderboard.rankings.map((ranking) => (
              <LeaderboardCard key={ranking.playerId} ranking={ranking} />
            ))}
          </div>

          {/* Footer Info */}
          <div className="border-t border-dark-800 bg-dark-800/20 px-6 py-3 text-center text-xs text-dark-400">
            Showing {leaderboard.rankings.length} of {leaderboard.totalPlayers} players • Updates every 30 seconds
          </div>
        </div>
      )}
    </div>
  );
}

// Desktop Leaderboard Row Component
function LeaderboardRow({ ranking }: { ranking: LeaderboardRanking }) {
  const initials = getInitials(ranking.username);

  // Medal colors for top 3
  const getPositionColor = (position: number) => {
    if (position === 1) return 'text-warning';
    if (position === 2) return 'text-dark-300';
    if (position === 3) return 'text-warning/70';
    return 'text-dark-400';
  };

  const isTopThree = ranking.position <= 3;

  return (
    <tr className={`transition-colors hover:bg-dark-800/30 ${isTopThree ? 'bg-dark-800/20' : ''}`}>
      {/* Position */}
      <td className="px-6 py-4">
        <div className={`flex items-center gap-2 font-display text-lg font-bold ${getPositionColor(ranking.position)}`}>
          {ranking.position <= 3 && <TrophyIcon className="h-5 w-5" />}
          #{ranking.position}
        </div>
      </td>

      {/* Player */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/20 text-sm font-semibold text-primary-500">
            {initials}
          </div>
          <div>
            <div className="font-semibold text-dark-50">{ranking.username}</div>
            <div className="text-xs text-dark-400">
              {Math.floor(ranking.totalTimeSpent / 60)}h {ranking.totalTimeSpent % 60}m played
            </div>
          </div>
        </div>
      </td>

      {/* Rank */}
      <td className="px-6 py-4">
        {ranking.rank ? (
          <span className="inline-block rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
            {ranking.rank}
          </span>
        ) : (
          <span className="text-sm text-dark-500">-</span>
        )}
      </td>

      {/* Score */}
      <td className="px-6 py-4 text-right">
        <span className="font-display text-lg font-bold text-primary-500">
          {formatNumber(ranking.score)}
        </span>
      </td>

      {/* Completions */}
      <td className="px-6 py-4 text-right">
        <span className="font-semibold text-dark-50">{ranking.completions}</span>
      </td>

      {/* Average Score */}
      <td className="px-6 py-4 text-right">
        <span className="font-semibold text-dark-50">{ranking.averageScore.toFixed(1)}%</span>
      </td>
    </tr>
  );
}

// Mobile Leaderboard Card Component
function LeaderboardCard({ ranking }: { ranking: LeaderboardRanking }) {
  const initials = getInitials(ranking.username);

  const getPositionColor = (position: number) => {
    if (position === 1) return 'bg-warning/10 border-warning/30 text-warning';
    if (position === 2) return 'bg-dark-700/50 border-dark-600 text-dark-300';
    if (position === 3) return 'bg-warning/5 border-warning/20 text-warning/70';
    return 'bg-dark-800/50 border-dark-700';
  };

  return (
    <div className={`rounded-lg border p-4 ${getPositionColor(ranking.position)}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="font-display text-xl font-bold">
          #{ranking.position}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/20 text-sm font-semibold text-primary-500">
          {initials}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-dark-50">{ranking.username}</div>
          {ranking.rank && (
            <div className="text-xs text-warning">{ranking.rank}</div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div>
          <div className="text-xs text-dark-400">Score</div>
          <div className="font-semibold text-primary-500">{formatNumber(ranking.score)}</div>
        </div>
        <div>
          <div className="text-xs text-dark-400">Completions</div>
          <div className="font-semibold text-dark-50">{ranking.completions}</div>
        </div>
        <div>
          <div className="text-xs text-dark-400">Avg</div>
          <div className="font-semibold text-dark-50">{ranking.averageScore.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
}

// Trophy Icon Component
function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 9c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1v1c0 1.1.9 2 2 2h1v3h4v-3h1c1.1 0 2-.9 2-2v-1h1c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2h-6C8.9 3 8 3.9 8 5v4H6zm12 4h-1V9h1v4zM8 9v4H7V9h1zm8-4v6H8V5h8z"/>
    </svg>
  );
}
