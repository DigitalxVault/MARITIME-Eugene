# PRD — Mission Control Dashboard for Maritime Training

## 1. Overview
The Mission Control Dashboard is a secure, scalable, and user-friendly web application designed for Singapore's maritime training sector, including defense and higher-education institutions such as SAF, NUS, NTU, and maritime academies. The platform enables administrators and trainers to manage training missions, monitor trainee progress, analyze learning outcomes, and enforce strict role-based access control.

The system will be built using a React/Next.js frontend, Node.js/Express backend, PostgreSQL (via Prisma), Redis, and secure JWT-based authentication. It must support real-time or near-real-time updates and meet Singapore's security, reliability, and PDPA-aligned requirements.

---

## 2. Goals & Objectives

### Primary Goals
- Provide mission planning, management, and analytics for maritime training simulations.
- Support trainers and administrators in monitoring cadet performance.
- Implement secure access control for ADMIN, TRAINER, and LEARNER roles.
- Enable real-time visibility of mission activity.

### Secondary Goals
- Deliver an intuitive and responsive UI suitable for tablets and desktops.
- Implement optional AI enhancement features for auto-generated mission descriptions or difficulty assessment.
- Provide modular, scalable architecture to support future training modules.

---

## 3. Target Users

### Administrator (ADMIN)
- Full control of missions, players, analytics, and user management.

### Trainer (TRAINER)
- Limited mission editing within assigned scope.
- Full visibility of assigned learners' performance and mission outcomes.

### Learner (LEARNER)
- View-only access to their own mission history and results.

---

## 4. System Features

### 4.1 Frontend — Next.js

#### Tech Stack
- Next.js 15+ (App Router)
- React 19+ with modern hooks
- TypeScript
- TanStack Query (for data fetching/caching)
- React Hook Form + Zod (for forms and validation)
- Tailwind CSS (styling)
- shadcn/ui or similar component library (recommended)

---

### 4.2 Core Feature Modules

#### A. Mission Management Dashboard

**Mission Editor**
- Fields:
  - Title
  - Description
  - Difficulty: Easy, Medium, Hard
  - Mission type: PvE Campaign / PvP Multiplayer
  - Duration (minutes)
  - Learning objectives (list)
  - Status: Draft, Active, Archived

**Mission List**
- Table/grid view
- Filters: difficulty, type, status
- Search: title, description keywords
- Pagination
- Sorting: creation date, difficulty, status

**Mission Detail View**
- Full mission metadata
- Completion statistics (e.g., number of learners who completed)
- Player performance summary (scores, time spent, completion rate)

---

#### B. Player Progress Tracking

**Player List**
- Overview of all players:
  - Current mission
  - Missions completed
  - Average score
  - Win rate
  - Total time spent

**Player Detail View**
- Mission history table
- Performance trend charts (e.g., scores vs time)
- Current mission status and last activity time

---

#### C. Role-Based Access Control (RBAC)

- Roles:
  - ADMIN: Full access (create, edit, delete missions; view all players; manage users).
  - TRAINER: View missions; edit within allowed scope; view assigned players; view analytics.
  - LEARNER: View only their own progress and mission history.

- Application behavior:
  - Protected routes based on role.
  - Conditional UI rendering based on `role` and permissions.
  - Server-side validation of permissions for every sensitive API call.

---

#### D. Real-Time Dashboard (Simplified)

- Features:
  - Live player activity feed (recent mission completions or updates).
  - Summary metrics:
    - Total active missions
    - Total registered players
    - Recent completions in the last N minutes/hours

- Technical options:
  - WebSocket-based updates (preferred where feasible).
  - Fallback: periodic polling via REST endpoints.

---

#### E. Responsive Design

- Tablet- and desktop-friendly layouts.
- Mobile support as a nice-to-have.
- Use Tailwind CSS and flex/grid for consistent layout.

---

## 5. Backend — Node.js / Express

### 5.1 Tech Stack

- Node.js (TypeScript) with Express
- PostgreSQL database
- Prisma ORM
- Redis (cache and session management)
- JWT authentication
- Helmet, CORS, and rate limiting

---

### 5.2 REST API Requirements

#### Authentication

- POST `/api/auth/login`
  - Input: email, password
  - Output: JWT token and basic user info.

- POST `/api/auth/logout`
  - Invalidate session (e.g., remove from Redis if used).

- GET `/api/auth/me`
  - Returns current user details (id, email, role).

---

#### Mission Management

- GET `/api/missions`
  - Supports pagination and filters (difficulty, type, status).

- GET `/api/missions/:id`
  - Returns a single mission.

- POST `/api/missions` (ADMIN only)
  - Creates a new mission.

- PUT `/api/missions/:id` (ADMIN/TRAINER)
  - Updates mission fields.

- DELETE `/api/missions/:id` (ADMIN only)
  - Soft delete via `deletedAt`.

- PATCH `/api/missions/:id/status` (ADMIN only)
  - Updates mission status (Draft, Active, Archived).

---

#### Player Management

- GET `/api/players`
  - List players with aggregated metrics.

- GET `/api/players/:id`
  - Detailed player profile.

- GET `/api/players/:id/progress`
  - Mission progress, scores, and time spent.

---

#### Analytics

- GET `/api/analytics/overview`
  - Returns dashboard-level metrics.

- GET `/api/analytics/missions/:id`
  - Returns mission-specific analytics.

---

## 6. Database Schema (Prisma)

### Entities

- Users
- PlayerProfiles
- Missions
- MissionResults

### Design Considerations

- Enforce foreign keys.
- Use `deletedAt` for soft deletion where applicable.
- Add indexes for:
  - `missions.status`
  - `missions.difficulty`
  - `users.role`
  - `mission_results.missionId`
  - `mission_results.playerId`

---

## 7. Caching and Security

### Caching (Redis)

- Cache frequently used mission lists.
- Cache authenticated user sessions or tokens where appropriate.
- Invalidate cache on mission creation, update, or delete.

### Security

- Use bcrypt for password hashing.
- Validate all request payloads with Zod.
- Use Helmet and strict CORS configuration.
- Apply rate limiting on auth endpoints.

---

## 8. DevOps & Deployment

- Docker images for frontend and backend.
- Docker Compose for:
  - backend
  - frontend
  - PostgreSQL
  - Redis
- Documentation for:
  - Local Docker-based setup.
  - Optional deployment to AWS / Railway / Render.

---

## 9. Evaluation Criteria

- Code quality and structure.
- Correctness and robustness of functionality.
- Architecture scalability and maintainability.
- UI/UX responsiveness and usability.
- Security posture.
- Documentation clarity and completeness.

---

## 10. Timeline (Recommended)

| Day | Deliverables |
|-----|-------------|
| 1   | Database, Prisma, auth API |
| 2   | Missions & player APIs     |
| 3   | Frontend setup & auth      |
| 4   | Mission UI, player UI, RBAC|
| 5   | Real-time + caching        |
| 6   | Docs, deployment, testing  |