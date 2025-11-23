# Changelog

All notable changes to the Mission Control Dashboard project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Phase 2 - Frontend Integration (2025-11-23)

#### Added
- **Activity Feed Component** (commit: eda27c8)
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

### Phase 1 - Backend Endpoint Development (2025-11-23)

#### Added
- **Redis Caching for Missions Endpoint** (commit: 2c99e2c)
  - Implemented read-through caching with 5-minute TTL for GET /api/missions
  - Query parameter-based cache keys for filtered/paginated results
  - Automatic cache invalidation on POST, PUT, DELETE, and PATCH operations
  - Redis client configuration with retry strategy and connection monitoring
  - Cache hit/miss logging for performance monitoring

- **PATCH /api/missions/:id/status Endpoint** (commit: 1eec98c)
  - New endpoint for updating mission status (DRAFT, ACTIVE, ARCHIVED)
  - Role-based access control (RBAC):
    - ADMIN: Can change status of any mission
    - TRAINER: Can only change status of their own missions
    - LEARNER: No permission to change mission status
  - Input validation for status values
  - Ownership validation for trainers
  - Automatic cache invalidation after status updates

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

#### Testing
- Comprehensive RBAC testing for PATCH endpoint with all user roles
- Redis cache validation: MISS → HIT → invalidate → MISS cycle
- Activity feed polling with timestamp-based delta queries
- All tests passing with Playwright and curl-based validation

---

## Previous Releases

### Initial Development
- Project setup with Next.js frontend and Express.js backend
- PostgreSQL database with Prisma ORM
- JWT authentication system
- Basic mission CRUD endpoints
- Docker containerization for PostgreSQL and Redis
