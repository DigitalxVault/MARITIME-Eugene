const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Redis = require('ioredis');
const { z } = require('zod');

// Load environment variables
dotenv.config();

// Initialize Prisma
const prisma = new PrismaClient();

// Initialize Redis
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

redis.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

// Create Express app
const app = express();
const PORT = process.env.PORT || 4000;

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

// Zod Validation Schemas
// NOTE: Schema matches current Prisma schema (duration, learningObjectives)
// TODO: Update Prisma schema to match PRD requirements (estimatedDuration, objectives, location, maxScore)
const createMissionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be at most 200 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(['PVE', 'PVP']), // Fixed: Match Prisma schema MissionType enum
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']), // Fixed: Match Prisma schema MissionDifficulty enum
  learningObjectives: z.array(z.string()).min(1, 'At least one learning objective is required').optional().default([]),
  duration: z.number().int().positive('Duration must be a positive integer'),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).default('DRAFT').optional(),
});

const updateMissionSchema = createMissionSchema.partial();

// TODO: Add feedback field to MissionResult schema in Prisma
const submitResultSchema = z.object({
  playerId: z.string().uuid('Invalid player ID'),
  score: z.number().nonnegative('Score must be non-negative'), // Float, not int
  timeSpent: z.number().int().nonnegative('Time spent must be non-negative'),
  achievements: z.array(z.string()).default([]),
});

const bulkGradeSchema = z.object({
  results: z.array(z.object({
    playerId: z.string().uuid('Invalid player ID'),
    score: z.number().nonnegative('Score must be non-negative'),
    timeSpent: z.number().int().nonnegative('Time spent must be non-negative'),
    achievements: z.array(z.string()).default([]),
  })).min(1, 'At least one result is required'),
});

const updateResultSchema = z.object({
  score: z.number().nonnegative('Score must be non-negative').optional(),
  achievements: z.array(z.string()).optional(),
});

const bulkStatusUpdateSchema = z.object({
  missionIds: z.array(z.string().uuid()).min(1, 'At least one mission ID is required'),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']),
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'file://'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(cookieParser());

// Helper function to create JWT
function createToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// Auth middleware
function authenticate(req, res, next) {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

// Authorization middleware (role-based)
function authorize(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    next();
  };
}

// Helper function to invalidate mission cache
async function invalidateMissionCache() {
  try {
    const keys = await redis.keys('missions:*');
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`🗑️  Invalidated ${keys.length} mission cache keys`);
    }
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
}

// Health check
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Mission Control Backend (Simple JS) is running',
    timestamp: new Date().toISOString(),
  });
});

// Auth: Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        playerProfile: true,
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Create token
    const token = createToken(user);

    // Set cookie
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.playerProfile?.username || user.email.split('@')[0], // Use playerProfile username or email prefix
          role: user.role,
          playerProfile: user.playerProfile,
        },
        accessToken: token,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Auth: Logout
app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie('accessToken');
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// Auth: Get current user
app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        playerProfile: true,
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.playerProfile?.username || user.email.split('@')[0], // Use playerProfile username or email prefix
        role: user.role,
        playerProfile: user.playerProfile,
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
    });
  }
});

// Missions: Get all (with Redis caching)
app.get('/api/missions', async (req, res) => {
  try {
    const { status, difficulty, type, page = 1, limit = 10 } = req.query;

    // Create cache key from query parameters
    const cacheKey = `missions:${status || 'all'}:${difficulty || 'all'}:${type || 'all'}:page${page}:limit${limit}`;

    // Try to get from cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log('✅ Cache HIT for:', cacheKey);
      return res.json(JSON.parse(cached));
    }

    console.log('❌ Cache MISS for:', cacheKey);

    const where = {
      deletedAt: null,
    };

    if (status) where.status = status;
    if (difficulty) where.difficulty = difficulty;
    if (type) where.type = type;

    const skip = (Number(page) - 1) * Number(limit);

    const [missions, total] = await Promise.all([
      prisma.mission.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.mission.count({ where }),
    ]);

    const response = {
      success: true,
      data: missions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      }
    };

    // Cache for 5 minutes (300 seconds)
    await redis.setex(cacheKey, 300, JSON.stringify(response));

    res.json(response);
  } catch (error) {
    console.error('Get missions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch missions',
    });
  }
});

