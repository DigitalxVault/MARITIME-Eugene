/**
 * Seed Script: Add Diverse Demo Players
 * Adds Eugene Tan, Trinity, and Servina with varied stats for leaderboard diversity
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting diverse players seed...\n');

  // Hash password for all demo users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Define diverse players with varied stats
  const diversePlayers = [
    {
      email: 'eugene.tan@example.com',
      username: 'Eugene Tan',
      password: hashedPassword,
      role: 'LEARNER',
      profile: {
        rank: 'Admiral',
        winRate: 0.875,
        totalScore: 2590,
        averageScore: 92.5,
        missionsCompleted: 28,
        totalTimeSpent: 4800,
      }
    },
    {
      email: 'trinity@example.com',
      username: 'Trinity',
      password: hashedPassword,
      role: 'LEARNER',
      profile: {
        rank: 'Captain',
        winRate: 0.88,
        totalScore: 1942,
        averageScore: 88.3,
        missionsCompleted: 22,
        totalTimeSpent: 3600,
      }
    },
    {
      email: 'servina@example.com',
      username: 'Servina',
      password: hashedPassword,
      role: 'LEARNER',
      profile: {
        rank: 'Fleet Admiral',
        winRate: 0.921,
        totalScore: 3353,
        averageScore: 95.8,
        missionsCompleted: 35,
        totalTimeSpent: 6200,
      }
    },
  ];

  // Create users and profiles
  for (const playerData of diversePlayers) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: playerData.email },
      });

      if (existingUser) {
        console.log(`⏭️  User ${playerData.username} already exists, skipping...`);
        continue;
      }

      // Create user with profile
      const user = await prisma.user.create({
        data: {
          email: playerData.email,
          password: playerData.password,
          role: playerData.role,
          playerProfile: {
            create: {
              username: playerData.username,
              rank: playerData.profile.rank,
              winRate: playerData.profile.winRate,
              totalScore: playerData.profile.totalScore,
              averageScore: playerData.profile.averageScore,
              missionsCompleted: playerData.profile.missionsCompleted,
              totalTimeSpent: playerData.profile.totalTimeSpent,
            },
          },
        },
        include: {
          playerProfile: true,
        },
      });

      console.log(`✅ Created player: ${user.playerProfile.username}`);
      console.log(`   Rank: ${user.playerProfile.rank}`);
      console.log(`   Missions Completed: ${user.playerProfile.missionsCompleted}`);
      console.log(`   Average Score: ${user.playerProfile.averageScore}% | Win Rate: ${(user.playerProfile.winRate * 100).toFixed(1)}%\n`);

      // Get some random missions to create results for
      const missions = await prisma.mission.findMany({
        where: { status: 'ACTIVE', deletedAt: null },
        take: Math.min(playerData.profile.missionsCompleted, 10),
      });

      if (missions.length > 0) {
        // Create mission results with varied performance
        const resultsToCreate = missions.map((mission, index) => {
          const isCompleted = index < playerData.profile.missionsCompleted;
          const score = isCompleted
            ? Math.floor(playerData.profile.averageScore + (Math.random() * 10 - 5)) // ±5 variance
            : Math.floor(Math.random() * 60); // Lower scores for incomplete

          return {
            playerId: user.playerProfile.id,
            missionId: mission.id,
            score: Math.max(0, Math.min(100, score)),
            isCompleted,
            timeSpent: Math.floor((mission.duration || 30) * 60 + (Math.random() * 600 - 300)), // ±5 min variance
            completedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
          };
        });

        await prisma.missionResult.createMany({
          data: resultsToCreate,
        });

        console.log(`   ✨ Created ${resultsToCreate.length} mission results\n`);
      }
    } catch (error) {
      console.error(`❌ Error creating player ${playerData.username}:`, error.message);
    }
  }

  console.log('\n🎉 Diverse players seed completed!');
  console.log('📊 New leaderboard should show varied rankings\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
