import { PrismaClient, UserRole } from '@prisma/client';
import { cacheService } from './cache.service';

const prisma = new PrismaClient();

export class AnalyticsService {
  private readonly CACHE_TTL = 300; // 5 minutes cache

  /**
   * Get dashboard overview metrics
   */
  async getDashboardOverview(userRole?: UserRole, userId?: string) {
    const cacheKey = `analytics:dashboard:${userRole}:${userId || 'public'}`;

    // Try to get from cache
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    // Build where clause based on role
    const missionWhere = userRole === UserRole.LEARNER ? { status: 'ACTIVE' as const } : {};
    const playerWhere = {}; // Removed creatorId - field doesn't exist in User model

    // Get all metrics
    const [
      totalMissions,
      activeMissions,
      totalPlayers,
      activePlayers,
      totalCompletions,
      recentCompletions,
      topPerformers,
      missionsByDifficulty,
      missionsByType,
    ] = await Promise.all([
      // Total missions
      prisma.mission.count({
        where: { deletedAt: null, ...missionWhere },
      }),

      // Active missions
      prisma.mission.count({
        where: { deletedAt: null, status: 'ACTIVE' as const, ...missionWhere },
      }),

      // Total players
      prisma.playerProfile.count({
        where: { user: { deletedAt: null }, ...playerWhere },
      }),

      // Active players (played in last 7 days)
      prisma.playerProfile.count({
        where: {
          user: { deletedAt: null },
          missionResults: {
            some: {
              completedAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              },
            },
          },
          ...playerWhere,
        },
      }),

      // Total completions
      prisma.missionResult.count({
        where: { isCompleted: true },
      }),

      // Recent completions (last 24 hours)
      prisma.missionResult.findMany({
        where: {
          isCompleted: true,
          completedAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
        take: 10,
        orderBy: { completedAt: 'desc' },
        include: {
          player: {
            select: {
              username: true,
              rank: true,
            },
          },
          mission: {
            select: {
              title: true,
              difficulty: true,
            },
          },
        },
      }),

      // Top performers
      prisma.playerProfile.findMany({
        where: { user: { deletedAt: null }, ...playerWhere },
        take: 5,
        orderBy: [
          { winRate: 'desc' },
          { averageScore: 'desc' },
        ],
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      }),

      // Missions by difficulty
      prisma.mission.groupBy({
        by: ['difficulty'],
        where: { deletedAt: null, ...missionWhere },
        _count: { id: true },
      }),

      // Missions by type
      prisma.mission.groupBy({
        by: ['type'],
        where: { deletedAt: null, ...missionWhere },
        _count: { id: true },
      }),
    ]);

    const overview = {
      metrics: {
        totalMissions,
        activeMissions,
        totalPlayers,
        activePlayers,
        totalCompletions,
        completionRate: totalMissions > 0
          ? Math.round((totalCompletions / (totalMissions * totalPlayers || 1)) * 100)
          : 0,
      },
      recentActivity: {
        recentCompletions,
        topPerformers,
      },
      distributions: {
        missionsByDifficulty: missionsByDifficulty.map((item) => ({
          difficulty: item.difficulty,
          count: item._count || 0,
        })),
        missionsByType: missionsByType.map((item) => ({
          type: item.type,
          count: item._count || 0,
        })),
      },
    };

    // Cache the result
    await cacheService.set(cacheKey, overview, this.CACHE_TTL);

    return overview;
  }

  /**
   * Get analytics for a specific mission
   */
  async getMissionAnalytics(missionId: string) {
    const cacheKey = `analytics:mission:${missionId}`;

    // Try to get from cache
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    const mission = await prisma.mission.findUnique({
      where: { id: missionId, deletedAt: null },
    });

    if (!mission) {
      return null;
    }

    // Get all analytics data
    const [
      totalAttempts,
      completions,
      averageMetrics,
      scoreDistribution,
      timeDistribution,
      recentAttempts,
      topScorers,
    ] = await Promise.all([
      // Total attempts
      prisma.missionResult.count({
        where: { missionId },
      }),

      // Successful completions
      prisma.missionResult.count({
        where: { missionId, isCompleted: true },
      }),

      // Average metrics
      prisma.missionResult.aggregate({
        where: { missionId },
        _avg: {
          score: true,
          timeSpent: true,
        },
      }),

      // Score distribution
      prisma.$queryRaw`
        SELECT
          CASE
            WHEN score < 50 THEN '0-49'
            WHEN score < 70 THEN '50-69'
            WHEN score < 85 THEN '70-84'
            WHEN score < 95 THEN '85-94'
            ELSE '95-100'
          END as range,
          COUNT(*) as count
        FROM "mission_results"
        WHERE "missionId" = ${missionId}
        GROUP BY range
        ORDER BY range
      `,

      // Time distribution
      prisma.$queryRaw`
        SELECT
          CASE
            WHEN "timeSpent" < 300 THEN '< 5 min'
            WHEN "timeSpent" < 600 THEN '5-10 min'
            WHEN "timeSpent" < 1800 THEN '10-30 min'
            WHEN "timeSpent" < 3600 THEN '30-60 min'
            ELSE '> 60 min'
          END as range,
          COUNT(*) as count
        FROM "mission_results"
        WHERE "missionId" = ${missionId}
        GROUP BY range
        ORDER BY range
      `,

      // Recent attempts
      prisma.missionResult.findMany({
        where: { missionId },
        take: 10,
        orderBy: { completedAt: 'desc' },
        include: {
          player: {
            select: {
              username: true,
              rank: true,
            },
          },
        },
      }),

      // Top scorers
      prisma.missionResult.findMany({
        where: { missionId, isCompleted: true },
        take: 5,
        orderBy: { score: 'desc' },
        include: {
          player: {
            select: {
              username: true,
              rank: true,
            },
          },
        },
      }),
    ]);

    const analytics = {
      mission: {
        id: mission.id,
        title: mission.title,
        difficulty: mission.difficulty,
        type: mission.type,
      },
      metrics: {
        totalAttempts,
        completions,
        completionRate: totalAttempts > 0
          ? Math.round((completions / totalAttempts) * 100)
          : 0,
        averageScore: Math.round(averageMetrics._avg.score || 0),
        averageTime: Math.round(averageMetrics._avg.timeSpent || 0),
      },
      distributions: {
        scoreDistribution,
        timeDistribution,
      },
      leaderboard: {
        topScorers,
        recentAttempts,
      },
    };

    // Cache the result
    await cacheService.set(cacheKey, analytics, this.CACHE_TTL);

    return analytics;
  }

