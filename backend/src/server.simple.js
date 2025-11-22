const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Redis = require('ioredis');

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

// Middleware
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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
        results: {
          take: 5,
          orderBy: { score: 'desc' },
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
        },
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

// Missions: Create (protected)
app.post('/api/missions', authenticate, async (req, res) => {
  try {
    // Check if user is admin or trainer
    if (!['ADMIN', 'TRAINER'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    const { title, description, difficulty, type, duration, learningObjectives, status } = req.body;

    // Validate required fields
    if (!title || !description || !difficulty || !type || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const mission = await prisma.mission.create({
      data: {
        title,
        description,
        difficulty,
        type,
        duration: Number(duration),
        learningObjectives: learningObjectives || [],
        status: status || 'DRAFT',
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

// Missions: Update (protected)
app.put('/api/missions/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is admin or trainer
    if (!['ADMIN', 'TRAINER'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
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

    // Only admin can edit others' missions, trainers can only edit their own
    if (req.user.role === 'TRAINER' && existingMission.createdBy !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own missions',
      });
    }

    const mission = await prisma.mission.update({
      where: { id },
      data: req.body,
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

// Missions: Delete (protected, admin only)
app.delete('/api/missions/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete missions',
      });
    }

    await prisma.mission.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    // Invalidate missions cache
    await invalidateMissionCache();

    res.json({
      success: true,
      message: 'Mission deleted successfully',
    });
  } catch (error) {
    console.error('Delete mission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete mission',
    });
  }
});

// Players: Get leaderboard
app.get('/api/players/leaderboard', async (_req, res) => {
  try {
    const players = await prisma.playerProfile.findMany({
      orderBy: {
        averageScore: 'desc',
      },
      take: 10,
      include: {
        user: {
          select: {
            email: true,
            role: true,
          }
        }
      }
    });

    res.json({
      success: true,
      data: players,
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard',
    });
  }
});

// Players: Get all (protected, admin/trainer only)
app.get('/api/players', authenticate, async (req, res) => {
  try {
    if (!['ADMIN', 'TRAINER'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    const players = await prisma.playerProfile.findMany({
      include: {
        user: {
          select: {
            email: true,
            role: true,
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

// Analytics: Overview
app.get('/api/analytics/overview', async (_req, res) => {
  try {
    const [totalMissions, totalPlayers, activeMissions, completedResults] = await Promise.all([
      prisma.mission.count({ where: { deletedAt: null } }),
      prisma.playerProfile.count(),
      prisma.mission.count({ where: { status: 'ACTIVE', deletedAt: null } }),
      prisma.missionResult.count({ where: { isCompleted: true } }),
    ]);

    res.json({
      success: true,
      data: {
        totalMissions,
        totalPlayers,
        activeMissions,
        completedResults,
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