# Mission Control Dashboard - Outstanding Tasks

**Last Updated**: November 25, 2025 14:15 SGT
**Source**: Third-party audit (FINDINGS.md) + Internal MVP review

---

## =� CRITICAL (Pre-Deployment Blockers)

### Security & Deployment Issues

- [ ] **FIX-001: Remove hardcoded API URLs (DEPLOYMENT BLOCKER)**
  - **Priority**: =% Critical
  - **Impact**: Application fails in production/staging environments
  - **Files**:
    - `frontend/components/dashboard/ActivityFeed.tsx:43-70`
    - `frontend/app/auth/login/page.tsx:33-76`
  - **Action**: Replace hardcoded `http://localhost:4000` with shared API client
  - **Reference**: FINDINGS.md Line 32
  - **Status**: � Pending

- [ ] **FIX-002: Secure Activity Feed endpoint (SECURITY VULNERABILITY)**
  - **Priority**: =% Critical
  - **Impact**: Public API exposes sensitive training data
  - **Files**: `backend/src/api/activity/*`
  - **Action**: Add authentication middleware to `/api/activity/recent`
  - **Reference**: FINDINGS.md Line 44
  - **Status**: � Pending

- [ ] **FIX-003: Restrict mission creation to ADMIN only (RBAC VIOLATION)**
  - **Priority**: =% Critical
  - **Impact**: TRAINER role can bypass authorization via direct API calls
  - **Files**: `backend/src/api/missions/index.ts:51-62`
  - **Action**: Change `isAdminOrTrainer` to `isAdmin` for POST /api/missions
  - **Reference**: FINDINGS.md Line 19
  - **Status**: � Pending

- [ ] **FIX-004: Fix rate limiting collision (PRODUCTION STABILITY)**
  - **Priority**: =% Critical
  - **Impact**: Dashboard shows 429 errors and blank charts in production
  - **Files**: `backend/dist/app.js:31-41`, polling components
  - **Action**: Either increase rate limit (100�300 req/15min) OR reduce polling frequency
  - **Options**:
    - Option A: Increase global rate limit to 300 req/15min
    - Option B: Reduce analytics polling from 30s to 60s, activity feed from 10s to 30s
    - Option C: Implement request batching/aggregation
  - **Reference**: FINDINGS.md Line 31
  - **Status**: � Pending

---

##  HIGH PRIORITY (MVP Completion)

### Player Detail Page Implementation

- [x] **MVP-001: Implement Player Detail Page with mission history**
  - **Priority**: � High (MVP requirement)
  - **Impact**: Core feature implemented successfully
  - **Files**: `frontend/app/dashboard/players/[id]/page.tsx` (446 lines implemented)
  - **Backend Ready**: `backend/src/services/player.service.ts:210-315`
  - **Requirements**:
    - Mission history table with scores, timeSpent, completedAt ✅
    - Pagination for mission results (10 per page) ✅
    - Link to mission detail pages ✅
  - **Status**: ✅ Completed (November 25, 2025)

- [x] **MVP-002: Add performance trend charts to Player Detail Page**
  - **Priority**: � High (MVP requirement)
  - **Impact**: Analytics visualization implemented
  - **Requirements**:
    - Performance trend visualization (last 30 days) ✅
    - Daily missions count and completion tracking ✅
    - Average score display per day ✅
  - **Backend Ready**: SQL trend queries exist in player.service.ts
  - **Status**: ✅ Completed (November 25, 2025)

- [x] **MVP-003: Add current mission status to Player Detail Page**
  - **Priority**: � High (MVP requirement)
  - **Requirements**:
    - Active missions count displayed ✅
    - Stats card showing active missions ✅
    - Visual indicator with warning color ✅
  - **Status**: ✅ Completed (November 25, 2025)

- [ ] **MVP-004: Test Player Detail Page functionality**
  - **Priority**: � High
  - **Test Cases**:
    - Load player with mission history
    - Load player with no history
    - Charts render correctly
    - Pagination works
    - All roles (ADMIN, TRAINER, LEARNER) can view
  - **Status**: � Pending

- [x] **MVP-005: Build and deploy updated application**
  - **Priority**: � High
  - **Dependencies**: MVP-001, MVP-002, MVP-003 completed
  - **Actions**:
    - Frontend: `docker-compose build frontend` ✅
    - Deploy: `docker-compose up -d` ✅
    - All services running and healthy ✅
  - **Status**: ✅ Completed (November 25, 2025)

---

## =� MEDIUM PRIORITY (Post-MVP Enhancements)

### Leaderboard Improvements

- [ ] **ENH-001: Fix leaderboard period filtering logic**
  - **Priority**: � Medium
  - **Impact**: Period filters (weekly/monthly/all-time) show static results
  - **Files**: `backend/src/api/leaderboard/leaderboard.service.ts:37-47`
  - **Action**: Use `mission_results.completedAt` instead of `playerProfile.updatedAt`
  - **Reference**: FINDINGS.md Line 27
  - **Status**: � Pending

- [ ] **ENH-002: Handle "My Rank" for ADMIN/TRAINER users**
  - **Priority**: � Medium
  - **Impact**: Error toasts for admin/trainer viewing leaderboard
  - **Files**: `backend/src/api/leaderboard/leaderboard.controller.ts:21-46`
  - **Action**: Return graceful message when user lacks PlayerProfile
  - **Reference**: FINDINGS.md Line 28
  - **Status**: � Pending

### Caching & Performance

- [ ] **ENH-003: Implement mission list caching**
  - **Priority**: � Medium
  - **Impact**: Requirement 2.D from PRD unmet
  - **Files**: `backend/src/services/cache.service.ts`
  - **Action**: Add Redis caching for `/api/missions` with invalidation on updates
  - **Reference**: FINDINGS.md Line 36
  - **Status**: � Pending