  /**
   * Get player analytics
   */
  async getPlayerAnalytics(playerId: string) {
    const cacheKey = `analytics:player:${playerId}`;

    // Try to get from cache
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    const player = await prisma.playerProfile.findUnique({
      where: { id: playerId },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    });

    if (!player) {
      return null;
    }

    // Get analytics data
    const [
      missionHistory,
      performanceByDifficulty,
      performanceByType,
      progressOverTime,
      strengths,
      weaknesses,
    ] = await Promise.all([
      // Mission history
      prisma.missionResult.findMany({
        where: { playerId },
        take: 20,
        orderBy: { completedAt: 'desc' },
        include: {
          mission: {
            select: {
              title: true,
              difficulty: true,
              type: true,
            },
          },
        },
      }),

      // Performance by difficulty
      prisma.$queryRaw`
        SELECT
          m.difficulty,
          COUNT(mr.id) as attempts,
          SUM(CASE WHEN mr."isCompleted" THEN 1 ELSE 0 END) as completions,
          AVG(mr.score) as avgScore
        FROM "mission_results" mr
        JOIN "missions" m ON mr."missionId" = m.id
        WHERE mr."playerId" = ${playerId}
        GROUP BY m.difficulty
      `,

      // Performance by type
      prisma.$queryRaw`
        SELECT
          m.type,
          COUNT(mr.id) as attempts,
          SUM(CASE WHEN mr."isCompleted" THEN 1 ELSE 0 END) as completions,
          AVG(mr.score) as avgScore
        FROM "mission_results" mr
        JOIN "missions" m ON mr."missionId" = m.id
        WHERE mr."playerId" = ${playerId}
        GROUP BY m.type
      `,

      // Progress over time (last 30 days)
      prisma.$queryRaw`
        SELECT
          DATE(mr."completedAt") as date,
          COUNT(*) as missions,
          AVG(mr.score) as avgScore,
          SUM(CASE WHEN mr."isCompleted" THEN 1 ELSE 0 END) as completed
        FROM "mission_results" mr
        WHERE mr."playerId" = ${playerId}
          AND mr."completedAt" >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(mr."completedAt")
        ORDER BY date DESC
      `,

      // Strengths (best performing mission types)
      prisma.$queryRaw`
        SELECT
          m.type,
          m.difficulty,
          AVG(mr.score) as avgScore
        FROM "mission_results" mr
        JOIN "missions" m ON mr."missionId" = m.id
        WHERE mr."playerId" = ${playerId}
          AND mr."isCompleted" = true
        GROUP BY m.type, m.difficulty
        HAVING COUNT(*) >= 3
        ORDER BY avgScore DESC
        LIMIT 3
      `,

      // Weaknesses (worst performing mission types)
      prisma.$queryRaw`
        SELECT
          m.type,
          m.difficulty,
          AVG(mr.score) as avgScore
        FROM "mission_results" mr
        JOIN "missions" m ON mr."missionId" = m.id
        WHERE mr."playerId" = ${playerId}
        GROUP BY m.type, m.difficulty
        HAVING COUNT(*) >= 3
        ORDER BY avgScore ASC
        LIMIT 3
      `,
    ]);

    const analytics = {
      player: {
        id: player.id,
        username: player.username,
        rank: player.rank,
        email: player.user.email,
        role: player.user.role,
        stats: {
          missionsCompleted: player.missionsCompleted,
          winRate: player.winRate,
          averageScore: player.averageScore,
        },
      },
      performance: {
        missionHistory,
        byDifficulty: performanceByDifficulty,
        byType: performanceByType,
        progressOverTime,
      },
      insights: {
        strengths,
        weaknesses,
      },
    };

    // Cache the result
    await cacheService.set(cacheKey, analytics, this.CACHE_TTL);

    return analytics;
  }

  /**
   * Get trending missions
   */
  async getTrendingMissions(limit: number = 10) {
    const cacheKey = `analytics:trending:${limit}`;

    // Try to get from cache
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    // Get missions with most attempts in last 7 days
    const trending = await prisma.$queryRaw`
      SELECT
        m.id,
        m.title,
        m.difficulty,
        m.type,
        COUNT(mr.id) as attempts,
        AVG(mr.score) as avgScore,
        SUM(CASE WHEN mr."isCompleted" THEN 1 ELSE 0 END) as completions
      FROM "missions" m
      LEFT JOIN "mission_results" mr ON m.id = mr."missionId"
        AND mr."completedAt" >= NOW() - INTERVAL '7 days'
      WHERE m."deletedAt" IS NULL
        AND m.status = 'ACTIVE'
      GROUP BY m.id, m.title, m.difficulty, m.type
      ORDER BY attempts DESC
      LIMIT ${limit}
    `;

    // Cache the result
    await cacheService.set(cacheKey, JSON.stringify(trending), this.CACHE_TTL);

    return trending;
  }
}

export default new AnalyticsService();