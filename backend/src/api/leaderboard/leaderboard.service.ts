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
   * @param timeMetric - metric to rank by (score, completions, averageScore)
   */
  async getLeaderboard(limit: number = 10, timeMetric: string = 'score') {
    try {
      let orderBy: any = {};

      // Map frontend metric to database field
      switch (timeMetric) {
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

      // Get top players
      const players: PlayerWithUser[] = await prisma.playerProfile.findMany({
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
        period: 'all-time',
        metric: timeMetric,
        totalPlayers: await prisma.playerProfile.count(),
      };
    } catch (error) {
      console.error('Leaderboard service error:', error);
      throw error;
    }
  }
}

export const leaderboardService = new LeaderboardService();