- [ ] **ENH-004: Add backoff/retry to polling requests**
  - **Priority**: � Medium
  - **Impact**: Activity feed polls forever even during errors
  - **Files**: `frontend/components/dashboard/ActivityFeed.tsx`
  - **Action**: Implement exponential backoff on fetch errors
  - **Reference**: FINDINGS.md Line 37
  - **Status**: � Pending

### Analytics & Reporting

- [ ] **ENH-005: Create mission-specific analytics page**
  - **Priority**: � Medium
  - **Impact**: PRD requirement unimplemented
  - **Files**: New file - `frontend/app/dashboard/analytics/missions/[id]/page.tsx`
  - **Backend Ready**: `/api/analytics/missions/:id` exists
  - **Reference**: FINDINGS.md Line 33
  - **Status**: � Pending

- [ ] **ENH-006: Create player analytics page**
  - **Priority**: � Medium
  - **Impact**: PRD requirement unimplemented
  - **Files**: New file - `frontend/app/dashboard/analytics/players/[id]/page.tsx`
  - **Backend Ready**: `/api/analytics/players/:id` exists
  - **Reference**: FINDINGS.md Line 33
  - **Status**: � Pending

### Mission Detail Enhancements

- [ ] **ENH-007: Add player completion stats to mission detail page**
  - **Priority**: � Medium
  - **Impact**: Mission detail only shows aggregate `_count`
  - **Files**: `frontend/app/dashboard/missions/[id]/page.tsx`
  - **Action**: Add table showing all player results with scores, times, completion status
  - **Reference**: FINDINGS.md Line 20
  - **Status**: � Pending

---

## 9 LOW PRIORITY (Future Enhancements)

- [ ] **FUTURE-001: Add mission template system**
  - Reusable mission templates for common scenarios

- [ ] **FUTURE-002: Batch player import/export**
  - CSV/Excel import for bulk player creation
  - Export player data for external reporting

- [ ] **FUTURE-003: Email notifications**
  - Mission assignment notifications
  - Completion alerts
  - Performance reports

- [ ] **FUTURE-004: Mobile responsive improvements**
  - Enhanced mobile navigation
  - Touch-optimized charts
  - Progressive Web App (PWA) support

- [ ] **FUTURE-005: Multi-language support (i18n)**
  - English, Chinese, Malay language options
  - Localized content for Singapore context

---

##  COMPLETED

- [x] **DONE-001: Implement soft delete for missions**
  - Completed: November 25, 2025
  - Commit: 5369c07

- [x] **DONE-002: Update README.md with comprehensive documentation**
  - Completed: November 25, 2025
  - Commit: ed96415
  - Added: Database schema, environment variables, API examples, known issues

- [x] **DONE-003: MVP-001 - Implement Player Detail Page with mission history**
  - Completed: November 25, 2025
  - File: `frontend/app/dashboard/players/[id]/page.tsx` (446 lines)
  - Features: Mission history table, pagination (10 per page), links to mission details

- [x] **DONE-004: MVP-002 - Add performance trend charts to Player Detail Page**
  - Completed: November 25, 2025
  - Features: Last 30 days performance visualization, daily stats, average scores

- [x] **DONE-005: MVP-003 - Add current mission status to Player Detail Page**
  - Completed: November 25, 2025
  - Features: Active missions stats card with count and visual indicator

- [x] **DONE-006: MVP-005 - Build and deploy updated application**
  - Completed: November 25, 2025
  - Actions: Frontend rebuilt and deployed, all services running

---

## =� Progress Summary

| Category | Total | Completed | Pending | Completion % |
|----------|-------|-----------|---------|--------------|
| Critical | 4 | 0 | 4 | 0% |
| High Priority (MVP) | 5 | 4 | 1 | 80% |
| Medium Priority | 7 | 0 | 7 | 0% |
| Low Priority | 5 | 0 | 5 | 0% |
| **TOTAL** | **21** | **4** | **17** | **19%** |

**Recently Completed**: 4 MVP tasks (Player Detail Page implementation, performance trends, active missions display, build & deploy)
**Completed Previously**: 2 tasks (soft delete, README.md)
**Pending Testing**: MVP-004 (Player Detail Page functionality testing) - awaiting user validation

---

## <� Recommended Execution Order

### Phase 1: Security & Deployment (CRITICAL - Complete before any deployment)
1. FIX-001: Remove hardcoded API URLs
2. FIX-002: Secure activity feed endpoint
3. FIX-003: Restrict mission creation RBAC
4. FIX-004: Fix rate limiting collision

### Phase 2: MVP Completion (HIGH - Feature parity)
5. MVP-001: Player Detail Page with history
6. MVP-002: Performance trend charts
7. MVP-003: Current mission status
8. MVP-004: Test Player Detail Page
9. MVP-005: Build and deploy

### Phase 3: Post-MVP Enhancements (MEDIUM - Quality improvements)
10. ENH-001 � ENH-007: Leaderboard, caching, analytics pages

### Phase 4: Future Features (LOW - Nice-to-have)
11. FUTURE-001 � FUTURE-005: Templates, i18n, notifications

---

## =� Notes

- All findings validated from third-party audit (docs/FINDINGS.md)
- Critical fixes MUST be completed before production deployment
- MVP features required to satisfy job assignment requirements
- Medium priority items improve UX but are not blocking
- Low priority items are future enhancements beyond current scope

**Last Reviewed**: November 25, 2025 14:15 SGT - Player Detail Page MVP completed and deployed
