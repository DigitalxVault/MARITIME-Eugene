'use client';

/**
 * Login Page
 * Authentication page for Maritime Training Mission Control
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Form validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const fillCredentials = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      const response = await axios.post('http://localhost:4000/api/auth/login', {
        email: data.email,
        password: data.password,
      }, {
        withCredentials: true,
      });

      if (response.data.success) {
        // Store token
        if (response.data.data.accessToken) {
          localStorage.setItem('accessToken', response.data.data.accessToken);
        }

        // Force a small delay to ensure token is saved
        await new Promise(resolve => setTimeout(resolve, 100));

        // Redirect to root - dashboard is at / inside (dashboard) route group
        window.location.href = '/';
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-950 bg-grid-pattern px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-block rounded-lg bg-primary-500/10 p-3">
            <svg
              className="h-12 w-12 text-primary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold text-dark-50">
            Mission Control
          </h1>
          <p className="mt-2 text-dark-400">Maritime Training Dashboard</p>
        </div>

        {/* Login Form */}
        <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-8 shadow-sci-fi backdrop-blur-sm">
          <h2 className="mb-6 text-center text-xl font-semibold text-dark-50">
            Sign In
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-lg border border-error/20 bg-error/10 p-3 text-sm text-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-dark-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className="w-full rounded-lg border border-dark-700 bg-dark-800 px-4 py-2.5 text-dark-50 placeholder-dark-500 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-error">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-dark-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                className="w-full rounded-lg border border-dark-700 bg-dark-800 px-4 py-2.5 text-dark-50 placeholder-dark-500 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1.5 text-sm text-error">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-primary-500 px-4 py-2.5 font-semibold text-white shadow-sci-fi transition-all hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="mr-2 h-5 w-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 rounded-lg border border-dark-800 bg-dark-800/30 p-4">
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-dark-400">
              Demo Credentials
            </p>
            <div className="space-y-2 text-sm">
              <button
                type="button"
                onClick={() => fillCredentials('admin@navytraining.sg', 'Admin123!')}
                className="w-full text-left rounded px-3 py-2 text-dark-300 hover:bg-dark-700/50 transition-colors cursor-pointer"
              >
                <span className="font-medium">Admin:</span> admin@navytraining.sg / Admin123!
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('trainer@navytraining.sg', 'Trainer123!')}
                className="w-full text-left rounded px-3 py-2 text-dark-300 hover:bg-dark-700/50 transition-colors cursor-pointer"
              >
                <span className="font-medium">Trainer:</span> trainer@navytraining.sg / Trainer123!
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('cadet.tan@navytraining.sg', 'Cadet123!')}
                className="w-full text-left rounded px-3 py-2 text-dark-300 hover:bg-dark-700/50 transition-colors cursor-pointer"
              >
                <span className="font-medium">Learner:</span> cadet.tan@navytraining.sg / Cadet123!
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-dark-500">
          © 2025 Maritime Training Mission Control Job Assignment. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
