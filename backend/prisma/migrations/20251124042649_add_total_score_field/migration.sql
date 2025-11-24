-- AlterTable
ALTER TABLE "player_profiles" ADD COLUMN     "totalScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- CreateIndex
CREATE INDEX "player_profiles_totalScore_idx" ON "player_profiles"("totalScore");
