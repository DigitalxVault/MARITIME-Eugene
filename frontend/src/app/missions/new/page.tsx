'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { MissionForm } from '@/components/missions/MissionForm';
import { Shield } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function NewMissionPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'ADMIN' && user.role !== 'TRAINER'))) {
      toast.error('You must be an admin or trainer to create missions');
      router.push('/missions');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
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
              Create New Mission
            </h1>
            <p className="text-gray-400 mt-1">Define objectives and parameters for a new training mission</p>
          </div>
        </div>
      </div>

      {/* Mission Form */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
        <MissionForm />
      </div>
    </div>
  );
}