// Missions: Get single
app.get('/api/missions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const mission = await prisma.mission.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            results: true,
          }
        }
      }
    });

    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Mission not found',
      });
    }

    res.json({
      success: true,
      data: mission,
    });
  } catch (error) {
    console.error('Get mission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mission',
    });
  }
});

// Missions: Create (ADMIN only with Zod validation)
app.post('/api/missions', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    // Validate request body with Zod
    const validationResult = createMissionSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    const data = validationResult.data;

    const mission = await prisma.mission.create({
      data: {
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        type: data.type,
        learningObjectives: data.learningObjectives || [],
        duration: data.duration,
        status: data.status || 'DRAFT',
        createdBy: req.user.userId,
      },
    });

    // Invalidate missions cache
    await invalidateMissionCache();

    res.status(201).json({
      success: true,
      data: mission,
      message: 'Mission created successfully',
    });
  } catch (error) {
    console.error('Create mission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create mission',
    });
  }
});

// Missions: Update (ADMIN only with Zod validation)
app.put('/api/missions/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    // Validate request body with Zod (partial schema - all fields optional)
    const validationResult = updateMissionSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    // Check if mission exists
    const existingMission = await prisma.mission.findUnique({
      where: { id }
    });

    if (!existingMission) {
      return res.status(404).json({
        success: false,
        message: 'Mission not found',
      });
    }

    const data = validationResult.data;

    const mission = await prisma.mission.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.difficulty && { difficulty: data.difficulty }),
        ...(data.type && { type: data.type }),
        ...(data.learningObjectives && { learningObjectives: data.learningObjectives }),
        ...(data.duration && { duration: data.duration }),
        ...(data.status && { status: data.status }),
      },
    });

    // Invalidate missions cache
    await invalidateMissionCache();

    res.json({
      success: true,
      data: mission,
      message: 'Mission updated successfully',
    });
  } catch (error) {
    console.error('Update mission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update mission',
    });
  }
});

// Missions: Delete (ADMIN only, soft/hard delete)
app.delete('/api/missions/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { hard } = req.query;

    // Check if mission exists
    const existingMission = await prisma.mission.findUnique({
      where: { id }
    });

    if (!existingMission) {
      return res.status(404).json({
        success: false,
        message: 'Mission not found',
      });
    }

    if (hard === 'true') {
      // Hard delete - permanently remove from database
      await prisma.mission.delete({
        where: { id },
      });
    } else {
      // Soft delete - set deletedAt timestamp
      await prisma.mission.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });
    }

    // Invalidate missions cache
    await invalidateMissionCache();

    res.json({
      success: true,
      message: hard === 'true' ? 'Mission permanently deleted' : 'Mission deleted successfully',
    });
  } catch (error) {
    console.error('Delete mission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete mission',
    });
  }
});

// Missions: Update status only (protected, admin/trainer)
app.patch('/api/missions/:id/status', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if user is admin or trainer
    if (!['ADMIN', 'TRAINER'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    // Validate status value
    const validStatuses = ['DRAFT', 'ACTIVE', 'ARCHIVED'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: DRAFT, ACTIVE, ARCHIVED',
      });
    }

    // Check if mission exists
    const existingMission = await prisma.mission.findUnique({
      where: { id }
    });

    if (!existingMission) {
      return res.status(404).json({
        success: false,
        message: 'Mission not found',
      });
    }

    // Only admin can change status of others' missions, trainers can only change their own
    if (req.user.role === 'TRAINER' && existingMission.createdBy !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only change status of your own missions',
      });
    }

    const mission = await prisma.mission.update({
      where: { id },
      data: { status },
    });

    // Invalidate missions cache
    await invalidateMissionCache();

    res.json({
      success: true,
      data: mission,
      message: `Mission status updated to ${status}`,
    });
  } catch (error) {
    console.error('Update mission status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update mission status',
    });
  }
});

