-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TRAINER', 'LEARNER');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "MissionType" AS ENUM ('PVE', 'PVP');

-- CreateEnum
CREATE TYPE "MissionStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "rank" TEXT NOT NULL DEFAULT 'Cadet',
    "winRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "averageScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "missionsCompleted" INTEGER NOT NULL DEFAULT 0,
    "totalTimeSpent" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "type" "MissionType" NOT NULL,
    "duration" INTEGER NOT NULL,
    "status" "MissionStatus" NOT NULL DEFAULT 'DRAFT',
    "learningObjectives" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_results" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "timeSpent" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCompleted" BOOLEAN NOT NULL DEFAULT true,
    "achievements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mission_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "player_profiles_userId_key" ON "player_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "player_profiles_username_key" ON "player_profiles"("username");

-- CreateIndex
CREATE INDEX "player_profiles_username_idx" ON "player_profiles"("username");

-- CreateIndex
CREATE INDEX "missions_difficulty_type_status_idx" ON "missions"("difficulty", "type", "status");

-- CreateIndex
CREATE INDEX "missions_status_idx" ON "missions"("status");

-- CreateIndex
CREATE INDEX "missions_createdBy_idx" ON "missions"("createdBy");

-- CreateIndex
CREATE INDEX "mission_results_missionId_idx" ON "mission_results"("missionId");

-- CreateIndex
CREATE INDEX "mission_results_playerId_idx" ON "mission_results"("playerId");

-- CreateIndex
CREATE INDEX "mission_results_completedAt_idx" ON "mission_results"("completedAt");

-- AddForeignKey
ALTER TABLE "player_profiles" ADD CONSTRAINT "player_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_results" ADD CONSTRAINT "mission_results_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_results" ADD CONSTRAINT "mission_results_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "player_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
