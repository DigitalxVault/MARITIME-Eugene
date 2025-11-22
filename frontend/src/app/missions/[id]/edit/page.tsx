'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { MissionForm } from '@/components/missions/MissionForm';
import { Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function EditMissionPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const missionId = params.id as string;

  const { data: mission, isLoading, error } = useQuery({
    queryKey: ['mission', missionId],
    queryFn: async () => {
      const response = await api.get(`/missions/${missionId}`);
      return response.data.data;
    },
    enabled: !!missionId,
  });

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'ADMIN' && user.role !== 'TRAINER'))) {
      toast.error('You must be an admin or trainer to edit missions');
      router.push('/missions');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (mission && user && user.role === 'TRAINER' && mission.createdBy !== user.id) {
      toast.error('You can only edit missions you created');
      router.push('/missions');
    }
  }, [mission, user, router]);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
          <p className="text-red-400">Failed to load mission. Please try again.</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'TRAINER')) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Edit Mission
            </h1>
            <p className="text-gray-400 mt-1">Update mission details and parameters</p>
          </div>
        </div>
      </div>

      {/* Mission Form */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
        {mission && <MissionForm mission={mission} />}
      </div>
    </div>
  );
}