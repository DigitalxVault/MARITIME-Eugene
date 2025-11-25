# Technical Findings & Solutions - Mission Control Dashboard

## Issue: Leaderboard 404 Errors (2025-11-25 11:30:00)

### Summary
Console showed 404 errors for `/api/leaderboard/me` endpoint when logged in as ADMIN or TRAINER. Main leaderboard functionality was working correctly with proper filtering.

### Root Cause
The `/api/leaderboard/me` endpoint fetches the logged-in user's personal rank from the `PlayerProfile` table. However:
-  **PLAYER** role users have `PlayerProfile` records (complete missions)
- L **ADMIN** role users do NOT have `PlayerProfile` records (manage system)
- L **TRAINER** role users do NOT have `PlayerProfile` records (monitor trainees)

Frontend was fetching `/me` endpoint for ALL logged-in users (`enabled: !!user`), causing 404 errors for ADMIN/TRAINER roles.

### Evidence
- **File**: `backend/src/api/leaderboard/leaderboard.service.ts:96`
  - `playerProfile.findUnique({ where: { userId } })` returns `null` for ADMIN/TRAINER
  - Controller returns 404 when `playerProfile` is null

- **File**: `backend/prisma/seed.ts:90-99`
  - Only LEARNER users get `PlayerProfile` records
  - 8 learners with profiles vs 2 admins + 3 trainers without

- **Requirements**: `docs/FS_JOB ASSIGNMENT.md:115-122`
  - LEARNER = Players who complete missions (have rankings)
  - ADMIN/TRAINER = Staff who manage/monitor (no mission participation)

### Solution Applied
**Option A: Disable "Your Rank" Query for Non-Players**

**Files Modified**:
1. `frontend/app/dashboard/leaderboard/page.tsx:13` - Added `import { UserRole } from '@/types'`
2. `frontend/app/dashboard/leaderboard/page.tsx:67` - Changed query condition:
   ```typescript
   // BEFORE:
   enabled: !!user,

   // AFTER:
   enabled: user?.role === UserRole.PLAYER,
   ```

**Result**:
-  PLAYER users: Fetch `/me` endpoint and display "Your Rank" card
-  ADMIN/TRAINER users: Skip `/me` query, no 404 errors, no "Your Rank" card
-  Aligns with requirements: Only players participate in leaderboard rankings
-  No database changes required
-  No backend changes required

### Testing
- Frontend Docker image rebuilt: `docker-compose build frontend`
- Container recreated: 2025-11-25 11:36:34
- Next.js build successful with no errors
- Ready for testing at http://localhost:3000/dashboard/leaderboard

### Alternative Solutions Considered
**Option B (Rejected)**: Create PlayerProfiles for ADMIN/TRAINER
- Would allow everyone to participate in missions
- Not aligned with requirements (staff vs learners separation)
- Requires database changes and re-seeding

**Option C (Rejected)**: Graceful error handling with 200 response
- Backend returns `{ hasProfile: false }` instead of 404
- Frontend shows "Join as a player to see your rank"
- More complex, provides limited value over Option A
