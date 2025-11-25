import { PrismaClient, UserRole, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface GetPlayersParams {
  search?: string;
  role?: UserRole;
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Commented out unused interface
// interface PlayerWithStats extends PlayerProfile {
//   user: {
//     id: string;
//     email: string;
//     role: UserRole;
//     createdAt: Date;
//   };
//   stats?: {
//     totalMissions: number;
//     completedMissions: number;
//     activeMissions: number;
//     avgScore: number;
//     completionRate: number;
//   };
// }

export class PlayerService {
  /**
   * Get all players with pagination and filtering
   */
  async getPlayers(params: GetPlayersParams) {
    const { search, role, page, limit, sortBy = 'level', sortOrder = 'desc' } = params;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      ...(role && { role }),
      ...(search && {
        OR: [
          { email: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
          {
            playerProfile: {
              username: { contains: search, mode: 'insensitive' as Prisma.QueryMode },
            },
          },
        ],
      }),
    };

    // Build order by clause - map frontend fields to database fields
    let orderBy: any = {};

    // Fields that exist on PlayerProfile
    const profileFields = ['level', 'experiencePoints', 'totalMissionsCompleted', 'averageScore', 'winRate'];

    if (profileFields.includes(sortBy)) {
      // Sort by player profile field
      orderBy = {
        playerProfile: {
          [sortBy]: sortOrder,
        },
      };
    } else {
      // Default to createdAt on user
      orderBy = {
        createdAt: sortOrder,
      };
    }

    // Get users with player profiles
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          playerProfile: {
            include: {
              missionResults: {
                select: {
                  id: true,
                  score: true,
                  isCompleted: true,
                },
              },
            },
          },
        },
        orderBy,
      }),
      prisma.user.count({ where }),
    ]);

    // Transform to player data with stats
    const playersWithStats = users.map((user) => {
      const profile = user.playerProfile;

      if (!profile) {
        return null;
      }

      const totalMissions = profile.missionResults.length;
      const completedMissions = profile.missionResults.filter((r) => r.isCompleted).length;
      const activeMissions = totalMissions - completedMissions;
      const avgScore = totalMissions > 0
        ? profile.missionResults.reduce((sum: number, r) => sum + r.score, 0) / totalMissions
        : 0;
      const completionRate = totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0;

      return {
        id: profile.id,
        userId: user.id,
        rank: profile.rank,
        level: profile.level,
        experiencePoints: profile.experiencePoints,
        totalMissionsCompleted: profile.totalMissionsCompleted,
        totalMissionsAttempted: profile.totalMissionsAttempted,
        averageScore: profile.averageScore,
        winRate: profile.winRate,
        totalTimeSpent: profile.totalTimeSpent,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        user: {
          id: user.id,
          email: user.email,
          username: profile.username,
          role: user.role,
        },
        stats: {
          totalMissions,
          completedMissions,
          activeMissions,
          avgScore: Math.round(avgScore * 10) / 10,
          completionRate: Math.round(completionRate * 10) / 10,
        },
      };
    }).filter((p) => p !== null);

    return {
      data: playersWithStats,
      meta: {
        page,
        limit,
        totalCount: total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Get player by ID
   */
  async getPlayerById(id: string) {
    const profile = await prisma.playerProfile.findFirst({
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

    if (!profile) {
      return null;
    }

    return {
      id: profile.id,
      userId: profile.user.id,
      rank: profile.rank,
      level: profile.level,
      experiencePoints: profile.experiencePoints,
      totalMissionsCompleted: profile.totalMissionsCompleted,
      totalMissionsAttempted: profile.totalMissionsAttempted,
      winRate: profile.winRate,
      averageScore: profile.averageScore,
      missionsCompleted: profile.missionsCompleted,
      totalTimeSpent: profile.totalTimeSpent,
      createdAt: profile.user.createdAt.toISOString(),
      user: {
        id: profile.user.id,
        email: profile.user.email,
        username: profile.username,
        role: profile.user.role,
      },
    };
  }

  /**
   * Get player statistics
   */
  async getPlayerStats(playerId: string) {
    const results = await prisma.missionResult.findMany({
      where: {
        playerId,
      },
      include: {
        mission: {
          select: {
            id: true,
            title: true,
            difficulty: true,
          },
        },
      },
    });

    const totalMissions = results.length;
    const completedMissions = results.filter((r) => r.isCompleted).length;
    const activeMissions = totalMissions - completedMissions;
    const avgScore = totalMissions > 0
      ? results.reduce((sum: number, r) => sum + r.score, 0) / totalMissions
      : 0;
    const completionRate = totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0;

    return {
      totalMissions,
      completedMissions,
      activeMissions,
      avgScore: Math.round(avgScore * 10) / 10,
      completionRate: Math.round(completionRate * 10) / 10,
    };
  }

  /**
   * Get player progress (mission results for charts)
   */
  async getPlayerProgress(playerId: string) {
    // Get last 20 mission results for trend charts
    const missions = await prisma.missionResult.findMany({
      where: {
        playerId,
        isCompleted: true,
      },
      take: 20,
      orderBy: {
        completedAt: 'desc',
      },
      include: {
        mission: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            status: true,
          },
        },
      },
    });

    // Format for charts (reverse to show oldest to newest)
    const trends = missions.reverse().map((m) => ({
      missionTitle: m.mission.title,
      score: m.score,
      date: m.completedAt.toISOString(),
    }));

    // Get current active missions
    const activeMissions = await prisma.missionResult.findMany({
      where: {
        playerId,
        isCompleted: false,
      },
      include: {
        mission: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            duration: true,
          },
        },
      },
    });

    return {
      missions: missions.map((m) => ({
        id: m.id,
        missionId: m.mission.id,
        title: m.mission.title,
        difficulty: m.mission.difficulty,
        score: m.score,
        timeSpent: m.timeSpent,
        isCompleted: m.isCompleted,
        completedAt: m.completedAt.toISOString(),
      })),
      trends: {
        dates: trends.map((t) => t.date),
        scores: trends.map((t) => t.score),
        labels: trends.map((t) => t.missionTitle),
      },
      activeMissions: activeMissions.map((m) => ({
        id: m.id,
        missionId: m.mission.id,
        title: m.mission.title,
        difficulty: m.mission.difficulty,
        duration: m.mission.duration,
        currentScore: m.score,
        timeSpent: m.timeSpent,
      })),
    };
  }
}

export const playerService = new PlayerService();
