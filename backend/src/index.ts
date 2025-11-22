import dotenv from 'dotenv';
import { createApp } from './app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { cacheService } from './services/cache.service';

// Load environment variables
dotenv.config();

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT || '4000');
const NODE_ENV = process.env.NODE_ENV || 'development';

async function startServer() {
  try {
    console.log('🚀 Starting Mission Control Backend...');
    console.log(`📍 Environment: ${NODE_ENV}`);

    // Connect to database
    await connectDatabase();

    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
      console.log('');
      console.log('🎯 Ready to accept requests!');
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        console.log('✅ HTTP server closed');

        // Close database connection
        await disconnectDatabase();

        // Close Redis connection
        await cacheService.disconnect();
        console.log('✅ Redis disconnected');

        console.log('✅ Graceful shutdown complete');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('⚠️  Forceful shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('unhandledRejection');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
