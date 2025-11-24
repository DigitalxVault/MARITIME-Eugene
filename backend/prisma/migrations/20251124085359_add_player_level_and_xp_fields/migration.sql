-- AlterTable
ALTER TABLE "player_profiles" ADD COLUMN     "experiencePoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "totalMissionsAttempted" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalMissionsCompleted" INTEGER NOT NULL DEFAULT 0;
