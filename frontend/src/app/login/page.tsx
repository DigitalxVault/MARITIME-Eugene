'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Anchor } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/missions');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full">
              <Anchor className="w-12 h-12 text-cyan-400" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Sign In
          </h2>

          {error && (
            <div className="mb-6 p-3 bg-red-900/50 border border-red-700 rounded-lg">
              <p className="text-red-400 text-sm">Network Error: {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors pr-12"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-sm text-gray-400 mb-3">DEMO CREDENTIALS</p>
            <div className="space-y-2 text-sm">
              <button
                type="button"
                onClick={() => fillCredentials('admin@maritime.com', 'password123')}
                className="w-full text-left px-3 py-2 bg-gray-800/50 hover:bg-gray-800 rounded transition-colors cursor-pointer"
              >
                <span className="text-gray-300">Admin:</span>{' '}
                <span className="text-cyan-400">admin@maritime.com / password123</span>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('trainer@maritime.com', 'password123')}
                className="w-full text-left px-3 py-2 bg-gray-800/50 hover:bg-gray-800 rounded transition-colors cursor-pointer"
              >
                <span className="text-gray-300">Trainer:</span>{' '}
                <span className="text-cyan-400">trainer@maritime.com / password123</span>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('learner1@maritime.com', 'password123')}
                className="w-full text-left px-3 py-2 bg-gray-800/50 hover:bg-gray-800 rounded transition-colors cursor-pointer"
              >
                <span className="text-gray-300">Player:</span>{' '}
                <span className="text-cyan-400">learner1@maritime.com / password123</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          © 2024 Maritime Training Mission Control. All rights reserved.
        </p>
      </div>
    </div>
  );
}