// Missions: Bulk status update (ADMIN only)
app.patch('/api/missions/bulk/status', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    // Validate request body with Zod
    const validationResult = bulkStatusUpdateSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    const { missionIds, status } = validationResult.data;

    // Update multiple missions at once
    const result = await prisma.mission.updateMany({
      where: {
        id: { in: missionIds },
        deletedAt: null,
      },
      data: {
        status,
      },
    });

    // Invalidate missions cache
    await invalidateMissionCache();

    res.json({
      success: true,
      data: {
        updatedCount: result.count,
        status,
      },
      message: `${result.count} mission(s) updated to ${status}`,
    });
  } catch (error) {
    console.error('Bulk status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update missions',
    });
  }
});

// Mission Results: Submit result (with atomic transaction & player stats update)
app.post('/api/missions/:missionId/results', authenticate, async (req, res) => {
  try {
    const { missionId } = req.params;

    // Validate request body with Zod
    const validationResult = submitResultSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    const { playerId, score, timeSpent, achievements } = validationResult.data;

    // Check permissions: any role can submit for themselves, ADMIN/TRAINER can submit for others
    const canSubmitForOthers = ['ADMIN', 'TRAINER'].includes(req.user.role);

    // Get player's user ID to check if it's the current user
    const player = await prisma.playerProfile.findUnique({
      where: { id: playerId },
      include: { user: true },
    });

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found',
      });
    }

    if (!canSubmitForOthers && player.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only submit results for yourself',
      });
    }

    // Check if mission exists and is ACTIVE
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
    });

    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Mission not found',
      });
    }

    if (mission.status !== 'ACTIVE') {
      return res.status(400).json({
        success: false,
        message: 'Mission must be ACTIVE to submit results',
      });
    }

    // Validate score against maxScore (fixed at 100 until schema updated)
    const MAX_SCORE = 100;
    if (score > MAX_SCORE) {
      return res.status(400).json({
        success: false,
        message: `Score cannot exceed max score of ${MAX_SCORE}`,
      });
    }

    // Check for duplicate submission
    const existingResult = await prisma.missionResult.findFirst({
      where: {
        missionId,
        playerId,
      },
    });

    if (existingResult) {
      return res.status(409).json({
        success: false,
        message: 'Player has already completed this mission',
      });
    }

    // Use atomic transaction to create result and update player stats
    const result = await prisma.$transaction(async (tx) => {
      // 60% pass threshold (using MAX_SCORE = 100)
      const MAX_SCORE = 100;
      const passThreshold = MAX_SCORE * 0.6;
      const isCompleted = score >= passThreshold;

      // Create mission result
      const newResult = await tx.missionResult.create({
        data: {
          missionId,
          playerId,
          score,
          timeSpent,
          achievements,
          isCompleted,
          completedAt: isCompleted ? new Date() : null,
        },
        include: {
          mission: true,
          player: {
            include: {
              user: {
                select: {
                  email: true,
                  role: true,
                }
              }
            }
          }
        }
      });

      // Recalculate player stats based on all completed results
      const allResults = await tx.missionResult.findMany({
        where: {
          playerId,
          isCompleted: true
        },
      });

      const totalScore = allResults.reduce((sum, r) => sum + r.score, 0);
      const avgScore = allResults.length > 0 ? totalScore / allResults.length : 0;
      const totalTime = allResults.reduce((sum, r) => sum + r.timeSpent, 0);

      // Update player profile stats
      await tx.playerProfile.update({
        where: { id: playerId },
        data: {
          totalScore,
          missionsCompleted: allResults.length,
          averageScore: Math.round(avgScore * 10) / 10,
          totalTimeSpent: totalTime,
        },
      });

      return newResult;
    });

    res.status(201).json({
      success: true,
      data: result,
      message: result.isCompleted
        ? 'Result submitted and mission completed successfully'
        : 'Result submitted (below pass threshold)',
    });
  } catch (error) {
    console.error('Submit result error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit result',
    });
  }
});

