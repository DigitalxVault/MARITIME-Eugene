# CODEX Evaluation – Mission Control Dashboard

## Executive Summary
The Mission Control Dashboard implements a sizable portion of the prescribed stack (Next.js + Express + Prisma + Redis) and ships working authentication, mission CRUD, and dashboard skeletons. However, several MVP requirements from **FS_JOB ASSIGNMENT.md** remain incomplete or misaligned: player-progress features stop at a list view, leaderboard filtering and "my rank" are incorrect, caching/analytics requirements are only partially met, and RBAC rules deviate from the spec. Production builds still serve outdated Zod schemas and strict rate limits, causing 400/429 errors that match stakeholder screenshots. Overall status: **Partially Passes**—major flows exist but key specs and data guarantees are missing.

## Requirement Coverage Table
| Requirement (spec reference) | Status | Evidence | Notes |
|------------------------------|--------|----------|-------|
| Auth endpoints + JWT login (FS_JOB ASSIGNMENT.md §2.A) | Pass | `backend/src/api/auth/auth.routes.ts:19-49` for login/logout/me; login UI in `frontend/app/auth/login/page.tsx:1-154` | bcrypt + JWT + Redis sessions implemented; UI uses React Hook Form + Zod. |
| Mission management: list/filter/detail/create (FS_JOB ASSIGNMENT.md §1.A) | Partial | `frontend/app/dashboard/missions/page.tsx:17-166`, `frontend/components/missions/MissionForm.tsx`, `backend/src/services/mission.service.ts` | CRUD works, but backend allows TRAINERs to create missions (`backend/src/api/missions/index.ts:51-62`) despite spec line 155 stating “ADMIN only”; mission detail lacks completion stats requested in lines 102-105. |
| Player progress tracking (FS_JOB ASSIGNMENT.md §1.B) | Fail | Requirement lines 106-114; UI stub at `frontend/app/dashboard/players/[id]/page.tsx:1-3`; API failures due to old schemas `backend/dist/schemas/player.schema.js:1-35` | No mission history/trends UI; `/api/players` rejects default `sortBy=level`, so list view shows “Unknown”. |
| Role-Based Access Control (FS_JOB ASSIGNMENT.md §1.C) | Partial | Middleware `backend/src/middleware/rbac.middleware.ts`, ProtectedRoute `frontend/components/auth/ProtectedRoute.tsx`, nav filtering in `frontend/app/dashboard/layout.tsx` | RBAC exists, but mission creation RBAC does not match spec and `/api/activity/recent` exposes data without auth. |
| Real-time dashboard feed (FS_JOB ASSIGNMENT.md §1.D) | Partial | Component polls (`frontend/components/dashboard/ActivityFeed.tsx:34-82`); backend route `backend/src/api/activity/activity.routes.ts:1-12` | Polling works locally but hard-coded `http://localhost:4000` breaks deployments and bypasses Axios interceptors. |
| Leaderboard filtering (PRD §Mission Control KPIs) | Partial | UI toggles `period`/`metric` (`frontend/app/dashboard/leaderboard/page.tsx:33-110`); backend logic `backend/src/api/leaderboard/leaderboard.service.ts:18-151` | Period filter only checks `updatedAt`, so ranking never changes; `/leaderboard/me` returns 404 for admin/trainer accounts. |
| Analytics overview + mission analytics (FS_JOB ASSIGNMENT.md §2.A Analytics) | Partial | Queries at `frontend/app/dashboard/page.tsx:57-71` & `app/dashboard/analytics/page.tsx`; backend aggregator `backend/src/services/analytics.service.ts:37-200` | Aggressive polling collides with global rate limiter (100 req/15 min in `backend/dist/app.js:31-41`), causing 429s; mission/player-specific analytics endpoints lack frontend surfaces. |
| Caching strategy (FS_JOB ASSIGNMENT.md §2.D) | Partial | Redis wrapper `backend/src/services/cache.service.ts` used in analytics/auth (`backend/src/api/auth/auth.service.ts:59-113`) | Requirement to cache mission list + invalidation (lines 187-190) is not implemented. |
| Docker/DevOps deliverables (FS_JOB ASSIGNMENT.md §0.7) | Pass | `docker-compose.yml` includes backend/frontend/postgres/redis; Dockerfiles present | Works as documented, though frontend env still appends `/api`. |

