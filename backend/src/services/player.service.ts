import { PrismaClient, PlayerProfile, MissionResult, Prisma, UserRole } from '@prisma/client';
import {
  PlayerQueryInput,
  UpdatePlayerProfileInput,
  PlayerProgressQueryInput,
  RecordMissionResultInput,
} from '../schemas/player.schema';

const prisma = new PrismaClient();

export class PlayerService {
  /**
   * Get all players with pagination and filtering
   */
  async getPlayers(query: PlayerQueryInput) {
    const {
      page,
      limit,
      search,
      rank,
      sortBy,
      sortOrder,
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.PlayerProfileWhereInput = {
      user: {
        deletedAt: null,
      },
      ...(rank && { rank }),
      ...(search && {
        OR: [
          { username: { contains: search, mode: 'insensitive' } },
          { user: { email: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    // Get players with pagination
    const [players, totalCount] = await Promise.all([
      prisma.playerProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      prisma.playerProfile.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      data: players,
      metadata: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    };
  }

  /**
   * Get a single player by ID
   */
  async getPlayerById(id: string): Promise<PlayerProfile | null> {
    return await prisma.playerProfile.findFirst({
      where: {
        id,
        user: {
          deletedAt: null,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });
  }

  /**
   * Get player by user ID
   */
  async getPlayerByUserId(userId: string): Promise<PlayerProfile | null> {
    return await prisma.playerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  /**
   * Update player profile
   */
  async updatePlayerProfile(id: string, data: UpdatePlayerProfileInput): Promise<PlayerProfile> {
    // Check if username is unique if being updated
    if (data.username) {
      const existingPlayer = await prisma.playerProfile.findFirst({
        where: {
          username: data.username,
          NOT: { id },
        },
      });

      if (existingPlayer) {
        throw new Error('Username already taken');
      }
    }

    return await prisma.playerProfile.update({
      where: { id },
      data,
    });
  }

  /**
   * Get player progress (mission results)
   */
  async getPlayerProgress(playerId: string, query: PlayerProgressQueryInput) {
    const {
      page,
      limit,
      missionId,
      completed,
      sortBy,
      sortOrder,
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.MissionResultWhereInput = {
      playerId,
      ...(missionId && { missionId }),
      ...(completed !== undefined && { completed }),
    };

    // Get mission results with pagination
    const [results, totalCount] = await Promise.all([
      prisma.missionResult.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          mission: {
            select: {
              id: true,
              title: true,
              type: true,
              difficulty: true,
              totalScore: true,
              passingScore: true,
            },
          },
        },
      }),
      prisma.missionResult.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      data: results,
      metadata: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    };
  }

  /**
   * Record a mission result
   */
  async recordMissionResult(playerId: string, data: RecordMissionResultInput): Promise<MissionResult> {
    const { missionId, score, timeSpent, completed, details } = data;

    // Create mission result
    const result = await prisma.missionResult.create({
      data: {
        playerId,
        missionId,
        score,
        timeSpent,
        completed,
        details,
        completedAt: completed ? new Date() : null,
      },
      include: {
        mission: true,
        player: true,
      },
    });

    // Update player stats if mission was completed
    if (completed) {
      await this.updatePlayerStats(playerId);
    }

    return result;
  }

  /**
   * Update player statistics based on mission results
   */
  private async updatePlayerStats(playerId: string): Promise<void> {
    // Get all mission results for the player
    const results = await prisma.missionResult.findMany({
      where: { playerId },
      include: {
        mission: {
          select: {
            totalScore: true,
          },
        },
      },
    });

    // Calculate stats
    const totalMissions = results.length;
    const completedMissions = results.filter(r => r.completed).length;
    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const maxPossibleScore = results.reduce((sum, r) => sum + r.mission.totalScore, 0);

    const winRate = totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0;
    const averageScore = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;

    // Update player profile
    await prisma.playerProfile.update({
      where: { id: playerId },
      data: {
        missionsCompleted: completedMissions,
        winRate: Math.round(winRate),
        averageScore: Math.round(averageScore),
      },
    });
  }

  /**
   * Get player statistics
   */
  async getPlayerStats(playerId: string) {
    const player = await this.getPlayerById(playerId);

    if (!player) {
      return null;
    }

    // Get recent mission results
    const recentResults = await prisma.missionResult.findMany({
      where: { playerId },
      take: 10,
      orderBy: { completedAt: 'desc' },
      include: {
        mission: {
          select: {
            title: true,
            type: true,
            difficulty: true,
          },
        },
      },
    });

    // Get mission statistics by difficulty
    const difficultyStats = await prisma.missionResult.groupBy({
      by: ['completed'],
      where: { playerId },
      _count: {
        id: true,
      },
    });

    // Get time-based performance
    const performanceOverTime = await prisma.$queryRaw`
      SELECT
        DATE_TRUNC('day', "completedAt") as date,
        COUNT(*) as missions,
        AVG(score) as avgScore,
        SUM(CASE WHEN completed THEN 1 ELSE 0 END) as completed
      FROM "MissionResult"
      WHERE "playerId" = ${playerId}
        AND "completedAt" IS NOT NULL
        AND "completedAt" >= NOW() - INTERVAL '30 days'
      GROUP BY DATE_TRUNC('day', "completedAt")
      ORDER BY date DESC
    `;

    return {
      player,
      recentResults,
      difficultyStats,
      performanceOverTime,
    };
  }

  /**
   * Check if a user can view player details
   */
  async canUserViewPlayer(requestingUserId: string, playerId: string, userRole: UserRole): Promise<boolean> {
    // ADMIN and TRAINER can view any player
    if (userRole === UserRole.ADMIN || userRole === UserRole.TRAINER) {
      return true;
    }

    // LEARNER can only view their own profile
    if (userRole === UserRole.LEARNER) {
      const player = await prisma.playerProfile.findUnique({
        where: { id: playerId },
        select: { userId: true },
      });
      return player?.userId === requestingUserId;
    }

    return false;
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(limit: number = 10) {
    return await prisma.playerProfile.findMany({
      where: {
        user: {
          deletedAt: null,
        },
      },
      orderBy: [
        { winRate: 'desc' },
        { averageScore: 'desc' },
        { missionsCompleted: 'desc' },
      ],
      take: limit,
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });
  }
}

export default new PlayerService();