// Mission Results: Bulk grade results (ADMIN, TRAINER only)
app.post('/api/missions/:missionId/results/bulk', authenticate, authorize(['ADMIN', 'TRAINER']), async (req, res) => {
  try {
    const { missionId } = req.params;

    // Validate request body with Zod
    const validationResult = bulkGradeSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    const { results } = validationResult.data;

    // Check if mission exists
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
    });

    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Mission not found',
      });
    }

    // For TRAINER, verify they have access to all players in the bulk operation
    if (req.user.role === 'TRAINER') {
      const assignments = await prisma.trainerAssignment.findMany({
        where: { trainerId: req.user.userId },
        select: { playerId: true },
      });
      const assignedPlayerIds = new Set(assignments.map(a => a.playerId));

      const unauthorizedPlayers = results.filter(r => !assignedPlayerIds.has(r.playerId));
      if (unauthorizedPlayers.length > 0) {
        return res.status(403).json({
          success: false,
          message: 'You can only grade your assigned players',
        });
      }
    }

    // Use transaction to create all results atomically
    const createdResults = await prisma.$transaction(async (tx) => {
      const MAX_SCORE = 100;
      const passThreshold = MAX_SCORE * 0.6;
      const newResults = [];

      for (const resultData of results) {
        // Verify player exists
        const player = await tx.playerProfile.findUnique({
          where: { id: resultData.playerId },
        });

        if (!player) {
          throw new Error(`Player ${resultData.playerId} not found`);
        }

        // Validate score
        if (resultData.score > MAX_SCORE) {
          throw new Error(`Score ${resultData.score} exceeds max score ${MAX_SCORE} for player ${resultData.playerId}`);
        }

        // Check for duplicate
        const existing = await tx.missionResult.findFirst({
          where: {
            missionId,
            playerId: resultData.playerId,
          },
        });

        if (existing) {
          throw new Error(`Player ${resultData.playerId} has already completed this mission`);
        }

        const isCompleted = resultData.score >= passThreshold;

        // Create result
        const newResult = await tx.missionResult.create({
          data: {
            missionId,
            playerId: resultData.playerId,
            score: resultData.score,
            timeSpent: resultData.timeSpent,
            achievements: resultData.achievements,
            isCompleted,
            completedAt: isCompleted ? new Date() : null,
          },
        });

        newResults.push(newResult);

        // Update player stats
        const allResults = await tx.missionResult.findMany({
          where: {
            playerId: resultData.playerId,
            isCompleted: true
          },
        });

        const totalScore = allResults.reduce((sum, r) => sum + r.score, 0);
        const avgScore = allResults.length > 0 ? totalScore / allResults.length : 0;
        const totalTime = allResults.reduce((sum, r) => sum + r.timeSpent, 0);

        await tx.playerProfile.update({
          where: { id: resultData.playerId },
          data: {
            totalScore,
            missionsCompleted: allResults.length,
            averageScore: Math.round(avgScore * 10) / 10,
            totalTimeSpent: totalTime,
          },
        });
      }

      return newResults;
    });

    res.status(201).json({
      success: true,
      data: createdResults,
      count: createdResults.length,
      message: `${createdResults.length} results submitted successfully`,
    });
  } catch (error) {
    console.error('Bulk grade error:', error);

    // Check if it's a validation error from transaction
    if (error.message.includes('not found') || error.message.includes('exceeds') || error.message.includes('already completed')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to submit bulk results',
    });
  }
});

