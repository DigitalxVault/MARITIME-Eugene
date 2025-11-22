'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import {
  Shield,
  Clock,
  Target,
  Calendar,
  Edit,
  Trash2,
  PlayCircle,
  Users,
  Trophy,
  AlertCircle,
  ChevronLeft,
  BookOpen,
  CheckCircle
} from 'lucide-react';

export default function MissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const missionId = params.id as string;

  const { data: mission, isLoading, error } = useQuery({
    queryKey: ['mission', missionId],
    queryFn: async () => {
      const response = await api.get(`/missions/${missionId}`);
      return response.data.data;
    },
    enabled: !!missionId,
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/missions/${missionId}`),
    onSuccess: () => {
      toast.success('Mission deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['missions'] });
      router.push('/missions');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete mission');
    },
  });

  const canEdit = user && (user.role === 'ADMIN' || (user.role === 'TRAINER' && mission?.createdBy === user.id));
  const canDelete = user && user.role === 'ADMIN';
  const canStart = user && (user.role === 'LEARNER' || user.role === 'ADMIN' || user.role === 'TRAINER');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'INTERMEDIATE': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'ADVANCED': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'EXPERT': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
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
      case 'ACTIVE': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'DRAFT': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      case 'ARCHIVED': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this mission? This action cannot be undone.')) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <h2 className="text-xl font-semibold text-red-400">Mission Not Found</h2>
          </div>
          <p className="text-gray-300 mb-4">The mission you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/missions"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Missions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Navigation */}
      <Link
        href="/missions"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 mb-6 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to Missions
      </Link>

      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg">
              <span className="text-3xl">{getTypeIcon(mission.type)}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-100">{mission.title}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(mission.difficulty)}`}>
                  {mission.difficulty}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(mission.status)}`}>
                  {mission.status}
                </span>
                <div className="flex items-center gap-1 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{mission.duration} minutes</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{mission._count?.results || 0} completions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {canEdit && (
              <Link
                href={`/missions/${mission.id}/edit`}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>
            )}
            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="border-t border-gray-800 pt-4">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Mission Briefing
          </h2>
          <p className="text-gray-300 leading-relaxed">{mission.description}</p>
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-cyan-400" />
          Learning Objectives
        </h2>
        <div className="space-y-2">
          {mission.learningObjectives?.map((objective: string, index: number) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-gray-300">{objective}</p>
            </div>
          )) || (
            <p className="text-gray-500">No learning objectives defined</p>
          )}
        </div>
      </div>

      {/* Top Results */}
      {mission.results && mission.results.length > 0 && (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Top Performers
          </h2>
          <div className="space-y-3">
            {mission.results.map((result: any, index: number) => (
              <div key={result.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                    index === 1 ? 'bg-gray-400/20 text-gray-300' :
                    index === 2 ? 'bg-orange-600/20 text-orange-400' :
                    'bg-gray-700 text-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-200">
                      {result.player?.user?.email || 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Completed {new Date(result.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-cyan-400">{result.score}</p>
                  <p className="text-sm text-gray-500">points</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {canStart && mission.status === 'ACTIVE' && (
        <div className="flex justify-center">
          <button
            onClick={() => toast.success('Mission execution feature coming soon!')}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg transition-all duration-300 group"
          >
            <PlayCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-lg font-semibold">Start Mission</span>
          </button>
        </div>
      )}

      {/* Meta Information */}
      <div className="mt-8 pt-8 border-t border-gray-800">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Created {new Date(mission.createdAt).toLocaleDateString()}</span>
          </div>
          {mission.updatedAt && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Updated {new Date(mission.updatedAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}