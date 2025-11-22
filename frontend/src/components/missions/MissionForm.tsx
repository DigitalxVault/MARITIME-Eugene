'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Mission } from '@/types/mission';
import dynamic from 'next/dynamic';

// Dynamic import for RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(
  () => import('@/components/editor/RichTextEditor').then(mod => mod.RichTextEditor),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 bg-gray-800 border border-gray-700 rounded-lg animate-pulse"></div>
    ),
  }
);

const missionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
  type: z.enum(['SIMULATION', 'THEORY', 'PRACTICAL', 'ASSESSMENT']),
  duration: z.number().min(5, 'Duration must be at least 5 minutes').max(480, 'Duration cannot exceed 8 hours'),
  learningObjectives: z.array(z.string()).min(1, 'At least one learning objective is required'),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).default('DRAFT'),
});

type MissionFormData = z.infer<typeof missionSchema>;

interface MissionFormProps {
  mission?: Mission;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function MissionForm({ mission, onSuccess, onCancel }: MissionFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [objectives, setObjectives] = useState<string[]>(
    mission?.learningObjectives || ['']
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<MissionFormData>({
    resolver: zodResolver(missionSchema),
    defaultValues: {
      title: mission?.title || '',
      description: mission?.description || '',
      difficulty: mission?.difficulty || 'BEGINNER',
      type: mission?.type || 'SIMULATION',
      duration: mission?.duration || 30,
      learningObjectives: mission?.learningObjectives || [],
      status: mission?.status || 'DRAFT',
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: MissionFormData) => api.post('/missions', data),
    onSuccess: () => {
      toast.success('Mission created successfully');
      queryClient.invalidateQueries({ queryKey: ['missions'] });
      onSuccess?.();
      router.push('/missions');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create mission');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: MissionFormData) => api.put(`/missions/${mission?.id}`, data),
    onSuccess: () => {
      toast.success('Mission updated successfully');
      queryClient.invalidateQueries({ queryKey: ['missions'] });
      queryClient.invalidateQueries({ queryKey: ['mission', mission?.id] });
      onSuccess?.();
      router.push(`/missions/${mission?.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update mission');
    },
  });

  const onSubmit = (data: MissionFormData) => {
    // Filter out empty objectives
    const filteredObjectives = objectives.filter(obj => obj.trim() !== '');
    data.learningObjectives = filteredObjectives;

    if (mission) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const addObjective = () => {
    setObjectives([...objectives, '']);
  };

  const removeObjective = (index: number) => {
    const newObjectives = objectives.filter((_, i) => i !== index);
    setObjectives(newObjectives);
    setValue('learningObjectives', newObjectives);
  };

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    setObjectives(newObjectives);
    setValue('learningObjectives', newObjectives);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Mission Title *
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
          placeholder="Enter mission title"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Mission Briefing *
        </label>
        <RichTextEditor
          content={watch('description')}
          onChange={(content) => setValue('description', content)}
          placeholder="Describe the mission objectives, requirements, and detailed briefing..."
          className="mb-1"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Difficulty and Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium mb-2">
            Difficulty Level *
          </label>
          <select
            id="difficulty"
            {...register('difficulty')}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
            <option value="EXPERT">Expert</option>
          </select>
          {errors.difficulty && (
            <p className="text-red-500 text-sm mt-1">{errors.difficulty.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-2">
            Mission Type *
          </label>
          <select
            id="type"
            {...register('type')}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
          >
            <option value="SIMULATION">Simulation</option>
            <option value="THEORY">Theory</option>
            <option value="PRACTICAL">Practical</option>
            <option value="ASSESSMENT">Assessment</option>
          </select>
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
          )}
        </div>
      </div>

      {/* Duration and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="duration" className="block text-sm font-medium mb-2">
            Duration (minutes) *
          </label>
          <input
            id="duration"
            type="number"
            {...register('duration', { valueAsNumber: true })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
            placeholder="30"
            min={5}
            max={480}
          />
          {errors.duration && (
            <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-2">
            Status
          </label>
          <select
            id="status"
            {...register('status')}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
          >
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Learning Objectives */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Learning Objectives *
        </label>
        <div className="space-y-2">
          {objectives.map((objective, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={objective}
                onChange={(e) => updateObjective(index, e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
                placeholder={`Objective ${index + 1}`}
              />
              {objectives.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeObjective(index)}
                  className="px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addObjective}
          className="mt-2 px-4 py-2 bg-cyan-600/20 text-cyan-400 rounded-lg hover:bg-cyan-600/30 transition-colors"
        >
          + Add Objective
        </button>
        {errors.learningObjectives && (
          <p className="text-red-500 text-sm mt-1">{errors.learningObjectives.message}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
        <button
          type="button"
          onClick={onCancel || (() => router.back())}
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : mission ? 'Update Mission' : 'Create Mission'}
        </button>
      </div>
    </form>
  );
}