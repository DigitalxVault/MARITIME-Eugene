'use client';

/**
 * Dashboard Layout
 * Protected layout with sidebar navigation
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/components/auth/AuthProvider';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Navigation items with role-based access
const navigationItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    roles: [UserRole.ADMIN, UserRole.TRAINER, UserRole.PLAYER],
  },
  {
    label: 'Missions',
    href: '/dashboard/missions',
    icon: MissionIcon,
    roles: [UserRole.ADMIN, UserRole.TRAINER, UserRole.PLAYER],
  },
  {
    label: 'Players',
    href: '/dashboard/players',
    icon: UsersIcon,
    roles: [UserRole.ADMIN, UserRole.TRAINER],
  },
  {
    label: 'Leaderboard',
    href: '/dashboard/leaderboard',
    icon: TrophyIcon,
    roles: [UserRole.ADMIN, UserRole.TRAINER, UserRole.PLAYER],
  },
  {
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: ChartIcon,
    roles: [UserRole.ADMIN, UserRole.TRAINER],
  },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Filter navigation by user role
  const visibleNavItems = user
    ? navigationItems.filter((item) => item.roles.includes(user.role))
    : [];

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-dark-950">
        {/* Sidebar */}
        <aside
          className={cn(
            'flex flex-col border-r border-dark-800 bg-dark-900/50 backdrop-blur-sm transition-all duration-300',
            sidebarOpen ? 'w-64' : 'w-20'
          )}
        >
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-dark-800 px-4">
            {sidebarOpen ? (
              <h1 className="font-display text-lg font-bold text-primary-500">
                Mission Control
              </h1>
            ) : (
              <div className="h-8 w-8 rounded bg-primary-500/20 text-primary-500"></div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-1.5 text-dark-400 hover:bg-dark-800 hover:text-dark-200"
            >
              {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {visibleNavItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-500/10 text-primary-500 shadow-glow'
                      : 'text-dark-400 hover:bg-dark-800 hover:text-dark-200'
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          {user && (
            <div className="border-t border-dark-800 p-3">
              <div className={cn('rounded-lg bg-dark-800 p-3', !sidebarOpen && 'px-2')}>
                {sidebarOpen ? (
                  <>
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/20 text-sm font-semibold text-primary-500">
                        {user.username.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-medium text-dark-200">
                          {user.username}
                        </p>
                        <p className="truncate text-xs text-dark-500">{user.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full rounded-lg bg-dark-700 px-3 py-2 text-sm font-medium text-dark-300 transition-colors hover:bg-dark-600 hover:text-dark-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={logout}
                    className="flex w-full items-center justify-center rounded-lg p-2 text-dark-400 hover:bg-dark-700 hover:text-dark-200"
                    title="Logout"
                  >
                    <LogoutIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="flex h-16 items-center justify-between border-b border-dark-800 bg-dark-900/30 px-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-dark-200">
              {navigationItems.find((item) => item.href === pathname)?.label || 'Dashboard'}
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-sm text-dark-400">
                Welcome, <span className="font-medium text-dark-200">{user?.username}</span>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

// Icon Components
function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );
}

function MissionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
      />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={cn('h-5 w-5', className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={cn('h-5 w-5', className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  );
}