// Mission Results: Update result (ADMIN, TRAINER only)
app.patch('/api/results/:resultId', authenticate, authorize(['ADMIN', 'TRAINER']), async (req, res) => {
  try {
    const { resultId } = req.params;

    // Validate request body with Zod
    const validationResult = updateResultSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    // Get existing result
    const existingResult = await prisma.missionResult.findUnique({
      where: { id: resultId },
      include: {
        mission: true,
        player: true,
      },
    });

    if (!existingResult) {
      return res.status(404).json({
        success: false,
        message: 'Result not found',
      });
    }

    // For TRAINER, verify they have access to this player
    if (req.user.role === 'TRAINER') {
      const assignment = await prisma.trainerAssignment.findUnique({
        where: {
          trainerId_playerId: {
            trainerId: req.user.userId,
            playerId: existingResult.playerId,
          },
        },
      });

      if (!assignment) {
        return res.status(403).json({
          success: false,
          message: 'You can only update results for your assigned players',
        });
      }
    }

    const { score, achievements } = validationResult.data;

    // If score is being updated, validate and recalculate stats
    if (score !== undefined) {
      const MAX_SCORE = 100;
      if (score > MAX_SCORE) {
        return res.status(400).json({
          success: false,
          message: `Score cannot exceed max score of ${MAX_SCORE}`,
        });
      }
    }

    // Use transaction if score changes (need to recalculate player stats)
    const updatedResult = await prisma.$transaction(async (tx) => {
      const MAX_SCORE = 100;
      const passThreshold = MAX_SCORE * 0.6;
      const newScore = score !== undefined ? score : existingResult.score;
      const newIsCompleted = newScore >= passThreshold;

      // Update result
      const result = await tx.missionResult.update({
        where: { id: resultId },
        data: {
          ...(score !== undefined && { score }),
          ...(achievements !== undefined && { achievements }),
          isCompleted: newIsCompleted,
          completedAt: newIsCompleted ? (existingResult.completedAt || new Date()) : null,
        },
        include: {
          mission: true,
          player: {
            include: {
              user: {
                select: {
                  email: true,
                  role: true,
                }
              }
            }
          }
        }
      });

      // If score changed, recalculate player stats
      if (score !== undefined) {
        const allResults = await tx.missionResult.findMany({
          where: {
            playerId: existingResult.playerId,
            isCompleted: true
          },
        });

        const totalScore = allResults.reduce((sum, r) => sum + r.score, 0);
        const avgScore = allResults.length > 0 ? totalScore / allResults.length : 0;
        const totalTime = allResults.reduce((sum, r) => sum + r.timeSpent, 0);

        await tx.playerProfile.update({
          where: { id: existingResult.playerId },
          data: {
            totalScore,
            missionsCompleted: allResults.length,
            averageScore: Math.round(avgScore * 10) / 10,
            totalTimeSpent: totalTime,
          },
        });
      }

      return result;
    });

    res.json({
      success: true,
      data: updatedResult,
      message: 'Result updated successfully',
    });
  } catch (error) {
    console.error('Update result error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update result',
    });
  }
});

// Mission Results: Get results for a mission (RBAC enforced)
app.get('/api/missions/:missionId/results', authenticate, async (req, res) => {
  try {
    const { missionId } = req.params;
    const { limit = 20, offset = 0, sortBy = 'score', order = 'desc' } = req.query;

    // Check if mission exists
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
    });

    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Mission not found',
      });
    }

    // Build where clause based on role
    let whereClause = { missionId };

    if (req.user.role === 'LEARNER') {
      // LEARNER sees only their own results
      const playerProfile = await prisma.playerProfile.findUnique({
        where: { userId: req.user.userId },
      });

      if (!playerProfile) {
        return res.status(404).json({
          success: false,
          message: 'Player profile not found',
        });
      }

      whereClause.playerId = playerProfile.id;
    } else if (req.user.role === 'TRAINER') {
      // TRAINER sees results for assigned players only
      const assignments = await prisma.trainerAssignment.findMany({
        where: { trainerId: req.user.userId },
        select: { playerId: true },
      });

      const assignedPlayerIds = assignments.map(a => a.playerId);
      whereClause.playerId = { in: assignedPlayerIds };
    }
    // ADMIN sees all results (no additional filter)

    // Validate sortBy field
    const validSortFields = ['score', 'timeSpent', 'completedAt', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'score';

    // Validate order
    const sortOrder = order === 'asc' ? 'asc' : 'desc';

    const [results, total] = await Promise.all([
      prisma.missionResult.findMany({
        where: whereClause,
        skip: Number(offset),
        take: Number(limit),
        orderBy: { [sortField]: sortOrder },
        include: {
          player: {
            include: {
              user: {
                select: {
                  email: true,
                  role: true,
                }
              }
            }
          }
        }
      }),
      prisma.missionResult.count({ where: whereClause }),
    ]);

    res.json({
      success: true,
      data: results,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + results.length < total,
      },
    });
  } catch (error) {
    console.error('Get mission results error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mission results',
    });
  }
});

