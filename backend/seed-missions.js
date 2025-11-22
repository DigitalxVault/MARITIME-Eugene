require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedMissions() {
  console.log('🌱 Seeding missions...');

  try {
    // Get existing users to use as creators
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@maritime.com' }
    });

    const trainerUser = await prisma.user.findUnique({
      where: { email: 'trainer@maritime.com' }
    });

    if (!adminUser || !trainerUser) {
      console.log('❌ Please run seed-test-data.js first to create users');
      return;
    }

    // Create sample missions with correct enum values
    const mission1 = await prisma.mission.create({
      data: {
        title: 'Basic Navigation Training',
        description: '<h2>Mission Overview</h2><p>Learn the fundamentals of maritime navigation including chart reading, GPS systems, and traditional navigation methods.</p><h3>Key Topics</h3><ul><li>Chart symbols and conventions</li><li>GPS and electronic navigation</li><li>Dead reckoning</li><li>Collision avoidance</li></ul>',
        difficulty: 'EASY',
        type: 'PVE',
        duration: 45,
        learningObjectives: [
          'Understand basic navigation principles',
          'Read and interpret nautical charts',
          'Use GPS navigation systems effectively',
          'Apply collision avoidance rules'
        ],
        status: 'ACTIVE',
        createdBy: adminUser.id,
      }
    });
    console.log('✅ Mission 1 created:', mission1.title);

    const mission2 = await prisma.mission.create({
      data: {
        title: 'Emergency Response Procedures',
        description: '<h2>Critical Emergency Training</h2><p><strong>This mission covers essential emergency response procedures</strong> that every maritime professional must master.</p><blockquote>Remember: In an emergency, every second counts!</blockquote><h3>Scenarios Covered</h3><ol><li>Fire suppression techniques</li><li>Man overboard procedures</li><li>Abandon ship protocols</li><li>Medical emergency response</li></ol>',
        difficulty: 'MEDIUM',
        type: 'PVE',
        duration: 60,
        learningObjectives: [
          'Execute proper fire suppression procedures',
          'Perform man overboard recovery operations',
          'Coordinate abandon ship procedures',
          'Provide basic medical assistance',
          'Use emergency communication systems'
        ],
        status: 'ACTIVE',
        createdBy: trainerUser.id,
      }
    });
    console.log('✅ Mission 2 created:', mission2.title);

    const mission3 = await prisma.mission.create({
      data: {
        title: 'Advanced Cargo Operations',
        description: '<h2>Complex Cargo Handling</h2><p>Master the intricate procedures of cargo loading, securing, and documentation for international shipping.</p><h3>Advanced Topics</h3><ul><li>Dangerous goods handling (IMDG Code)</li><li>Container loading patterns</li><li>Stability calculations</li><li>Port state control requirements</li></ul><hr><p><em>This mission requires prior completion of Basic Cargo Operations.</em></p>',
        difficulty: 'HARD',
        type: 'PVE',
        duration: 90,
        learningObjectives: [
          'Handle dangerous goods according to IMDG Code',
          'Optimize container loading for stability',
          'Complete international shipping documentation',
          'Perform cargo securing calculations',
          'Manage port state control inspections'
        ],
        status: 'ACTIVE',
        createdBy: adminUser.id,
      }
    });
    console.log('✅ Mission 3 created:', mission3.title);

    const mission4 = await prisma.mission.create({
      data: {
        title: 'Bridge Team Competition',
        description: '<h2>Competitive Bridge Management</h2><p>Compete with other teams in real-time bridge management scenarios. Test your skills against the best!</p>',
        difficulty: 'HARD',
        type: 'PVP',
        duration: 120,
        learningObjectives: [
          'Coordinate bridge team operations under pressure',
          'Compete in real-time decision making',
          'Manage crisis situations effectively',
          'Optimize voyage planning against opponents'
        ],
        status: 'ACTIVE',
        createdBy: trainerUser.id,
      }
    });
    console.log('✅ Mission 4 created:', mission4.title);

    const mission5 = await prisma.mission.create({
      data: {
        title: 'Port Operations Challenge',
        description: '<h2>Port Management Simulation</h2><p>Learn to manage port operations efficiently, including vessel berthing, cargo handling, and port logistics.</p>',
        difficulty: 'MEDIUM',
        type: 'PVE',
        duration: 75,
        learningObjectives: [
          'Manage vessel berthing schedules',
          'Coordinate cargo loading and unloading',
          'Optimize port resource allocation',
          'Handle port emergencies'
        ],
        status: 'DRAFT',
        createdBy: adminUser.id,
      }
    });
    console.log('✅ Mission 5 created:', mission5.title);

    // Get player profiles for creating mission results
    const playerProfile1 = await prisma.playerProfile.findUnique({
      where: { username: 'Navigator' }
    });

    const playerProfile2 = await prisma.playerProfile.findUnique({
      where: { username: 'Helmsman' }
    });

    // Create some mission results if players exist
    if (playerProfile1 && playerProfile2) {
      await prisma.missionResult.create({
        data: {
          missionId: mission1.id,
          playerId: playerProfile1.id,
          score: 85,
          isCompleted: true,
          completedAt: new Date(),
          timeTaken: 42,
        }
      });

      await prisma.missionResult.create({
        data: {
          missionId: mission1.id,
          playerId: playerProfile2.id,
          score: 72,
          isCompleted: true,
          completedAt: new Date(),
          timeTaken: 48,
        }
      });

      await prisma.missionResult.create({
        data: {
          missionId: mission2.id,
          playerId: playerProfile1.id,
          score: 90,
          isCompleted: true,
          completedAt: new Date(),
          timeTaken: 55,
        }
      });

      console.log('✅ Mission results created');
    }

    console.log('\n🎉 Missions seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding missions:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedMissions()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });