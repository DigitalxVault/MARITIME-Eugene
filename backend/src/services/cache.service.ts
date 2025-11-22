import Redis from 'ioredis';

class CacheService {
  private redis: Redis;
  private isConnected: boolean = false;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    this.redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      reconnectOnError(err) {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          return true;
        }
        return false;
      },
    });

    this.redis.on('connect', () => {
      console.log('✅ Redis connected successfully');
      this.isConnected = true;
    });

    this.redis.on('error', (error) => {
      console.error('❌ Redis connection error:', error.message);
      this.isConnected = false;
    });

    this.redis.on('close', () => {
      console.log('⚠️  Redis connection closed');
      this.isConnected = false;
    });
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      if (!this.isConnected) {
        return null;
      }

      const value = await this.redis.get(key);
      if (!value) {
        return null;
      }

      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache with optional TTL (in seconds)
   */
  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return false;
      }

      const serialized = JSON.stringify(value);

      if (ttl) {
        await this.redis.setex(key, ttl, serialized);
      } else {
        await this.redis.set(key, serialized);
      }

      return true;
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete value from cache
   */
  async del(key: string): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return false;
      }

      await this.redis.del(key);
      return true;
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete multiple keys matching pattern
   */
  async delPattern(pattern: string): Promise<number> {
    try {
      if (!this.isConnected) {
        return 0;
      }

      const keys = await this.redis.keys(pattern);
      if (keys.length === 0) {
        return 0;
      }

      await this.redis.del(...keys);
      return keys.length;
    } catch (error) {
      console.error(`Cache delete pattern error for ${pattern}:`, error);
      return 0;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return false;
      }

      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Set TTL for existing key
   */
  async expire(key: string, ttl: number): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return false;
      }

      await this.redis.expire(key, ttl);
      return true;
    } catch (error) {
      console.error(`Cache expire error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Increment value
   */
  async incr(key: string): Promise<number> {
    try {
      if (!this.isConnected) {
        return 0;
      }

      return await this.redis.incr(key);
    } catch (error) {
      console.error(`Cache incr error for key ${key}:`, error);
      return 0;
    }
  }

  /**
   * Close connection
   */
  async disconnect(): Promise<void> {
    await this.redis.quit();
  }
}

export const cacheService = new CacheService();

// Common cache key patterns
export const CacheKeys = {
  activeMissions: 'missions:active',
  missionById: (id: string) => `mission:${id}`,
  userSession: (userId: string) => `session:user:${userId}`,
  playerStats: (playerId: string) => `player:${playerId}:stats`,
  analyticsOverview: 'analytics:dashboard',
};

// Common TTL values (in seconds)
export const CacheTTL = {
  SHORT: 60,           // 1 minute
  MEDIUM: 300,         // 5 minutes
  LONG: 1800,          // 30 minutes
  SESSION: 86400,      // 24 hours
};
