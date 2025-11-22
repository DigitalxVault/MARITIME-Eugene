# Changelog - Maritime Training Mission Control Dashboard

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Phase 4: Advanced Features
*Next Up - Target: Day 4*

#### Planned
- Mission create/edit forms with validation
- Mission execution and attempt tracking
- Real-time WebSocket updates for live activity
- Advanced analytics dashboard with charts
- File upload for avatars and mission assets
- Notification system for mission completion

---

## [0.4.0] - 2024-11-22

### Phase 3: Frontend Foundation
*✅ COMPLETED - Day 3*

#### Added - Frontend Core
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

#### Session Checkpoint
- All three phases completed in single session
- Database seeded and operational
- Frontend and backend fully integrated
- Ready for testing and Phase 4 development

---

## [0.3.0] - 2024-11-22

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

#### Technical Implementation
- Full RBAC enforcement across all endpoints
- Consistent error handling and validation
- Optimized database queries with proper indexing
- Redis caching for expensive analytics queries
- Comprehensive TypeScript types
- Modular service/controller/route architecture

---

## [0.2.0] - 2024-11-22

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

## [0.1.0] - 2024-11-22

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
- **v0.5.0** - Core Frontend Features (Phase 4)
- **v0.6.0** - Dashboard & Real-time (Phase 5)
- **v1.0.0** - Production Release (Phase 6)

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