# CODEX Evaluation

## Overview
Deep-dive into `FS - Job Assignment.md` and the current codebase shows that many core requirements are either incomplete or implemented against a different data model than the backend actually exposes. The deltas below cover the highest-risk gaps.

## Requirement Coverage
### Mission Management Dashboard (Req. 1.A)
- Frontend mission types diverge from the backend schema. UI components (e.g. `frontend/app/dashboard/missions/[id]/page.tsx`) expect `estimatedDuration`, `passingScore`, `maxAttempts`, `objectives`, `scenarios`, `tags`, and `_count.attempts`, but `backend/prisma/schema.prisma` only stores `duration`, `learningObjectives`, and `results`. No tables exist for mission objectives/scenarios, so those views cannot render real data.
- Mission creation is restricted to `ADMIN` only (`frontend/app/dashboard/missions/new/page.tsx`), contradicting the requirement that trainers can also create/update missions.
- `PATCH /api/missions/:id/status` from the assignment is missing; only GET/POST/PUT/DELETE are wired in `backend/src/api/missions/index.ts`.
- Backend `mission.service.ts` writes `creatorId`, queries `creator`, `_count.missionResults`, and filters on `completed`, none of which exist in the Prisma schema (`createdBy`, relation `results`, boolean `isCompleted`). TypeScript compilation and runtime DB calls will fail, so even the implemented endpoints cannot persist or return missions.

### Player Progress Tracking (Req. 1.B)
- The player list UI expects RPG-style fields (`level`, `experiencePoints`, `totalMissionsCompleted`, etc.) defined in `frontend/types/index.ts`, but `player_profiles` only tracks rank/winRate/averageScore. The backend never returns the properties that the cards render, so the page displays undefined data.
- Player detail and progress views are unimplemented: `frontend/app/dashboard/players/[id]/page.tsx` is a placeholder, so there is no mission history, charts, or trend analysis as required.
- Backend services again reference non-existent columns (`missionResult.completed`, `mission.totalScore`, `details`, nullable `completedAt`). `recordMissionResult` even sets `completedAt: null` despite the column being non-nullable. Consequently `/api/players/:id`, `/progress`, `/stats`, and leaderboard logic cannot run successfully.
- `playerIdSchema` enforces UUIDs, but Prisma generates `cuid()` IDs. Valid IDs will therefore fail validation and never reach the controller.

### RBAC & Authentication (Req. 1.C & 2.B)
- User roles do not line up between frontend and backend. The UI enum uses `PLAYER` while the API emits `LEARNER` (`frontend/types/index.ts` vs `schema.prisma`). Learner logins therefore receive a role value that none of the navigation/permission checks recognize, hiding all routes for the learner persona.
- The login page bypasses `AuthProvider` and stores `response.data.data.accessToken`, yet the backend returns tokens under `tokens`. Because `localStorage` never receives the token, `authService.isAuthenticated()` returns false and `ProtectedRoute` continuously redirects, preventing any authenticated screen from loading.
- `authService.register` calls `/auth/register`, but no such route exists (`backend/src/api/auth/auth.routes.ts`). Self-service registration and the assignment’s “user management” story are therefore missing.

### Real-Time Dashboard (Req. 1.D)
- The activity feed component polls `GET /api/activity/recent`, but the Express app constructed in `backend/src/app.ts` only mounts `/api/auth|missions|players|analytics`. The only implementation of `/api/activity/recent` lives in `server.simple.ts`, which is never booted by `npm run dev`. As shipped, the “live activity feed” fails immediately and there is no WebSocket/polling fallback tied to actual data.
- No other real-time surface (recent completions, presence) has been implemented beyond optimistic polling placeholders on the dashboard.

### API / Data Model Quality (Req. 2 & 3)
- Mission and player services each instantiate their own `PrismaClient` instead of reusing the shared `prisma` from `config/database.ts`, multiplying DB connections in a long-lived server.
- Caching requirements are only half-met: user sessions and analytics responses are cached, but there is no caching/invalidation around mission lists or published missions as requested in section 2.D.
- Leaderboard endpoints are mismatched. The backend exposes `/api/players/leaderboard` returning a plain array, while the frontend calls `/leaderboard` and `/leaderboard/me` expecting `{ rankings, metric, period }`. The page will always error, and there is no “my rank” endpoint at all.

### DevOps & Docs (Req. 4)
- Docker files exist but are boilerplate; because the TypeScript sources reference non-existent Prisma relations/fields, `npm run build` would fail inside those images. Deployment documentation does not mention running Prisma migrations or seeding inside the containers.

## Outstanding / Incorrect Items
1. Align the data model across frontend/backed: add mission objectives/scenarios tables or remove those UI expectations; rename `duration` vs `estimatedDuration`, `LEARNER` vs `PLAYER`, etc.
2. Rebuild mission services to use the actual schema fields (`createdBy`, `results`, `isCompleted`) and expose the required `PATCH /missions/:id/status` action.
3. Implement the player profile detail/progress pages and fix the player API to stop referencing non-existent columns. Adjust validation to accept `cuid()` IDs.
4. Fix authentication flow by using `AuthProvider` on the login form, storing the right token keys, and supporting the required `/auth/register` route (or updating docs to clarify that registration is admin-only).
5. Deliver the real-time dashboard requirement by either wiring `/api/activity/recent` into the primary server with proper polling/websocket support or updating ActivityFeed to consume existing analytics endpoints.
6. Update leaderboard routes so both sides agree on URL and payload shape, and provide trainer/learner-friendly summaries (my rank, filters).
7. Cache published mission lists in Redis (with invalidation) as required in section 2.D of the assignment.

## Recommendations / Next Actions
- Decide on the canonical schema, regenerate Prisma types, and refactor both backend services and frontend models in lockstep.
- Add missing API endpoints (`PATCH /missions/:id/status`, `/auth/register`, `/leaderboard/me`, `/activity/recent`) or update the frontend to match whatever contract you define.
- Flesh out the learner experience: role constants, navigation, player detail view, and mission start workflow need to function for the third persona mentioned in the assignment.
- Once the data/API mismatches are resolved, add integration tests (or at least manual verification scripts) so regressions like “field does not exist” are caught before shipping.