// Leaderboard: Get rankings with filters
app.get('/api/leaderboard', async (req, res) => {
  try {
    const { period = 'all-time', metric = 'score', limit = 50 } = req.query;

    // Calculate date filter based on period
    let dateFilter = {};
    if (period === 'weekly') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { completedAt: { gte: weekAgo } };
    } else if (period === 'monthly') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { completedAt: { gte: monthAgo } };
    }

    // Get all players with their results
    const players = await prisma.playerProfile.findMany({
      include: {
        user: {
          select: {
            email: true,
          }
        },
        missionResults: {
          where: dateFilter,
          select: {
            score: true,
            isCompleted: true,
            timeSpent: true,
          }
        }
      }
    });

    // Calculate rankings based on metric
    const rankings = players.map(player => {
      const completedResults = player.missionResults.filter(r => r.isCompleted);
      const totalScore = completedResults.reduce((sum, r) => sum + r.score, 0);
      const avgScore = completedResults.length > 0 ? totalScore / completedResults.length : 0;
      const completions = completedResults.length;

      return {
        playerId: player.id,
        username: player.username,
        rank: player.rank,
        score: Math.round(totalScore),
        averageScore: Math.round(avgScore * 10) / 10,
        completions,
        totalTimeSpent: player.totalTimeSpent,
      };
    });

    // Sort by selected metric
    rankings.sort((a, b) => {
      if (metric === 'completions') return b.completions - a.completions;
      if (metric === 'averageScore') return b.averageScore - a.averageScore;
      return b.score - a.score; // default: total score
    });

    // Add rank numbers and limit
    const rankedList = rankings.slice(0, parseInt(limit)).map((player, index) => ({
      ...player,
      position: index + 1,
    }));

    res.json({
      success: true,
      data: {
        rankings: rankedList,
        period,
        metric,
        totalPlayers: players.length,
      }
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard',
    });
  }
});

// Leaderboard: Get current user's rank
app.get('/api/leaderboard/me', authenticate, async (req, res) => {
  try {
    const { userId } = req.user;

    // Get user's player profile
    const playerProfile = await prisma.playerProfile.findUnique({
      where: { userId },
      include: {
        missionResults: {
          where: { isCompleted: true },
          select: { score: true }
        }
      }
    });

    if (!playerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Player profile not found',
      });
    }

    const totalScore = playerProfile.missionResults.reduce((sum, r) => sum + r.score, 0);

    // Get all players' scores for ranking
    const allPlayers = await prisma.playerProfile.findMany({
      include: {
        missionResults: {
          where: { isCompleted: true },
          select: { score: true }
        }
      }
    });

    const scores = allPlayers.map(p => ({
      playerId: p.id,
      score: p.missionResults.reduce((sum, r) => sum + r.score, 0)
    })).sort((a, b) => b.score - a.score);

    const myRank = scores.findIndex(s => s.playerId === playerProfile.id) + 1;
    const percentile = Math.round((1 - (myRank / scores.length)) * 100);

    res.json({
      success: true,
      data: {
        rank: myRank,
        totalScore,
        percentile,
        totalPlayers: scores.length,
        username: playerProfile.username,
      }
    });
  } catch (error) {
    console.error('My rank error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rank',
    });
  }
});

// Players: Get all (protected, role-based filtering)
app.get('/api/players', authenticate, async (req, res) => {
  try {
    const { role, userId } = req.user;
    let whereClause = {};

    // TRAINERS see only assigned players
    if (role === 'TRAINER') {
      const assignments = await prisma.trainerAssignment.findMany({
        where: { trainerId: userId },
        select: { playerId: true }
      });
      const assignedPlayerIds = assignments.map(a => a.playerId);
      whereClause = { id: { in: assignedPlayerIds } };
    }

    // LEARNERS see only themselves
    if (role === 'LEARNER') {
      whereClause = { userId };
    }

    // ADMIN sees all (no where clause)

    const players = await prisma.playerProfile.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            email: true,
            role: true,
            createdAt: true,
          }
        },
        missionResults: {
          select: {
            score: true,
            isCompleted: true,
            timeSpent: true,
            completedAt: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    res.json({
      success: true,
      data: players,
    });
  } catch (error) {
    console.error('Get players error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch players',
    });
  }
});

