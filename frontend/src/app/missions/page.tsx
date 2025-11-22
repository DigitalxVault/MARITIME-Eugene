'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  Plus,
  Calendar,
  Clock,
  Target,
  Edit,
  Eye,
  Filter,
  Search
} from 'lucide-react';

interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  type: 'SIMULATION' | 'THEORY' | 'PRACTICAL' | 'ASSESSMENT';
  duration: number;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
  learningObjectives: string[];
  _count?: {
    results: number;
  };
}

export default function MissionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['missions', filterDifficulty, filterType, filterStatus],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterDifficulty) params.append('difficulty', filterDifficulty);
      if (filterType) params.append('type', filterType);
      if (filterStatus) params.append('status', filterStatus);

      const response = await api.get(`/missions?${params.toString()}`);
      return response.data;
    },
  });

  const filteredMissions = data?.data?.filter((mission: Mission) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      mission.title.toLowerCase().includes(query) ||
      mission.description.toLowerCase().includes(query)
    );
  }) || [];

  const canCreateMission = user && (user.role === 'ADMIN' || user.role === 'TRAINER');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'text-green-400 bg-green-500/20';
      case 'INTERMEDIATE': return 'text-yellow-400 bg-yellow-500/20';
      case 'ADVANCED': return 'text-orange-400 bg-orange-500/20';
      case 'EXPERT': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SIMULATION': return '🚀';
      case 'THEORY': return '📚';
      case 'PRACTICAL': return '🔧';
      case 'ASSESSMENT': return '📊';
      default: return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-400 bg-green-500/20';
      case 'DRAFT': return 'text-gray-400 bg-gray-500/20';
      case 'ARCHIVED': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Training Missions
              </h1>
              <p className="text-gray-400 mt-1">Explore and manage maritime training scenarios</p>
            </div>
          </div>

          {canCreateMission && (
            <Link
              href="/missions/new"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg transition-all duration-300 group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              <span>Create Mission</span>
            </Link>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search missions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Filters */}
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
            >
              <option value="">All Difficulties</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="EXPERT">Expert</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
            >
              <option value="">All Types</option>
              <option value="SIMULATION">Simulation</option>
              <option value="THEORY">Theory</option>
              <option value="PRACTICAL">Practical</option>
              <option value="ASSESSMENT">Assessment</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
          <p className="text-red-400">Failed to load missions. Please try again.</p>
        </div>
      )}

      {/* Missions Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMissions.map((mission: Mission) => (
            <div
              key={mission.id}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 group"
            >
              {/* Mission Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getTypeIcon(mission.type)}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(mission.difficulty)}`}>
                    {mission.difficulty}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(mission.status)}`}>
                  {mission.status}
                </span>
              </div>

              {/* Mission Content */}
              <h3 className="text-xl font-bold mb-2 text-gray-100 group-hover:text-cyan-400 transition-colors">
                {mission.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {mission.description}
              </p>

              {/* Mission Meta */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{mission.duration} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span>{mission.learningObjectives?.length || 0} objectives</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/missions/${mission.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </Link>
                {canCreateMission && (
                  <Link
                    href={`/missions/${mission.id}/edit`}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredMissions.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No missions found</h3>
          <p className="text-gray-500">
            {searchQuery || filterDifficulty || filterType || filterStatus
              ? 'Try adjusting your filters'
              : 'No missions have been created yet'}
          </p>
          {canCreateMission && !searchQuery && !filterDifficulty && !filterType && !filterStatus && (
            <Link
              href="/missions/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg transition-all duration-300 mt-4"
            >
              <Plus className="w-5 h-5" />
              <span>Create First Mission</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}