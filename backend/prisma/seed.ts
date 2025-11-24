/**
 * Database Seed Script - Realistic Maritime Training Data
 * Creates comprehensive test data for Mission Control Dashboard
 *
 * Run with: npx prisma db seed
 */

import { PrismaClient, UserRole, Difficulty, MissionType, MissionStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
const envPath = path.resolve(process.cwd(), '../.env');
dotenv.config({ path: envPath });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // ===== STEP 1: Clean up existing data =====
  console.log('🧹 Cleaning up existing data...');
  await prisma.missionResult.deleteMany();
  await prisma.trainerAssignment.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.playerProfile.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Database cleaned\n');

  // ===== STEP 2: Create Admin Users =====
  console.log('👨‍💼 Creating Admin users...');
  const adminPassword = await bcrypt.hash('Admin123!', 10);

  const admin1 = await prisma.user.create({
    data: {
      email: 'admin@navytraining.sg',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      email: 'senior.admin@navytraining.sg',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log(`  ✓ Created: ${admin1.email}`);
  console.log(`  ✓ Created: ${admin2.email}\n`);

  // ===== STEP 3: Create Trainer Users =====
  console.log('👨‍🏫 Creating Trainer users...');
  const trainerPassword = await bcrypt.hash('Trainer123!', 10);

  const trainer1 = await prisma.user.create({
    data: {
      email: 'trainer@navytraining.sg',
      password: trainerPassword,
      role: UserRole.TRAINER,
    },
  });

  const trainer2 = await prisma.user.create({
    data: {
      email: 'cpt.lim@navytraining.sg',
      password: trainerPassword,
      role: UserRole.TRAINER,
    },
  });

  const trainer3 = await prisma.user.create({
    data: {
      email: 'lt.rahman@navytraining.sg',
      password: trainerPassword,
      role: UserRole.TRAINER,
    },
  });

  console.log(`  ✓ Created: ${trainer1.email}`);
  console.log(`  ✓ Created: ${trainer2.email}`);
  console.log(`  ✓ Created: ${trainer3.email}\n`);

  // ===== STEP 4: Create Learner Users with Player Profiles =====
  console.log('🎓 Creating Learner users with player profiles...');
  const learnerPassword = await bcrypt.hash('Cadet123!', 10);

  const learners = [
    { email: 'cadet.tan@navytraining.sg', username: 'TanWeiMing', rank: 'Midshipman', level: 8, xp: 3500, winRate: 0.82, avgScore: 88.5, missions: 15, attempts: 18, time: 280 },
    { email: 'cadet.wong@navytraining.sg', username: 'WongJiaHao', rank: 'Cadet', level: 5, xp: 2100, winRate: 0.68, avgScore: 76.0, missions: 8, attempts: 12, time: 180 },
    { email: 'cadet.kumar@navytraining.sg', username: 'KumarRaj', rank: 'Cadet', level: 4, xp: 1800, winRate: 0.72, avgScore: 79.5, missions: 7, attempts: 10, time: 150 },
    { email: 'cadet.chen@navytraining.sg', username: 'ChenXiaoLing', rank: 'Cadet', level: 6, xp: 2650, winRate: 0.75, avgScore: 82.0, missions: 11, attempts: 15, time: 220 },
    { email: 'cadet.ibrahim@navytraining.sg', username: 'IbrahimHassan', rank: 'Midshipman', level: 9, xp: 4200, winRate: 0.85, avgScore: 91.0, missions: 18, attempts: 21, time: 320 },
    { email: 'cadet.ng@navytraining.sg', username: 'NgKaiWen', rank: 'Cadet', level: 3, xp: 1400, winRate: 0.65, avgScore: 73.5, missions: 5, attempts: 8, time: 120 },
    { email: 'cadet.leong@navytraining.sg', username: 'LeongMeiLing', rank: 'Midshipman', level: 7, xp: 3100, winRate: 0.78, avgScore: 85.5, missions: 13, attempts: 17, time: 260 },
    { email: 'cadet.yusof@navytraining.sg', username: 'YusofMuhammad', rank: 'Cadet', level: 5, xp: 2300, winRate: 0.70, avgScore: 77.5, missions: 9, attempts: 13, time: 190 },
  ];

  const playerProfiles: any[] = [];

  for (const learnerData of learners) {
    const user = await prisma.user.create({
      data: {
        email: learnerData.email,
        password: learnerPassword,
        role: UserRole.LEARNER,
      },
    });

    const profile = await prisma.playerProfile.create({
      data: {
        userId: user.id,
        username: learnerData.username,
        rank: learnerData.rank,
        level: learnerData.level,
        experiencePoints: learnerData.xp,
        winRate: learnerData.winRate,
        totalScore: learnerData.avgScore * learnerData.missions * 100,
        averageScore: learnerData.avgScore,
        missionsCompleted: learnerData.missions,
        totalMissionsCompleted: learnerData.missions,
        totalMissionsAttempted: learnerData.attempts,
        totalTimeSpent: learnerData.time,
      },
    });

    playerProfiles.push(profile);
    console.log(`  ✓ Created: ${learnerData.username} (${learnerData.rank}, Level ${learnerData.level}, ${learnerData.missions} missions)`);
  }
  console.log('');

  // ===== STEP 5: Create Realistic Missions =====
  console.log('🎯 Creating missions...');

  const missions = [
    {
      title: 'Marina Bay Navigation',
      description: 'Basic navigation exercise in Singapore\'s Marina Bay area. Learn fundamental maritime navigation skills and vessel control in calm waters.',
      difficulty: Difficulty.EASY,
      type: MissionType.PVE,
      status: MissionStatus.ACTIVE,
      duration: 20,
      learningObjectives: ['Basic Navigation', 'Chart Reading', 'Vessel Control'],
      createdBy: admin1.id,
    },
    {
      title: 'Johor Strait Patrol',
      description: 'Navigate through the Johor Strait while maintaining patrol protocols. Practice situational awareness and maritime communication.',
      difficulty: Difficulty.EASY,
      type: MissionType.PVE,
      status: MissionStatus.ACTIVE,
      duration: 25,
      learningObjectives: ['Navigation', 'Communication', 'Situational Awareness'],
      createdBy: admin1.id,
    },
    {
      title: 'Singapore Strait Traffic Management',
      description: 'Navigate through the busy Singapore Strait while avoiding civilian traffic and maintaining maritime security protocols. One of the world\'s busiest shipping lanes.',
      difficulty: Difficulty.MEDIUM,
      type: MissionType.PVE,
      status: MissionStatus.ACTIVE,
      duration: 35,
      learningObjectives: ['Navigation', 'Traffic Management', 'Communication', 'Situational Awareness'],
      createdBy: admin1.id,
    },
    {
      title: 'Night Navigation Exercise',
      description: 'Advanced navigation training during nighttime conditions around Singapore waters. Use radar and navigation instruments effectively.',
      difficulty: Difficulty.MEDIUM,
      type: MissionType.PVE,
      status: MissionStatus.ACTIVE,
      duration: 30,
      learningObjectives: ['Night Navigation', 'Radar Operation', 'Instrument Reading'],
      createdBy: admin2.id,
    },
    {
      title: 'Emergency Response Drill',
      description: 'Respond to simulated maritime emergencies including vessel distress and search and rescue operations in Singapore waters.',
      difficulty: Difficulty.MEDIUM,
      type: MissionType.PVE,
      status: MissionStatus.ACTIVE,
      duration: 40,
      learningObjectives: ['Emergency Response', 'Search and Rescue', 'Crisis Management'],
      createdBy: admin2.id,
    },
    {
      title: 'Jurong Port Defense',
      description: 'Coordinate defense operations for Singapore\'s Jurong Port during a simulated security threat. Practice multi-vessel coordination and rapid response protocols.',
      difficulty: Difficulty.HARD,
      type: MissionType.PVP,
      status: MissionStatus.ACTIVE,
      duration: 45,
      learningObjectives: ['Tactical Planning', 'Team Coordination', 'Crisis Management', 'Defense Operations'],
      createdBy: admin1.id,
    },
    {
      title: 'Fleet Coordination Exercise',
      description: 'Advanced team-based exercise coordinating multiple vessels in Singapore waters. Requires excellent communication and strategic thinking.',
      difficulty: Difficulty.HARD,
      type: MissionType.PVP,
      status: MissionStatus.ACTIVE,
      duration: 50,
      learningObjectives: ['Fleet Coordination', 'Strategic Planning', 'Team Communication'],
      createdBy: admin2.id,
    },
    {
      title: 'Changi Naval Base Security',
      description: 'DRAFT mission for advanced security operations around Changi Naval Base. Includes threat assessment and response protocols.',
      difficulty: Difficulty.HARD,
      type: MissionType.PVE,
      status: MissionStatus.DRAFT,
      duration: 60,
      learningObjectives: ['Threat Assessment', 'Security Operations', 'Naval Base Protection'],
      createdBy: admin1.id,
    },
  ];

  const createdMissions: any[] = [];
  for (const missionData of missions) {
    const mission = await prisma.mission.create({
      data: missionData,
    });
    createdMissions.push(mission);
    console.log(`  ✓ Created: ${mission.title} (${mission.difficulty})`);
  }
  console.log('');

  // ===== STEP 6: Create Mission Results (Player Performance) =====
  console.log('📊 Creating mission results...');

  let resultsCount = 0;
  const activeMissions = createdMissions.filter(m => m.status === MissionStatus.ACTIVE);

  for (const player of playerProfiles) {
    // Give each player 3-6 completed missions
    const numMissions = Math.floor(Math.random() * 4) + 3;
    const selectedMissions = activeMissions
      .sort(() => Math.random() - 0.5)
      .slice(0, numMissions);

    for (const mission of selectedMissions) {
      const score = parseFloat((Math.random() * 25 + 72).toFixed(1));
      const timeSpent = Math.floor(mission.duration * (Math.random() * 0.3 + 0.85));

      await prisma.missionResult.create({
        data: {
          missionId: mission.id,
          playerId: player.id,
          score,
          timeSpent,
          completedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          isCompleted: true,
          achievements: score >= 90 ? ['Perfect Score', 'Quick Completion'] : score >= 80 ? ['Good Performance'] : [],
        },
      });
      resultsCount++;
    }
  }

  console.log(`  ✓ Created ${resultsCount} mission results\n`);

  // ===== STEP 7: Create Trainer Assignments =====
  console.log('🔗 Creating trainer assignments...');

  const trainers = [trainer1, trainer2, trainer3];
  let assignmentCount = 0;

  for (let i = 0; i < playerProfiles.length; i++) {
    const trainer = trainers[i % trainers.length];
    await prisma.trainerAssignment.create({
      data: {
        trainerId: trainer.id,
        playerId: playerProfiles[i].id,
        assignedBy: admin1.id,
      },
    });
    assignmentCount++;
  }

  console.log(`  ✓ Created ${assignmentCount} trainer assignments\n`);

  // ===== SUMMARY =====
  console.log('✨ Database seed completed!\n');
  console.log('📋 Summary:');
  console.log(`  • Users: ${learners.length + 5} (2 admins, 3 trainers, ${learners.length} learners)`);
  console.log(`  • Player Profiles: ${playerProfiles.length}`);
  console.log(`  • Missions: ${createdMissions.length} (${activeMissions.length} active, ${createdMissions.length - activeMissions.length} draft)`);
  console.log(`  • Mission Results: ${resultsCount}`);
  console.log(`  • Trainer Assignments: ${assignmentCount}\n`);

  console.log('🔐 Test Accounts:');
  console.log('  Admin:   admin@navytraining.sg / Admin123!');
  console.log('  Trainer: trainer@navytraining.sg / Trainer123!');
  console.log('  Learner: cadet.tan@navytraining.sg / Cadet123!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