// Trainer Assignments: Assign player to trainer (ADMIN only)
app.post('/api/players/:playerId/assign', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const { playerId } = req.params;
    const { trainerId } = req.body;

    if (!trainerId) {
      return res.status(400).json({
        success: false,
        message: 'Trainer ID is required',
      });
    }

    // Verify trainer exists and has TRAINER role
    const trainer = await prisma.user.findUnique({
      where: { id: trainerId }
    });

    if (!trainer || trainer.role !== 'TRAINER') {
      return res.status(400).json({
        success: false,
        message: 'Invalid trainer ID',
      });
    }

    // Verify player exists
    const player = await prisma.playerProfile.findUnique({
      where: { id: playerId }
    });

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found',
      });
    }

    // Check if assignment already exists
    const existingAssignment = await prisma.trainerAssignment.findUnique({
      where: {
        trainerId_playerId: {
          trainerId,
          playerId,
        }
      }
    });

    if (existingAssignment) {
      return res.status(400).json({
        success: false,
        message: 'This player is already assigned to this trainer',
      });
    }

    const assignment = await prisma.trainerAssignment.create({
      data: {
        trainerId,
        playerId,
        assignedBy: req.user.userId,
      },
      include: {
        trainer: {
          select: {
            email: true,
            role: true,
          }
        },
        player: {
          include: {
            user: {
              select: {
                email: true,
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: assignment,
      message: 'Player assigned successfully',
    });
  } catch (error) {
    console.error('Assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign player',
    });
  }
});

// Trainer Assignments: Remove assignment (ADMIN only)
app.delete('/api/players/:playerId/assign/:trainerId', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const { playerId, trainerId } = req.params;

    const deleted = await prisma.trainerAssignment.deleteMany({
      where: {
        trainerId,
        playerId,
      }
    });

    if (deleted.count === 0) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    res.json({
      success: true,
      message: 'Assignment removed successfully',
    });
  } catch (error) {
    console.error('Remove assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove assignment',
    });
  }
});

// Trainer Assignments: Get trainer's assigned players
app.get('/api/trainers/:trainerId/players', authenticate, async (req, res) => {
  try {
    const { trainerId } = req.params;
    const { role, userId } = req.user;

    // Trainers can only view their own assignments, admins can view any
    if (role === 'TRAINER' && trainerId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own assigned players',
      });
    }

    const assignments = await prisma.trainerAssignment.findMany({
      where: { trainerId },
      include: {
        player: {
          include: {
            user: {
              select: {
                email: true,
                role: true,
                createdAt: true,
              }
            },
            missionResults: {
              select: {
                score: true,
                isCompleted: true,
                timeSpent: true,
                completedAt: true,
              }
            }
          }
        }
      },
      orderBy: {
        assignedAt: 'desc',
      }
    });

    const players = assignments.map(a => ({
      ...a.player,
      assignedAt: a.assignedAt,
    }));

    res.json({
      success: true,
      data: players,
      count: players.length,
    });
  } catch (error) {
    console.error('Get assigned players error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assigned players',
    });
  }
});

