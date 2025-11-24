-- CreateTable
CREATE TABLE "trainer_assignments" (
    "id" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "trainer_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "trainer_assignments_trainerId_idx" ON "trainer_assignments"("trainerId");

-- CreateIndex
CREATE INDEX "trainer_assignments_playerId_idx" ON "trainer_assignments"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "trainer_assignments_trainerId_playerId_key" ON "trainer_assignments"("trainerId", "playerId");

-- AddForeignKey
ALTER TABLE "trainer_assignments" ADD CONSTRAINT "trainer_assignments_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_assignments" ADD CONSTRAINT "trainer_assignments_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "player_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
