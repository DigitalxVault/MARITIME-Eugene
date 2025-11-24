import { PrismaClient, Mission, Prisma, UserRole } from '@prisma/client';
import { CreateMissionInput, UpdateMissionInput, MissionQueryInput } from '../schemas/mission.schema';

const prisma = new PrismaClient();

export class MissionService {
  /**
   * Create a new mission
   */
  async createMission(data: CreateMissionInput, creatorId: string): Promise<Mission> {
    return await prisma.mission.create({
      data: {
        ...data,
        createdBy: creatorId,
      },
    });
  }

  /**
   * Get all missions with pagination and filtering
   */
  async getMissions(query: MissionQueryInput, userRole?: UserRole) {
    const {
      page,
      limit,
      type,
      difficulty,
      status,
      search,
      sortBy,
      sortOrder,
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.MissionWhereInput = {
      deletedAt: null,
      ...(type && { type }),
      ...(difficulty && { difficulty }),
      ...(status && { status }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    // LEARNERS can only see ACTIVE missions
    if (userRole === UserRole.LEARNER) {
      where.status = 'ACTIVE';
    }

    // Get missions with pagination
    const [missions, totalCount] = await Promise.all([
      prisma.mission.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          _count: {
            select: {
              results: true,
            },
          },
        },
      }),
      prisma.mission.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      data: missions,
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
   * Get a single mission by ID
   */
  async getMissionById(id: string, userRole?: UserRole): Promise<Mission | null> {
    const where: Prisma.MissionWhereInput = {
      id,
      deletedAt: null,
    };

    // LEARNERS can only see ACTIVE missions
    if (userRole === UserRole.LEARNER) {
      where.status = 'ACTIVE';
    }

    return await prisma.mission.findFirst({
      where,
      include: {
        results: {
          take: 10,
          orderBy: {
            score: 'desc',
          },
          include: {
            player: {
              select: {
                id: true,
                username: true,
                rank: true,
              },
            },
          },
        },
        _count: {
          select: {
            results: true,
          },
        },
      },
    });
  }

  /**
   * Update a mission
   */
  async updateMission(id: string, data: UpdateMissionInput): Promise<Mission> {
    return await prisma.mission.update({
      where: { id, deletedAt: null },
      data,
    });
  }

  /**
   * Soft delete a mission
   */
  async deleteMission(id: string): Promise<Mission> {
    return await prisma.mission.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Update mission status only
   */
  async updateMissionStatus(id: string, status: string): Promise<Mission> {
    return await prisma.mission.update({
      where: { id, deletedAt: null },
      data: { status: status as any },
    });
  }

  /**
   * Get mission statistics
   */
  async getMissionStats(id: string) {
    const mission = await prisma.mission.findUnique({
      where: { id, deletedAt: null },
      include: {
        _count: {
          select: {
            results: true,
          },
        },
      },
    });

    if (!mission) {
      return null;
    }

    const stats = await prisma.missionResult.aggregate({
      where: { missionId: id },
      _avg: {
        score: true,
        timeSpent: true,
      },
      _max: {
        score: true,
      },
      _min: {
        score: true,
      },
      _count: {
        score: true,
      },
    });

    const successRate = await prisma.missionResult.count({
      where: {
        missionId: id,
        isCompleted: true,
      },
    });

    return {
      mission,
      stats: {
        totalAttempts: stats._count.score || 0,
        averageScore: Math.round(stats._avg.score || 0),
        highestScore: stats._max.score || 0,
        lowestScore: stats._min.score || 0,
        averageTimeSpent: Math.round(stats._avg.timeSpent || 0),
        successRate: stats._count.score > 0
          ? Math.round((successRate / stats._count.score) * 100)
          : 0,
      },
    };
  }

  /**
   * Check if a user can modify a mission
   */
  async canUserModifyMission(userId: string, missionId: string, userRole: UserRole): Promise<boolean> {
    // ADMIN can modify any mission
    if (userRole === UserRole.ADMIN) {
      return true;
    }

    // TRAINER can only modify their own missions
    if (userRole === UserRole.TRAINER) {
      const mission = await prisma.mission.findUnique({
        where: { id: missionId, deletedAt: null },
        select: { createdBy: true },
      });
      return mission?.createdBy === userId;
    }

    // LEARNER cannot modify missions
    return false;
  }
}

export default new MissionService();