// Analytics: Enhanced Overview
app.get('/api/analytics/overview', async (_req, res) => {
  try {
    // Basic metrics
    const [totalMissions, totalPlayers, activeMissions, totalCompletions] = await Promise.all([
      prisma.mission.count({ where: { deletedAt: null } }),
      prisma.playerProfile.count(),
      prisma.mission.count({ where: { status: 'ACTIVE', deletedAt: null } }),
      prisma.missionResult.count({ where: { isCompleted: true } }),
    ]);

    // Calculate completion rate (percentage of completed missions vs total active missions)
    const completionRate = activeMissions > 0
      ? Math.round((totalCompletions / (activeMissions * totalPlayers || 1)) * 100)
      : 0;

    // For active players, count players with at least one recent result (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activePlayers = await prisma.playerProfile.count({
      where: {
        missionResults: {
          some: {
            createdAt: {
              gte: thirtyDaysAgo,
            }
          }
        }
      }
    });

    // Top performers (top 5 players by total score)
    const topPerformers = await prisma.playerProfile.findMany({
      take: 5,
      orderBy: {
        totalScore: 'desc',
      },
      include: {
        user: {
          select: {
            email: true,
          }
        }
      }
    });

    // Recent completions (last 10 results)
    const recentCompletions = await prisma.missionResult.findMany({
      where: {
        isCompleted: true,
      },
      take: 10,
      orderBy: {
        completedAt: 'desc',
      },
      include: {
        mission: {
          select: {
            title: true,
            difficulty: true,
          }
        },
        player: {
          select: {
            username: true,
          }
        }
      }
    });

    // Mission completion rates by difficulty
    const missionsByDifficulty = await prisma.mission.groupBy({
      by: ['difficulty'],
      where: {
        deletedAt: null,
      },
      _count: {
        id: true,
      },
    });

    // Get completion rates for each difficulty
    const completionRatesByDifficulty = await Promise.all(
      missionsByDifficulty.map(async (group) => {
        const completedCount = await prisma.missionResult.count({
          where: {
            isCompleted: true,
            mission: {
              difficulty: group.difficulty,
            }
          }
        });

        return {
          difficulty: group.difficulty,
          count: group._count.id, // Changed from totalMissions to count for chart compatibility
          completedCount,
          completionRate: group._count.id > 0
            ? Math.round((completedCount / (group._count.id * totalPlayers || 1)) * 100)
            : 0,
        };
      })
    );

    // Mission counts by type (for "Missions by Type" chart)
    const missionTypes = ['NAVIGATION', 'COMBAT', 'RESCUE', 'PATROL'];
    const missionsByType = await Promise.all(
      missionTypes.map(async (type) => {
        const count = await prisma.mission.count({
          where: {
            type,
            deletedAt: null,
          }
        });

        return {
          type,
          count, // Chart expects this format
        };
      })
    );

    res.json({
      success: true,
      data: {
        metrics: {
          totalMissions,
          activeMissions,
          totalPlayers,
          activePlayers,
          totalCompletions,
          completionRate,
        },
        topPerformers: topPerformers.map(p => ({
          id: p.id,
          username: p.username,
          email: p.user.email,
          totalScore: p.totalScore,
          missionsCompleted: p.missionsCompleted,
          averageScore: p.averageScore,
        })),
        recentCompletions: recentCompletions.map(c => ({
          id: c.id,
          playerUsername: c.player.username,
          missionTitle: c.mission.title,
          difficulty: c.mission.difficulty,
          score: c.score,
          completedAt: c.completedAt,
        })),
        distributions: {
          missionsByDifficulty: completionRatesByDifficulty,
          missionsByType, // Changed from averageScoresByType to match frontend expectations
        }
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
    });
  }
});

// Activity: Get recent activities (polling-based for real-time feed)
app.get('/api/activity/recent', async (req, res) => {
  try {
    const { limit = 20, since } = req.query;

    // Build where clause for filtering by timestamp
    const where = {
      deletedAt: null,
    };

    // If 'since' timestamp provided, only return activities after that time
    if (since) {
      where.updatedAt = {
        gt: new Date(since),
      };
    }

    // Get recently updated missions as activity feed
    const recentMissions = await prisma.mission.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      take: Number(limit),
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
        createdAt: true,
      },
    });

    // Format activities with action type based on timestamps
    const activities = recentMissions.map(mission => {
      const isNew = new Date(mission.updatedAt).getTime() === new Date(mission.createdAt).getTime();
      return {
        id: mission.id,
        type: isNew ? 'MISSION_CREATED' : 'MISSION_UPDATED',
        title: mission.title,
        status: mission.status,
        timestamp: mission.updatedAt,
        message: isNew
          ? `New mission "${mission.title}" created`
          : `Mission "${mission.title}" updated to ${mission.status}`,
      };
    });

    res.json({
      success: true,
      data: activities,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activities',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mission Control Backend (Simplified JS) running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Login: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`📋 Missions: GET http://localhost:${PORT}/api/missions`);
  console.log('\n✅ Backend is ready for Phase 4 development!\n');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});