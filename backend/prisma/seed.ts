import { PrismaClient, UserRole, Difficulty, MissionType, MissionStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file in root directory
// The seed script runs from backend directory, so we need to go up one level
const envPath = path.resolve(process.cwd(), '../.env');
dotenv.config({ path: envPath });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (in development only)
  await prisma.missionResult.deleteMany();
  await prisma.playerProfile.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Cleared existing data');

  // Hash passwords with salt rounds = 10 (as per PRD requirement)
  const saltRounds = 10;
  const hashedAdminPassword = await bcrypt.hash('Admin123!', saltRounds);
  const hashedTrainerPassword = await bcrypt.hash('Trainer123!', saltRounds);
  const hashedLearnerPassword = await bcrypt.hash('Cadet123!', saltRounds);

  // Create Users
  console.log('👥 Creating users...');

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@navytraining.sg',
      password: hashedAdminPassword,
      role: UserRole.ADMIN,
    },
  });
  console.log(`  ✅ Created ADMIN: ${adminUser.email}`);

  const trainerUser = await prisma.user.create({
    data: {
      email: 'trainer@navytraining.sg',
      password: hashedTrainerPassword,
      role: UserRole.TRAINER,
    },
  });
  console.log(`  ✅ Created TRAINER: ${trainerUser.email}`);

  const learnerUser = await prisma.user.create({
    data: {
      email: 'cadet.tan@navytraining.sg',
      password: hashedLearnerPassword,
      role: UserRole.LEARNER,
      playerProfile: {
        create: {
          username: 'Cadet_Tan_Wei_Ming',
          rank: 'Naval Cadet',
          winRate: 0.75,
          averageScore: 85.5,
          missionsCompleted: 5,
          totalTimeSpent: 180,
        },
      },
    },
    include: {
      playerProfile: true,
    },
  });
  console.log(`  ✅ Created LEARNER: ${learnerUser.email} with PlayerProfile`);

  // Create Sample Missions (Singapore Maritime Context)
  console.log('🎯 Creating sample missions...');

  const mission1 = await prisma.mission.create({
    data: {
      title: 'Marina Bay Navigation',
      description: 'Basic navigation exercise in Singapore\'s Marina Bay area. Perfect for cadets learning fundamental maritime navigation skills.',
      difficulty: Difficulty.EASY,
      type: MissionType.PVE,
      status: MissionStatus.ACTIVE,
      duration: 20,
      learningObjectives: ['Basic Navigation', 'Chart Reading', 'Vessel Control'],
      createdBy: trainerUser.id,
    },
  });
  console.log(`  ✅ Created Mission: ${mission1.title}`);

  const mission2 = await prisma.mission.create({
    data: {
      title: 'Singapore Strait Patrol',
      description: 'Navigate through the busy Singapore Strait while avoiding civilian traffic and maintaining maritime security protocols. This mission simulates real-world patrol scenarios in one of the world\'s busiest shipping lanes.',
      difficulty: Difficulty.MEDIUM,
      type: MissionType.PVE,
      status: MissionStatus.ACTIVE,
      duration: 30,
      learningObjectives: ['Navigation', 'Traffic Management', 'Communication', 'Situational Awareness'],
      createdBy: adminUser.id,
    },
  });
  console.log(`  ✅ Created Mission: ${mission2.title}`);

  const mission3 = await prisma.mission.create({
    data: {
      title: 'Jurong Port Defense',
      description: 'Coordinate defense operations for Singapore\'s Jurong Port during a simulated security threat. Practice multi-vessel coordination and rapid response protocols.',
      difficulty: Difficulty.HARD,
      type: MissionType.PVP,
      status: MissionStatus.ACTIVE,
      duration: 45,
      learningObjectives: ['Tactical Planning', 'Team Coordination', 'Crisis Management'],
      createdBy: adminUser.id,
    },
  });
  console.log(`  ✅ Created Mission: ${mission3.title}`);

  // Create Sample Mission Results for the Learner
  console.log('📊 Creating sample mission results...');

  if (learnerUser.playerProfile) {
    const result1 = await prisma.missionResult.create({
      data: {
        missionId: mission1.id,
        playerId: learnerUser.playerProfile.id,
        score: 92.5,
        timeSpent: 18,
        isCompleted: true,
        achievements: ['First_Mission', 'Perfect_Navigation'],
        completedAt: new Date('2024-11-15T10:30:00Z'),
      },
    });
    console.log(`  ✅ Created MissionResult: ${mission1.title} - Score: ${result1.score}`);

    const result2 = await prisma.missionResult.create({
      data: {
        missionId: mission2.id,
        playerId: learnerUser.playerProfile.id,
        score: 88.0,
        timeSpent: 28,
        isCompleted: true,
        achievements: ['Strait_Master', 'Communication_Expert'],
        completedAt: new Date('2024-11-18T14:45:00Z'),
      },
    });
    console.log(`  ✅ Created MissionResult: ${mission2.title} - Score: ${result2.score}`);

    const result3 = await prisma.missionResult.create({
      data: {
        missionId: mission1.id,
        playerId: learnerUser.playerProfile.id,
        score: 95.0,
        timeSpent: 16,
        isCompleted: true,
        achievements: ['Speed_Demon', 'Flawless_Execution'],
        completedAt: new Date('2024-11-20T09:15:00Z'),
      },
    });
    console.log(`  ✅ Created MissionResult: ${mission1.title} (2nd attempt) - Score: ${result3.score}`);
  }

  console.log('');
  console.log('🎉 Database seeding completed successfully!');
  console.log('');
  console.log('📋 Summary:');
  console.log(`  - Users created: 3 (ADMIN, TRAINER, LEARNER)`);
  console.log(`  - Missions created: 3 (Easy, Medium, Hard)`);
  console.log(`  - Mission results created: 3`);
  console.log(`  - Player profiles created: 1`);
  console.log('');
  console.log('🔐 Login Credentials:');
  console.log('  ADMIN:   admin@navytraining.sg / Admin123!');
  console.log('  TRAINER: trainer@navytraining.sg / Trainer123!');
  console.log('  LEARNER: cadet.tan@navytraining.sg / Cadet123!');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
