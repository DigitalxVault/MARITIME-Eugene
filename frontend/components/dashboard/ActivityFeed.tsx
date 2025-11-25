'use client';

/**
 * Activity Feed Component
 * Real-time activity feed with polling from backend /api/activity/recent endpoint
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

interface Activity {
  id: string;
  type: string;
  title: string;
  status: string;
  timestamp: string;
  message: string;
}

interface ActivityFeedProps {
  pollInterval?: number; // in milliseconds, default 10s
  limit?: number; // number of activities to fetch
}

export default function ActivityFeed({ pollInterval = 10000, limit = 10 }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const lastFetchRef = useRef<string | null>(null);

  const INITIAL_DISPLAY_COUNT = 10;

  const fetchActivities = useCallback(async () => {
    try {
      const params: any = { limit };

      // Use 'since' parameter for delta updates after first fetch
      if (lastFetchRef.current) {
        params.since = lastFetchRef.current;
      }

      const response = await axios.get('http://localhost:4000/api/activity/recent', {
        params,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.data.success) {
        const newActivities = response.data.data;

        // If we have new activities, prepend them to existing list
        if (lastFetchRef.current && newActivities.length > 0) {
          setActivities(prev => [...newActivities, ...prev].slice(0, limit));
        } else if (!lastFetchRef.current) {
          // Initial fetch
          setActivities(newActivities);
        }

        // Update last fetch timestamp
        lastFetchRef.current = response.data.timestamp;
        setError(null);
      }
    } catch (err: any) {
      console.error('Failed to fetch activities:', err);
      setError(err.response?.data?.message || 'Failed to load activities');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Initial fetch and polling setup
  useEffect(() => {
    fetchActivities();

    // Set up polling interval
    const intervalId = setInterval(fetchActivities, pollInterval);

    return () => clearInterval(intervalId);
  }, [fetchActivities, pollInterval]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'MISSION_CREATED':
        return (
          <div className="rounded-full bg-success/10 p-2">
            <svg className="h-4 w-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        );
      case 'MISSION_UPDATED':
        return (
          <div className="rounded-full bg-primary-500/10 p-2">
            <svg className="h-4 w-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="h-2 w-2 flex-shrink-0 rounded-full bg-primary-500 mt-2"></div>
        );
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now.getTime() - activityTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  if (loading && activities.length === 0) {
    return (
      <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-6">
        <h2 className="mb-4 text-lg font-semibold text-dark-50">Recent Activity</h2>
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-dark-50">Recent Activity</h2>
        {!loading && (
          <div className="flex items-center gap-2 text-xs text-dark-500">
            <div className="h-2 w-2 animate-pulse rounded-full bg-success"></div>
            <span>Live</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-error/20 bg-error/10 p-3 text-sm text-error">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {activities.length === 0 ? (
          <div className="py-8 text-center text-sm text-dark-500">
            No recent activity
          </div>
        ) : (
          <>
            {(showAll ? activities : activities.slice(0, INITIAL_DISPLAY_COUNT)).map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 rounded-lg border border-dark-800 bg-dark-800/30 p-3 transition-colors hover:border-dark-700"
              >
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-dark-200 break-words">{activity.message}</p>
                  <p className="mt-1 text-xs text-dark-500">{formatTime(activity.timestamp)}</p>
                </div>
              </div>
            ))}

            {activities.length > INITIAL_DISPLAY_COUNT && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full rounded-lg border border-dark-700 bg-dark-800 px-4 py-2.5 text-sm font-medium text-dark-200 transition-all hover:border-primary-500/50 hover:bg-dark-700 hover:text-primary-500"
              >
                {showAll
                  ? 'SHOW LESS'
                  : `LOAD MORE (${activities.length - INITIAL_DISPLAY_COUNT} more)`
                }
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
