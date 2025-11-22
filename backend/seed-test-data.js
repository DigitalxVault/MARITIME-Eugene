require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function seedTestData() {
  console.log('🌱 Seeding test data...');

  try {
    // Create test users with hashed passwords (PRD Section 0.6)
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const trainerPassword = await bcrypt.hash('Trainer123!', 10);
    const learnerPassword = await bcrypt.hash('Cadet123!', 10);

    // Create Admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@navytraining.sg' },
      update: {},
      create: {
        email: 'admin@navytraining.sg',
        password: adminPassword,
        role: 'ADMIN',
        playerProfile: {
          create: {
            username: 'Admiral',
            rank: 'Admiral',
            winRate: 0.95,
            averageScore: 95,
            missionsCompleted: 100,
            totalTimeSpent: 5000,
          }
        }
      },
    });
    console.log('✅ Admin user created:', adminUser.email);

    // Create Trainer user
    const trainerUser = await prisma.user.upsert({
      where: { email: 'trainer@navytraining.sg' },
      update: {},
      create: {
        email: 'trainer@navytraining.sg',
        password: trainerPassword,
        role: 'TRAINER',
        playerProfile: {
          create: {
            username: 'Captain',
            rank: 'Captain',
            winRate: 0.88,
            averageScore: 88,
            missionsCompleted: 50,
            totalTimeSpent: 2500,
          }
        }
      },
    });
    console.log('✅ Trainer user created:', trainerUser.email);

    // Create Learner users
    const learner1 = await prisma.user.upsert({
      where: { email: 'cadet.tan@navytraining.sg' },
      update: {},
      create: {
        email: 'cadet.tan@navytraining.sg',
        password: learnerPassword,
        role: 'LEARNER',
        playerProfile: {
          create: {
            username: 'Navigator',
            rank: 'Lieutenant',
            winRate: 0.75,
            averageScore: 75,
            missionsCompleted: 20,
            totalTimeSpent: 800,
          }
        }
      },
    });
    console.log('✅ Learner 1 created:', learner1.email);

    const learner2 = await prisma.user.upsert({
      where: { email: 'learner2@maritime.com' },
      update: {},
      create: {
        email: 'learner2@maritime.com',
        password: learnerPassword,
        role: 'LEARNER',
        playerProfile: {
          create: {
            username: 'Helmsman',
            rank: 'Ensign',
            winRate: 0.68,
            averageScore: 68,
            missionsCompleted: 10,
            totalTimeSpent: 400,
          }
        }
      },
    });
    console.log('✅ Learner 2 created:', learner2.email);

    // Create sample missions
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
        type: 'PVP',
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
        title: 'Bridge Team Management',
        description: '<h2>Leadership at Sea</h2><p>Develop expert-level bridge team management skills for safe and efficient vessel operations.</p>',
        difficulty: 'HARD',
        type: 'PVP',
        duration: 120,
        learningObjectives: [
          'Coordinate bridge team operations',
          'Implement BRM (Bridge Resource Management) principles',
          'Manage crisis situations effectively',
          'Optimize voyage planning and execution'
        ],
        status: 'DRAFT',
        createdBy: trainerUser.id,
      }
    });
    console.log('✅ Mission 4 created:', mission4.title);

    // Get player profiles
    const playerProfile1 = await prisma.playerProfile.findUnique({
      where: { userId: learner1.id }
    });

    const playerProfile2 = await prisma.playerProfile.findUnique({
      where: { userId: learner2.id }
    });

    // Create some mission results
    if (playerProfile1 && playerProfile2) {
      await prisma.missionResult.create({
        data: {
          missionId: mission1.id,
          playerId: playerProfile1.id,
          score: 85,
          isCompleted: true,
          completedAt: new Date(),
          timeSpent: 42,
        }
      });

      await prisma.missionResult.create({
        data: {
          missionId: mission1.id,
          playerId: playerProfile2.id,
          score: 72,
          isCompleted: true,
          completedAt: new Date(),
          timeSpent: 48,
        }
      });

      await prisma.missionResult.create({
        data: {
          missionId: mission2.id,
          playerId: playerProfile1.id,
          score: 90,
          isCompleted: true,
          completedAt: new Date(),
          timeSpent: 55,
        }
      });

      console.log('✅ Mission results created');
    }

    console.log('\n🎉 Test data seeded successfully!');
    console.log('\n📝 Login Credentials (PRD Section 0.6):');
    console.log('------------------------');
    console.log('Admin:   admin@navytraining.sg / Admin123!');
    console.log('Trainer: trainer@navytraining.sg / Trainer123!');
    console.log('Learner: cadet.tan@navytraining.sg / Cadet123!');
    console.log('Learner2: learner2@maritime.com / password123');
    console.log('------------------------\n');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedTestData()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });