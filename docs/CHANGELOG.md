# Changelog - Maritime Training Mission Control Dashboard

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Phase 4: Advanced Features & Polish
*Next Up - Target: Day 5+*

#### Planned
- Mission execution and attempt tracking
- Real-time WebSocket updates for live activity
- Advanced analytics dashboard with charts
- File upload for avatars and mission assets
- Notification system for mission completion

---

## [0.5.0] - 2025-11-24

### Phase 3.5: Analytics Dashboard & Bug Fixes
*✅ COMPLETED*

#### Fixed - Analytics Dashboard (2025-11-24)
**Commit**: cb734b7 - feat: implement analytics dashboard with mission distribution charts

**Issue**: Analytics page showed empty pie charts and "No data available" for mission distributions.

**Root Causes**:
1. Missing chart component file (`frontend/components/dashboard/charts.tsx`)
2. Backend analytics endpoint querying wrong mission types (hardcoded `['NAVIGATION', 'COMBAT', 'RESCUE', 'PATROL']` instead of actual enum values `PVE`, `PVP`)

**Solutions**:
- Created `MissionDistributionChart` component (89 lines)
  - Recharts library integration (PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip)
  - Loading and empty state handling
  - Custom tooltips and labels with sci-fi theme styling
  - Reusable component with props (title, data, dataKey, colors)

- Fixed backend analytics endpoint (`server.simple.js:1865-1911`)
  - Changed from hardcoded mission types to dynamic `groupBy` query
  - Now queries actual database enum values
  - Properly transforms aggregation results for frontend consumption

**Testing**:
- Backend health check: ✅ Passed
- Database query: PVE (6 missions), PVP (2 missions)
- Both difficulty and type distributions now display correctly
- Charts render with proper data and styling

**Impact**:
- ✅ Analytics dashboard fully functional
- ✅ Mission distribution charts display real data
- ✅ Statistics generation working correctly
- ✅ Unblocks analytics feature completion

#### Fixed - Player Profile Username Display (2025-11-23)
**Commit**: 2c1e8a4 - fix: display player username instead of user ID in profile

**Issue**: Player profile page showed user ID (cuid format) instead of username in the header.

**Root Cause**: Backend service returned nested user object structure, frontend displayed `user.id` instead of `user.username`.

**Solution**:
- Modified `backend/src/api/players/players.service.ts` (line 178)
  - Added `username: profile.username` to returned user object
  - Ensures username is available at top level for frontend access
- Frontend correctly accesses `player.user.username` in page.tsx

**Testing**: Verified player profile displays username correctly in header

---

## [0.4.1] - 2025-11-23

### Critical Bug Fixes

#### Fixed - Dashboard Rendering (2025-11-23)
**Commit**: 9e7cfc3 - fix: remove placeholder dashboard stub blocking real dashboard

**Issue**: After login, users saw "Welcome to Mission Control / Login successful! Dashboard coming soon..." instead of the actual dashboard.

**Root Cause**:
- Placeholder stub file `app/dashboard/page.tsx` was intercepting `/dashboard` route
- `app/page.tsx` redirects authenticated users to `/dashboard` (line 16)
- Next.js served the stub instead of the real dashboard at `(dashboard)/page.tsx`
- Real dashboard with analytics, stats, and ActivityFeed never loaded

**Solution**:
- Deleted `frontend/app/dashboard/page.tsx` (13 lines)
- Removed empty `frontend/app/dashboard/` directory
- Now `/dashboard` correctly routes to `(dashboard)/page.tsx`

**Impact**:
- ✅ Dashboard now displays real metrics and stat cards
- ✅ Activity feed renders with polling
- ✅ All navigation links work correctly
- ✅ Unblocks all browser testing and user verification

---

## [0.4.0] - 2025-11-23

### Phase 3: Complete Implementation
*✅ COMPLETED - Day 3*

#### Major Achievement
**Commit**: bc3dfe0 - Complete Phase 3: mission forms, player pages, analytics

Three parallel development streams executed with zero conflicts (~1700 insertions, 27 files changed). All FS Job Assignment core requirements completed.

#### Agent 1: Mission Forms & CRUD
- Created Mission create/edit forms with React Hook Form + Zod validation
- Created shared MissionForm component with RBAC (ADMIN/TRAINER)
- Updated backend mission schema to match Prisma exactly
- Backend CRUD endpoints validated: POST/PUT/DELETE /api/missions

#### Agent 2: Player Management System
- Created Player list and detail pages with charts (Recharts)
- Created PlayerCard and ProgressChart components
- Implemented 3 new backend endpoints:
  - GET /api/players (list with pagination)
  - GET /api/players/:id (profile with stats)
  - GET /api/players/:id/progress (mission history)
- Full RBAC integration: ADMIN/TRAINER see all, LEARNER sees own

#### Agent 3: Analytics & Dashboard Integration
- Fixed analytics service schema bugs (completed→isCompleted, table names)
- Integrated real-time dashboard metrics (TanStack Query, 30s refresh)
- Replaced hardcoded stats with live data from database

#### FS Job Assignment Requirements Status
- ✅ Mission Management Dashboard (Section A): COMPLETE
- ✅ Player Progress Tracking (Section B): COMPLETE
- ✅ RBAC (Section C): FULLY IMPLEMENTED
- ✅ Real-Time Dashboard (Section D): COMPLETE

#### Mission Management UI Discovery (2025-11-23)
**Commit**: d0df2cc - documentation

Previously implemented but undocumented:

- **Missions List Page**
  - Location: `frontend/app/(dashboard)/missions/page.tsx` (255 lines)
  - TanStack Query data fetching with `/missions` endpoint
  - Status filter (DRAFT, ACTIVE, COMPLETED, ARCHIVED)
  - Difficulty filter (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)
  - Full-text search on mission titles
  - Pagination controls (Previous/Next with page numbers)
  - Items per page selector (10/25/50)
  - RBAC: Create button visible only for ADMIN/TRAINER roles
  - Loading states with animated spinner
  - Error handling with user-friendly messages
  - Mission cards with color-coded difficulty and status badges
  - Icon components (Clock, Target, Users)
  - Dark theme styling with hover effects

- **Mission Detail Page**
  - Location: `frontend/app/(dashboard)/missions/[id]/page.tsx` (288 lines)
  - Dynamic routing with mission ID parameter
  - TanStack Query data fetching for single mission
  - Back navigation button
  - Status and difficulty badges (color-coded)
  - RBAC checks: Edit button for ADMIN/TRAINER, Start button for PLAYER
  - Mission info cards (Duration, Passing Score, Max Attempts)
  - Objectives list display
  - Mission statistics and metadata
  - Utility functions: `formatDate`, `formatDuration`, `getDifficultyColor`, `getStatusColor`
  - Loading and error states

#### Frontend Core Features
- **Authentication System**
  - Login page with JWT authentication
  - Auth context provider with auto-refresh
  - Protected route wrapper with role checking
  - Logout functionality with token cleanup

- **API Integration**
  - Axios client with interceptors
  - Automatic auth header injection
  - Token refresh on 401 errors
  - TanStack Query setup for caching

- **Dashboard Layout**
  - Responsive sidebar navigation
  - Role-based menu filtering
  - User profile section
  - Collapsible sidebar for mobile

- **Mission Pages**
  - Mission list with pagination and filtering
  - Mission detail page with full information
  - Mission cards with statistics
  - Role-based action buttons

- **Player Pages**
  - Player list (ADMIN/TRAINER only)
  - Leaderboard with rankings
  - Player cards with XP progress
  - Performance statistics display

#### Technical Implementation
- Next.js 15 App Router with Server Components
- TypeScript with 100% type coverage
- Tailwind CSS with dark sci-fi theme
- React Hook Form + Zod for validation
- Production build successful (102 kB First Load)

---

## [0.3.1] - 2025-11-23

### Phase 2.5: Frontend Integration

#### Added - Activity Feed Component
**Commit**: eda27c8

- Real-time polling component with 10-second intervals
- Connects to GET /api/activity/recent backend endpoint
- Delta updates using 'since' parameter for efficiency
- Activity type indicators (MISSION_CREATED, MISSION_UPDATED)
- Relative timestamp formatting (just now, X mins/hours/days ago)
- Live status indicator with pulse animation
- Loading states and comprehensive error handling
- Integrated into dashboard page

#### Fixed
- Login page hydration error from nested `<p>` tags
- Login redirect routing from /dashboard to / (route group)
- Dashboard page routing to use (dashboard) route group structure

#### Technical Details
- Activity feed uses axios with localStorage JWT authentication
- Automatic polling cleanup on component unmount
- Responsive UI with hover states and smooth transitions
- Error boundary for failed API calls

---

## [0.3.0] - 2025-11-22

### Phase 2: Core Backend APIs
*✅ COMPLETED - Day 2*

#### Added - Mission APIs
- **Mission CRUD Endpoints**
  - `GET /api/missions` - List missions with pagination, filtering, and role-based visibility
  - `GET /api/missions/:id` - Get mission details with creator info and top results
  - `GET /api/missions/:id/stats` - Mission statistics and analytics
  - `POST /api/missions` - Create new mission (ADMIN/TRAINER)
  - `PUT /api/missions/:id` - Update mission (ADMIN/TRAINER with ownership check)
  - `DELETE /api/missions/:id` - Soft delete mission (ADMIN only)
  - `PATCH /api/missions/:id/status` - Update mission status (ADMIN/TRAINER with RBAC)

- **Mission Validation Schemas** (Zod)
  - Create/update mission validation
  - Query parameter validation
  - Mission type, difficulty, and status enums

- **Mission Service Layer**
  - Pagination and filtering logic
  - Role-based data visibility
  - Statistics aggregation
  - Ownership verification

#### Added - Player APIs
- **Player Management Endpoints**
  - `GET /api/players` - List players with pagination and search (ADMIN/TRAINER)
  - `GET /api/players/:id` - Get player profile with role-based access
  - `GET /api/players/me` - Get current user's player profile
  - `GET /api/players/:id/progress` - Player mission history with filtering
  - `GET /api/players/:id/stats` - Detailed player statistics
  - `GET /api/players/leaderboard` - Public leaderboard
  - `PUT /api/players/:id` - Update player profile (ADMIN or own profile)
  - `POST /api/players/:id/progress` - Record mission result (ADMIN/TRAINER)

- **Player Validation Schemas** (Zod)
  - Profile update validation
  - Mission result recording
  - Query parameter validation

- **Player Service Layer**
  - Automatic stats calculation
  - Performance metrics aggregation
  - Leaderboard generation
  - Permission checking

#### Added - Analytics APIs
- **Analytics Endpoints**
  - `GET /api/analytics/overview` - Dashboard metrics with role-based filtering
  - `GET /api/analytics/missions/:id` - Detailed mission analytics (ADMIN/TRAINER)
  - `GET /api/analytics/players/:id` - Player performance analytics
  - `GET /api/analytics/trending` - Trending missions based on recent activity

- **Analytics Service Layer**
  - Redis caching with 5-minute TTL
  - Complex aggregations using Prisma raw queries
  - Score and time distributions
  - Performance insights and trends
  - Progress over time tracking

#### Added - Backend Endpoint Development
- **Redis Caching for Missions Endpoint** (commit: 2c99e2c)
  - Implemented read-through caching with 5-minute TTL for GET /api/missions
  - Query parameter-based cache keys for filtered/paginated results
  - Automatic cache invalidation on POST, PUT, DELETE, and PATCH operations
  - Redis client configuration with retry strategy and connection monitoring
  - Cache hit/miss logging for performance monitoring

- **GET /api/activity/recent Endpoint** (commit: a2b7750)
  - Polling-based activity feed endpoint
  - Timestamp-based filtering with 'since' parameter for delta updates
  - Configurable result limit (default: 20 activities)
  - Activity type detection (MISSION_CREATED vs MISSION_UPDATED)
  - Formatted activity messages with mission titles and status

#### Fixed
- Prisma enum mismatches in seed data (commit: 6bbcf65)
  - Changed BEGINNER → EASY to match schema.prisma Difficulty enum
  - Updated all test data to use correct enum values

#### Technical Implementation
- Full RBAC enforcement across all endpoints
- Consistent error handling and validation
- Optimized database queries with proper indexing
- Redis caching for expensive analytics queries
- Comprehensive TypeScript types
- Modular service/controller/route architecture

#### Testing
- Comprehensive RBAC testing for PATCH endpoint with all user roles
- Redis cache validation: MISS → HIT → invalidate → MISS cycle
- Activity feed polling with timestamp-based delta queries
- All tests passing with Playwright and curl-based validation

---

## [0.2.0] - 2025-11-22

### Phase 1: Foundation & Infrastructure
*✅ COMPLETED - Day 1*

#### Added - Backend
- **Prisma Schema**: Complete data models (User, PlayerProfile, Mission, MissionResult)
  - User model with role-based authentication (ADMIN, TRAINER, LEARNER)
  - PlayerProfile with performance metrics (winRate, averageScore, missionsCompleted)
  - Mission model with difficulty, type, status, and learning objectives
  - MissionResult model tracking player completion data
  - Proper indexes for query optimization
  - Soft delete support via `deletedAt` field

- **Authentication System**
  - JWT service with access token (24h) and refresh token (7d)
  - Auth middleware for protected routes
  - RBAC middleware (authorize, isAdmin, isAdminOrTrainer, isAuthenticated)
  - httpOnly cookie configuration for security
  - Token rotation on refresh
  - Rate limiting on auth endpoints (5 attempts/15 minutes)

- **Backend Infrastructure**
  - Express.js server with TypeScript
  - Prisma Client generation and configuration
  - Redis cache service (ioredis) with TTL support
  - Security middleware: Helmet, CORS, rate limiting
  - Error handling middleware with consistent JSON responses
  - Validation middleware using Zod schemas
  - Database connection management with graceful shutdown

- **Auth API Endpoints**
  - `POST /api/auth/login` - User authentication with email/password
  - `POST /api/auth/logout` - Session invalidation
  - `POST /api/auth/refresh` - Access token refresh
  - `GET /api/auth/me` - Current user profile
  - `GET /health` - Health check endpoint

- **Database Seed**
  - 3 default users with bcrypt-hashed passwords (salt rounds=10)
    - admin@navytraining.sg / Admin123!
    - trainer@navytraining.sg / Trainer123!
    - cadet.tan@navytraining.sg / Cadet123!
  - 3 sample missions (Singapore maritime context)
    - Marina Bay Navigation (EASY)
    - Singapore Strait Patrol (MEDIUM)
    - Jurong Port Defense (HARD)
  - Sample mission results and player progress data

#### Added - Frontend
- **Next.js 15 Configuration**
  - App Router structure
  - TypeScript with strict mode
  - Path aliases (@/components, @/lib, @/hooks, @/types)
  - Environment variable setup (NEXT_PUBLIC_API_URL, NEXT_PUBLIC_WS_URL)

- **Tailwind CSS Dark Sci-Fi Theme**
  - Custom color palette (primary, secondary, dark shades)
  - Maritime-inspired design system
  - Rajdhani font family (body text)
  - Orbitron font family (display headings)
  - Custom component styles (buttons, cards, inputs, badges, tables)
  - Sci-fi effects (glow shadows, grid patterns, animations)
  - Responsive breakpoints and utilities

- **UI Components & Styles**
  - Global CSS with dark theme background
  - Grid pattern SVG background
  - Custom scrollbar styles
  - Loading spinner animation
  - Gradient text effects
  - Glass morphism utilities
  - Home page with feature showcase

#### Added - Infrastructure
- **Docker Configuration**
  - docker-compose.yml with 4 services (backend, frontend, postgres, redis)
  - Backend Dockerfile with Node 18+
  - Frontend Dockerfile with Next.js optimization
  - Volume mappings for data persistence
  - Network configuration for service communication

- **Environment Setup**
  - Complete .env file with all required variables
  - Database URL configuration
  - Redis connection settings
  - JWT secrets configuration
  - CORS and security settings

#### Technical Details
- **Backend Dependencies**
  - express ^4.21.1
  - @prisma/client ^5.22.0
  - bcrypt ^5.1.1 (salt rounds=10)
  - jsonwebtoken ^9.0.2
  - ioredis ^5.4.1
  - zod ^3.23.8
  - helmet ^8.0.0
  - cors ^2.8.5
  - express-rate-limit ^7.4.1
  - cookie-parser ^1.4.7

- **Frontend Dependencies**
  - next ^15.0.4
  - react ^19.0.0
  - @tanstack/react-query ^5.62.8
  - react-hook-form ^7.54.0
  - tailwindcss ^3.4.16
  - zod ^3.23.8

#### Fixed
- TypeScript compilation errors in JWT service
- Unused parameter warnings in middleware
- Prisma schema location (moved to /backend/prisma/)
- Import type assertions for JWT SignOptions

#### Security
- bcrypt password hashing with 10 salt rounds
- httpOnly cookies for JWT tokens
- Rate limiting on authentication endpoints
- CORS whitelist configuration
- Helmet security headers
- Input validation with Zod schemas

#### Configuration
- Backend compiles successfully with `npm run build`
- Prisma client generated successfully
- Frontend dependencies installed
- All TypeScript configurations validated

---

## [0.1.0] - 2025-11-22

### Added
- Project initialization
- Base folder structure as per CLAUDE.md constraints
- Documentation files:
  - PRD.md (Product Requirements Document)
  - system-architecture.md
  - api-swagger.md
  - erd.md (Entity Relationship Diagram)
  - folder-structure.md
  - style.md (UI theme configuration)
  - README.md

### Project Setup
- Frontend: Next.js 15+ with App Router structure
- Backend: Express.js with TypeScript
- Database: PostgreSQL with Prisma ORM
- Cache: Redis for sessions
- Containerization: Docker Compose

### Configuration
- CLAUDE.md implementation guidelines
- Strict technology constraints defined
- MVP-first development strategy
- Dark sci-fi UI theme (mission-control-life-support palette)

---

## Version History

### Versioning Strategy
- **0.x.x** - Development/MVP phase
- **1.0.0** - First production release with core features
- **1.x.x** - Feature additions and enhancements
- **2.0.0** - Major architectural changes (if needed)

### Release Milestones
- **v0.1.0** - Project setup and documentation
- **v0.2.0** - Foundation & Infrastructure (Phase 1)
- **v0.3.0** - Core Backend APIs (Phase 2)
- **v0.4.0** - Frontend Foundation (Phase 3)
- **v0.5.0** - Analytics Dashboard & Bug Fixes (Phase 3.5)
- **v0.6.0** - Advanced Features (Phase 4)
- **v1.0.0** - Production Release (Phase 5)

---

## Change Categories

### Added
New features or capabilities

### Changed
Changes in existing functionality

### Deprecated
Soon-to-be removed features

### Removed
Removed features

### Fixed
Bug fixes

### Security
Security vulnerability fixes

---

## Commit Convention

All commits follow conventional commit format:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only changes
- `style:` Changes that don't affect code meaning
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `perf:` Performance improvement
- `test:` Adding missing tests
- `chore:` Changes to build process or auxiliary tools

---

## Notes

- All changes must comply with CLAUDE.md constraints
- No unauthorized technology additions
- MVP features only until explicitly approved
- Maintain backward compatibility where possible
- Document breaking changes prominently

---

*This changelog is maintained as part of the Maritime Training Mission Control Dashboard project for Singapore's defense education sectors.*
