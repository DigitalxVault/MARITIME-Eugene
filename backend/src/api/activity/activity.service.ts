import { PrismaClient, MissionResult, Mission, PlayerProfile, User } from '@prisma/client';

const prisma = new PrismaClient();

interface CompletionWithRelations extends MissionResult {
  player: PlayerProfile & { user: User };
  mission: Mission;
}

export class ActivityService {
  /**
   * Get recent activity from mission completions and creations
   * @param limit - number of activities to return
   * @param since - timestamp to get activities after
   */
  async getRecentActivity(limit: number = 20, since?: Date) {
    try {
      // Get recent mission completions
      const recentCompletions: CompletionWithRelations[] = await prisma.missionResult.findMany({
        where: since ? { completedAt: { gt: since } } : {},
        include: {
          player: { include: { user: true } },
          mission: true,
        },
        orderBy: { completedAt: 'desc' },
        take: Math.ceil(limit / 2), // Split between completions and creations
      });

      // Get recently created missions
      const recentMissions = await prisma.mission.findMany({
        where: since ? { createdAt: { gt: since } } : {},
        orderBy: { createdAt: 'desc' },
        take: Math.ceil(limit / 2),
      });

      // Transform to activity format
      const completionActivities = recentCompletions.map((result: CompletionWithRelations) => ({
        id: result.id,
        type: 'MISSION_COMPLETED',
        title: result.mission.title,
        status: result.isCompleted ? 'COMPLETED' : 'ATTEMPTED',
        timestamp: result.completedAt.toISOString(),
        message: `${result.player.username} completed "${result.mission.title}" with ${result.score}% score`,
      }));

      const missionActivities = recentMissions.map((mission: Mission) => ({
        id: mission.id,
        type: mission.status === 'DRAFT' ? 'MISSION_CREATED' : 'MISSION_UPDATED',
        title: mission.title,
        status: mission.status,
        timestamp: mission.createdAt.toISOString(),
        message: `New ${mission.difficulty} mission "${mission.title}" created`,
      }));

      // Combine and sort by timestamp
      const allActivities = [...completionActivities, ...missionActivities]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);

      return {
        activities: allActivities,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Activity service error:', error);
      throw error;
    }
  }
}

export const activityService = new ActivityService();