## Misaligned / Incorrect Implementations
1. **Mission creation RBAC** – Spec line 155 requires ADMIN-only creation, but the route uses `isAdminOrTrainer` (`backend/src/api/missions/index.ts:51-62`), allowing trainers to create missions directly.
2. **Leaderboard period filter** – Filtering relies solely on `playerProfile.updatedAt` (`backend/src/api/leaderboard/leaderboard.service.ts:37-47`) instead of mission result timestamps, so UI filters never change rankings.
3. **“My Rank” endpoint** – `/leaderboard/me` returns 404 whenever the authenticated user lacks a `playerProfile` (`backend/src/api/leaderboard/leaderboard.service.ts:96-109`), yet the frontend always queries it, yielding console errors.
4. **Hard-coded API hosts** – Login and Activity feed call `http://localhost:4000/...` directly (`frontend/app/auth/login/page.tsx:33-74`, `frontend/components/dashboard/ActivityFeed.tsx:34-70`), ignoring `NEXT_PUBLIC_API_URL` and Axios interceptors (tokens, error handling).
5. **Outdated production build** – Compiled schema `backend/dist/schemas/player.schema.js:1-35` still enforces UUID IDs and limited sort fields even though TypeScript sources were updated, which matches the 400 errors reported in the browser.
6. **Rate limit vs polling** – The emitted server bundle (`backend/dist/app.js:31-41`) caps `/api` traffic at 100 requests per 15 minutes, but dashboard widgets poll >150 times, triggering persistent 429 errors.

## Missing Features / Incomplete Sections
- **Player detail & analytics views** – Requirement lines 106-114 mandate mission history, performance trends, and current mission status. UI route `frontend/app/dashboard/players/[id]/page.tsx:1-3` is a placeholder; backend trend data is unused.
- **Mission-specific analytics UI** – Backend exposes `/api/analytics/missions/:id` and `/players/:id`, but there is no frontend page rendering these metrics.
- **Mission list caching** – Despite requirement §2.D (lines 187-190), no mission controller or service uses Redis; only analytics/auth benefit from caching.
- **Secure activity feed** – `/api/activity/recent` is unauthenticated (`backend/src/api/activity/activity.routes.ts:1-12`) even though it displays mission completion info, conflicting with the “Secure sensitive training data” requirement (§Why This Matters).

## Risks & Concern Areas
- **Broken player management** – With the production build still shipping outdated schemas, `/api/players` rejects valid queries, so admins cannot manage cadets (critical MVP feature).
- **Spec drift** – README advertises real-time progress tracking and player analytics that do not exist, risking stakeholder misalignment.
- **Scalability** – Polling-based widgets (activity feed, analytics, leaderboard) run every 10–30 seconds with no adaptive throttling, easily tripping the rate limiter and wasting resources.
- **RBAC gaps** – Allowing trainers to create missions plus exposing `/api/activity/recent` publicly undermines the strict access model described in FS assignment §1.C.

## Recommended Next Steps (for Claude Code & Dev Lead)
1. **Regenerate the backend build** so new Zod schemas (CUID IDs, expanded sort fields) reach production; confirm `/api/players` and `/players/:id` succeed.
2. **Implement the player detail experience** using `playerService.getPlayerProgress` so mission history and trend charts satisfy MVP scope.
3. **Correct RBAC & endpoint security**: restrict mission creation to admins, require auth for `/api/activity/recent`, and guard `/leaderboard/me` requests for users without player profiles.
4. **Rework leaderboard filters** to aggregate mission results by time windows; update UI to handle cases where a user has no rank.
5. **Tame polling vs. rate limits**: either raise the global limit or consolidate dashboard requests; also make the Activity feed use the shared Axios client and environment variable.
6. **Add mission-list caching & invalidation** per §2.D using the existing Redis abstraction.
7. **Update documentation** to reflect actual feature status or prioritize building the advertised analytics/player flows.

## Additional Insights
- The Prisma schema largely matches the PRD entities, but player profiles lack `displayName`/`playerTag` columns mentioned in §2.C (lines 176-180), which may be needed for downstream integrations.
- Activity feed currently mixes mission creation and completion events equally. Consider weighting completions to keep the feed relevant for trainers monitoring learner progress.
