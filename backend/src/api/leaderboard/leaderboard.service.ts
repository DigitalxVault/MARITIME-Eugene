import { PrismaClient, PlayerProfile } from '@prisma/client';

const prisma = new PrismaClient();

interface PlayerWithUser extends PlayerProfile {
  user: {
    email: string;
  };
}

export class LeaderboardService {
  /**
   * Get top players by total score
   * @param limit - number of players to return
   * @param metric - metric to rank by (score, completions, averageScore)
   * @param period - time period (all-time, weekly, monthly)
   */
  async getLeaderboard(limit: number = 10, metric: string = 'score', period: string = 'all-time') {
    try {
      let orderBy: any = {};

      // Map frontend metric to database field
      switch (metric) {
        case 'score':
          orderBy = { totalScore: 'desc' as const };
          break;
        case 'completions':
          orderBy = { totalMissionsCompleted: 'desc' as const };
          break;
        case 'averageScore':
          orderBy = { averageScore: 'desc' as const };
          break;
        default:
          orderBy = { totalScore: 'desc' as const };
      }

      // Add date filtering based on period
      let whereClause: any = {};
      if (period === 'weekly') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        whereClause.updatedAt = { gte: oneWeekAgo };
      } else if (period === 'monthly') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        whereClause.updatedAt = { gte: oneMonthAgo };
      }

      // Get top players
      const players: PlayerWithUser[] = await prisma.playerProfile.findMany({
        where: whereClause,
        orderBy,
        take: limit,
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      });

      // Transform to leaderboard format
      const rankings = players.map((player: PlayerWithUser, index: number) => ({
        playerId: player.id,
        username: player.username,
        rank: player.rank,
        position: index + 1,
        score: player.totalScore,
        averageScore: player.averageScore,
        completions: player.totalMissionsCompleted,
        totalTimeSpent: player.totalTimeSpent,
      }));

      return {
        rankings,
        period,
        metric,
        totalPlayers: await prisma.playerProfile.count({ where: whereClause }),
      };
    } catch (error) {
      console.error('Leaderboard service error:', error);
      throw error;
    }
  }

  /**
   * Get specific player's rank
   * @param userId - User ID to look up
   * @param metric - metric to rank by
   * @param period - time period filter
   */
  async getPlayerRank(userId: string, metric: string = 'score', period: string = 'all-time') {
    try {
      // Get player profile
      const playerProfile = await prisma.playerProfile.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      });

      if (!playerProfile) {
        return null;
      }

      // Determine order field
      let orderField: keyof typeof playerProfile;
      switch (metric) {
        case 'score':
          orderField = 'totalScore';
          break;
        case 'completions':
          orderField = 'totalMissionsCompleted';
          break;
        case 'averageScore':
          orderField = 'averageScore';
          break;
        default:
          orderField = 'totalScore';
      }

      // Add date filtering based on period
      let whereClause: any = {};
      if (period === 'weekly') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        whereClause.updatedAt = { gte: oneWeekAgo };
      } else if (period === 'monthly') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        whereClause.updatedAt = { gte: oneMonthAgo };
      }

      // Count players with better score
      const playerValue = playerProfile[orderField] as number;
      const betterPlayersCount = await prisma.playerProfile.count({
        where: {
          ...whereClause,
          [orderField]: {
            gt: playerValue,
          },
        },
      });

      const position = betterPlayersCount + 1;

      return {
        playerId: playerProfile.id,
        username: playerProfile.username,
        rank: playerProfile.rank,
        position,
        score: playerProfile.totalScore,
        averageScore: playerProfile.averageScore,
        completions: playerProfile.totalMissionsCompleted,
        totalTimeSpent: playerProfile.totalTimeSpent,
        period,
        metric,
      };
    } catch (error) {
      console.error('Get player rank error:', error);
      throw error;
    }
  }
}

export const leaderboardService = new LeaderboardService();
