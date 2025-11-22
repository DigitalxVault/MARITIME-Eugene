/**
 * Utility Functions
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (format === 'relative') {
    return formatRelativeTime(d);
  }

  const options: Intl.DateTimeFormatOptions =
    format === 'long'
      ? { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
      : { year: 'numeric', month: 'short', day: 'numeric' };

  return d.toLocaleDateString('en-US', options);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

/**
 * Format duration in minutes to readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr${hours > 1 ? 's' : ''}`;
  }

  return `${hours} hr${hours > 1 ? 's' : ''} ${remainingMinutes} min`;
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.substring(0, length)}...`;
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole);
}

/**
 * Get difficulty color class
 */
export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    BEGINNER: 'text-success bg-success/10',
    INTERMEDIATE: 'text-info bg-info/10',
    ADVANCED: 'text-warning bg-warning/10',
    EXPERT: 'text-error bg-error/10',
  };
  return colors[difficulty] || 'text-gray-500 bg-gray-500/10';
}

/**
 * Get status color class
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: 'text-dark-400 bg-dark-400/10',
    ACTIVE: 'text-success bg-success/10',
    COMPLETED: 'text-info bg-info/10',
    ARCHIVED: 'text-dark-500 bg-dark-500/10',
    IN_PROGRESS: 'text-warning bg-warning/10',
    FAILED: 'text-error bg-error/10',
    ABANDONED: 'text-dark-500 bg-dark-500/10',
  };
  return colors[status] || 'text-gray-500 bg-gray-500/10';
}

/**
 * Calculate level from experience points
 */
export function calculateLevel(xp: number): number {
  // Simple formula: level = floor(sqrt(xp / 100))
  return Math.floor(Math.sqrt(xp / 100));
}

/**
 * Calculate XP needed for next level
 */
export function xpForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel + 1, 2) * 100;
}

/**
 * Calculate progress to next level
 */
export function levelProgress(currentXp: number, currentLevel: number): number {
  const currentLevelXp = Math.pow(currentLevel, 2) * 100;
  const nextLevelXp = xpForNextLevel(currentLevel);
  const xpInCurrentLevel = currentXp - currentLevelXp;
  const xpNeededForLevel = nextLevelXp - currentLevelXp;

  return Math.min(100, (xpInCurrentLevel / xpNeededForLevel) * 100);
}
