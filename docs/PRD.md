# Product Requirements Document
# Mission Control Dashboard for Maritime Training

---

## 🚨 Section 0: Implementation Notes for CC/AI Coders (CRITICAL - DO NOT SKIP)

These notes define **exactly** how the system should be scaffolded, structured, and implemented. All generated code **MUST** follow these instructions unless explicitly stated otherwise.

---

### 0.1 Project Folder Structure (FIXED)

```
mission-control-dashboard/
├── backend/
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── prisma/
│   │       ├── schema.prisma
│   │       └── seed.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── docker-compose.yml
├── README.md
├── PRD.md
└── .env.example
```

#### **Strict Rules:**
- ✅ Backend TypeScript files **MUST** be placed under `backend/src/...`
- ✅ Next.js files **MUST** be placed under `frontend/app/` & `frontend/components/`
- ❌ **NO** additional folders unless necessary and approved

---

### 0.2 MVP Scope (MANDATORY FOR SUBMISSION)

CC must focus **FIRST** on completing these core MVP functions:

#### **Backend MVP Requirements**

| Feature | Requirements |
|---------|-------------|
| **Authentication (JWT)** | • `/api/auth/login`<br>• `/api/auth/me`<br>• `/api/auth/logout` |
| **Missions** | • GET all missions<br>• GET mission by ID<br>• POST new mission<br>• PUT update mission |
| **Players** | • List players<br>• Player detail<br>• Player mission history |
| **RBAC** | • ADMIN, TRAINER, LEARNER roles |
| **Database** | • Prisma + PostgreSQL |
| **Cache** | • Redis (simple cache or session) |
| **Docker** | • Docker Compose runs backend + Postgres + Redis + frontend |

#### **Frontend MVP Requirements**

| Feature | Implementation |
|---------|---------------|
| **Login Page** | React Hook Form + Zod validation |
| **Dashboard Layout** | Skeleton with sidebar + topbar |
| **Mission Management** | List + create/edit mission pages |
| **Player Management** | List + detail pages |
| **RBAC UI** | Role-based component hiding |
| **API Integration** | TanStack Query |

⚠️ **These MUST be working for grading.**

---

### 0.3 Non-MVP / Optional Features (ONLY AFTER MVP)

If time allows, CC may implement later:
- Real-time WebSockets (otherwise use polling)
- Advanced analytics charts
- AI mission enhancement
- Mission status badges & trend visualizations

❌ **CC must NOT implement optional features unless instructed.**

---

### 0.4 Strict Technology Boundaries

#### **PROHIBITED Technologies (DO NOT USE)**
| Category | Prohibited Items |
|----------|-----------------|
| **Frameworks** | NestJS, tRPC, Apollo/GraphQL |
| **State Management** | Redux, Zustand |
| **Auth Libraries** | NextAuth, Passport.js |
| **ORMs** | TypeORM, Sequelize |
| **Databases** | Supabase, Firebase |
| **Others** | WebRTC, Microservices, Serverless functions |

#### **ALLOWED Technologies ONLY**

**Backend Stack:**
- Node.js
- Express.js
- TypeScript
- Prisma
- PostgreSQL
- Redis
- JWT

**Frontend Stack:**
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Hook Form + Zod

---

### 0.5 Fixed Ports & Environment Variables

#### **Backend Configuration**
```env
# Port: 4000 (FIXED)
PORT=4000
DATABASE_URL=postgresql://mc_user:mc_pass@postgres:5432/mission_control
REDIS_URL=redis://redis:6379
JWT_SECRET=supersecretkey
```

#### **Frontend Configuration**
```env
# Port: 3000 (FIXED)
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

### 0.6 Seed Users (MANDATORY)

CC must create `backend/src/prisma/seed.ts` with these accounts:

| Role | Email | Password |
|------|-------|----------|
| **ADMIN** | admin@navytraining.sg | Admin123! |
| **TRAINER** | trainer@navytraining.sg | Trainer123! |
| **LEARNER** | cadet.tan@navytraining.sg | Cadet123! |

---

### 0.7 Docker Instructions

#### **Required Docker Configuration**

**docker-compose.yml must include:**
```yaml
services:
  - backend
  - frontend
  - postgres
  - redis
```

**Backend Dockerfile:**
- Uses Node 18+
- Installs dependencies
- Runs `npm run build` then `npm run start`

**Frontend Dockerfile:**
- Uses Node 18+
- Builds Next.js
- Runs on port 3000

**Volumes:**
```yaml
volumes:
  postgres_data: /var/lib/postgresql/data
  redis_data: /data
```

---

### 0.8 Developer-Safe Rules for CC

#### **Mandatory Coding Practices**
1. ✅ **Always** check RBAC rules before coding endpoints
2. ✅ **Always** apply Zod validation for all DTOs
3. ✅ **Always** use Prisma for database operations
4. ✅ **Always** hash passwords using bcrypt (saltRounds = 10)
5. ✅ **Always** include try/catch in controllers
6. ✅ **Always** return consistent JSON shape
7. ✅ **Always** document any assumptions before generating code

---

## 1. Executive Summary

### Overview
The Mission Control Dashboard is a secure, scalable, and user-friendly web application designed for Singapore's maritime training sector, including defense and higher-education institutions such as SAF, NUS, NTU, and maritime academies.

The platform enables administrators and trainers to:
- Manage training missions
- Monitor trainee progress
- Analyze learning outcomes
- Enforce strict role-based access control

### Technology Stack
- **Frontend**: React/Next.js
- **Backend**: Node.js/Express
- **Database**: PostgreSQL (via Prisma ORM)
- **Cache**: Redis
- **Authentication**: JWT-based
- **Real-time**: WebSockets/Polling

The system must support real-time or near-real-time updates and meet Singapore's security, reliability, and PDPA-aligned requirements.

---

## 2. Goals & Objectives

### Primary Goals
1. **Mission Management**: Provide comprehensive mission planning, management, and analytics for maritime training simulations
2. **Performance Monitoring**: Support trainers and administrators in monitoring cadet performance
3. **Access Control**: Implement secure role-based access control for ADMIN, TRAINER, and LEARNER roles
4. **Real-time Visibility**: Enable real-time visibility of mission activity

### Secondary Goals
1. **Responsive UI**: Deliver an intuitive and responsive interface suitable for tablets and desktops
2. **AI Enhancement**: Implement optional AI features for auto-generated mission descriptions or difficulty assessment
3. **Scalable Architecture**: Provide modular, scalable architecture to support future training modules

---

## 3. User Roles & Permissions

### Administrator (ADMIN)
- Full control of missions, players, analytics, and users
- Complete CRUD operations on all entities
- System configuration and management

### Trainer (TRAINER)
- Limited mission editing capabilities
- Full visibility of assigned learners' performance
- Create and manage training sessions
- View analytics for assigned cohorts

### Learner (LEARNER)
- View-only access to their own mission history and results
- Access personal progress tracking
- View assigned missions and objectives

---

## 4. System Architecture & Features

## 4.1 Frontend Architecture

### Technology Stack
| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Next.js (App Router) | 15+ |
| Language | TypeScript | Latest |
| UI Library | React | 19+ |
| State Management | TanStack Query | v5 |
| Form Handling | React Hook Form + Zod | Latest |
| Styling | Tailwind CSS | v3 |
| UI Components | shadcn/ui | Recommended |

## 4.2 Core Feature Modules

### A. Mission Management Dashboard

#### Mission Editor
Create and edit missions with the following fields:

| Field | Type | Options/Format |
|-------|------|----------------|
| Title | Text | Required, 100 char max |
| Description | Text Area | Required, 500 char max |
| Difficulty | Select | Easy / Medium / Hard |
| Type | Select | PvE Campaign / PvP Multiplayer |
| Duration | Number | Minutes (10-120) |
| Learning Objectives | Multi-select | Customizable tags |
| Status | Select | Draft / Active / Archived |

#### Mission List View
- **Display Options**: Table/Grid view toggle
- **Filtering**:
  - By difficulty level
  - By mission type
  - By status
- **Search**: Full-text search on title and keywords
- **Pagination**: 10/25/50 items per page
- **Sorting**: Date created, difficulty, status, duration

#### Mission Detail View
- Full mission metadata display
- Completion statistics dashboard
- Player performance summary
  - Average scores
  - Completion times
  - Success rates
- Historical trends and analytics

### B. Player Progress Tracking

#### Player List Dashboard
| Metric | Description |
|--------|-------------|
| Mission Progress | Percentage of missions completed |
| Completion Rate | Success rate for attempted missions |
| Average Score | Mean score across all missions |
| Win Rate | PvP win percentage |
| Time Investment | Total hours in training |

#### Player Detail View
- **Mission History Table**
  - Mission name, date, score, duration, status
  - Sortable and filterable

- **Performance Charts**
  - Historical performance trends
  - Score progression over time
  - Time spent per mission type
  - Skill development radar chart

- **Current Mission Status**
  - Real-time progress tracking
  - Estimated completion time

### C. Role-Based Access Control (RBAC)

#### Access Matrix
| Feature | ADMIN | TRAINER | LEARNER |
|---------|-------|---------|---------|
| View All Missions | ✅ | ✅ | ✅ |
| Create Missions | ✅ | ❌ | ❌ |
| Edit Missions | ✅ | Limited | ❌ |
| Delete Missions | ✅ | ❌ | ❌ |
| View All Players | ✅ | Assigned Only | ❌ |
| View Own Data | ✅ | ✅ | ✅ |
| Access Analytics | ✅ | Limited | Own Only |

#### Implementation
- UI components auto-hide based on user role
- Protected routes via Next.js middleware
- Server-side validation on all API endpoints
- JWT token claims for role verification

### D. Real-Time Dashboard

#### Live Metrics
- **Active Missions Counter**: Real-time count with status indicators
- **Total Players Online**: Live user presence tracking
- **Recent Completions Feed**: Stream of latest mission completions
- **Performance Alerts**: Real-time notifications for achievements

#### Technical Implementation
- **Primary**: WebSocket connection for live updates
- **Fallback**: HTTP polling at 5-second intervals
- **Optimization**: Delta updates only

### E. Responsive Design Requirements

#### Device Support
| Device | Screen Size | Priority |
|--------|-------------|----------|
| Desktop | 1920×1080+ | High |
| Tablet | 768×1024+ | Highest |
| Mobile | 375×667+ | Medium |

#### Design Principles
- Tablet-first design approach
- Touch-optimized interfaces
- Adaptive layouts for different screen sizes
- Progressive enhancement for larger screens

---

## 5. Backend Architecture

## 5.1 Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Runtime | Node.js + TypeScript | Server runtime |
| Framework | Express.js | Web framework |
| Database | PostgreSQL | Primary data store |
| ORM | Prisma | Database abstraction |
| Cache | Redis | Session & data caching |
| Authentication | JWT | Token-based auth |
| Security | Helmet, CORS | Security middleware |
| Validation | Zod | Schema validation |
| Rate Limiting | express-rate-limit | API protection |

## 5.2 REST API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User login with credentials | No |
| POST | `/api/auth/logout` | Invalidate session | Yes |
| POST | `/api/auth/refresh` | Refresh JWT token | Yes |
| GET | `/api/auth/me` | Get current user profile | Yes |

### Mission Management Endpoints
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/missions` | List all missions | ALL |
| GET | `/api/missions/:id` | Get mission details | ALL |
| POST | `/api/missions` | Create new mission | ADMIN |
| PUT | `/api/missions/:id` | Update mission | ADMIN, TRAINER* |
| DELETE | `/api/missions/:id` | Soft delete mission | ADMIN |
| PATCH | `/api/missions/:id/status` | Update mission status | ADMIN |

*TRAINER has limited edit permissions

### Player Management Endpoints
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/players` | List all players | ADMIN, TRAINER* |
| GET | `/api/players/:id` | Get player details | ADMIN, TRAINER*, LEARNER** |
| GET | `/api/players/:id/progress` | Get player progress | ADMIN, TRAINER*, LEARNER** |
| GET | `/api/players/:id/missions` | Get player's missions | ADMIN, TRAINER*, LEARNER** |

*TRAINER can only view assigned players
**LEARNER can only view own data

### Analytics Endpoints
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/analytics/overview` | Dashboard statistics | ADMIN, TRAINER |
| GET | `/api/analytics/missions/:id` | Mission-specific analytics | ADMIN, TRAINER |
| GET | `/api/analytics/players/:id` | Player analytics | ADMIN, TRAINER*, LEARNER** |
| GET | `/api/analytics/trends` | Historical trends | ADMIN |

## 5.3 Database Schema (Prisma)

### Entity Relationship Diagram

```
Users (1) ─────< (N) PlayerProfiles
  │                       │
  │                       │
  └──< Missions >─────────┤
                          │
                   MissionResults
```

### Core Entities

#### Users Table
```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  password      String
  role          UserRole
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  deletedAt     DateTime?

  playerProfile PlayerProfile?
}

enum UserRole {
  ADMIN
  TRAINER
  LEARNER
}
```

#### Missions Table
```prisma
model Mission {
  id                String   @id @default(cuid())
  title             String
  description       String
  difficulty        Difficulty
  type              MissionType
  duration          Int
  learningObjectives String[]
  status            MissionStatus
  createdBy         String
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  deletedAt         DateTime?

  results           MissionResult[]

  @@index([difficulty, type, status])
}
```

### Database Constraints & Optimization
- Foreign keys with CASCADE delete
- Soft delete implementation via `deletedAt` field
- Indexed fields for query optimization:
  - `mission.type`
  - `mission.difficulty`
  - `mission.status`
  - `user.role`
  - `user.email`

## 5.4 Redis Caching Strategy

### Cached Data Categories
| Category | Key Pattern | TTL |
|----------|-------------|-----|
| Active Missions | `missions:active:*` | 5 min |
| User Sessions | `session:user:{id}` | 30 min |
| Analytics | `analytics:dashboard` | 1 min |
| Player Stats | `player:{id}:stats` | 5 min |

### Cache Invalidation Events
- Mission creation/update/deletion
- Player progress updates
- Analytics recalculation
- User role changes

## 5.5 Security Implementation

### Authentication & Authorization
- **Password Security**: bcrypt with salt rounds = 10
- **JWT Configuration**:
  - Access token expiry: 15 minutes
  - Refresh token expiry: 7 days
  - Token rotation on refresh

### API Security
- **Input Validation**: Zod schemas for all endpoints
- **Rate Limiting**:
  - Login endpoint: 5 attempts per 15 minutes
  - API endpoints: 100 requests per minute
- **Security Headers**: Helmet.js default configuration
- **CORS Policy**: Whitelist specific domains only

---

## 6. Optional Features

### AI Mission Enhancement Module

#### Capabilities
- Auto-generate mission descriptions
- Suggest difficulty levels based on content
- Generate learning objectives
- Create mission briefings

#### API Integration
```typescript
POST /api/ai/enhance-mission
{
  "missionId": "mission_123",
  "enhancementType": "description" | "difficulty" | "objectives",
  "context": {
    "targetAudience": "naval_cadets",
    "skillLevel": "intermediate"
  }
}
```

---

## 7. DevOps & Deployment

## 7.1 Containerization

### Required Docker Files
```
project-root/
├── backend/
│   └── Dockerfile
├── frontend/
│   └── Dockerfile
└── docker-compose.yml
```

### Docker Compose Services
```yaml
services:
  backend:
    build: ./backend
    ports: ["4000:4000"]
    environment:
      - DATABASE_URL
      - REDIS_URL
      - JWT_SECRET

  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_API_URL

  postgres:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
```

## 7.2 Deployment Documentation

### Essential Documentation
1. **Docker Instructions**
   - Build commands
   - Run configurations
   - Volume mappings

2. **Environment Variables**
   ```env
   # Backend
   DATABASE_URL=postgresql://...
   REDIS_URL=redis://...
   JWT_SECRET=...
   PORT=4000

   # Frontend
   NEXT_PUBLIC_API_URL=...
   ```

3. **Database Migration**
   ```bash
   npx prisma migrate dev
   npx prisma migrate deploy
   npx prisma db seed
   ```

### Deployment Options
- **Cloud Providers**: AWS (EC2 + RDS + ElastiCache)
- **PaaS**: Railway, Render, Fly.io
- **Local Development**: Docker Compose

---

## 8. Project Deliverables

### 8.1 Code Repository
- **Structure**: Clean, organized folder structure
- **Documentation**: Comprehensive README.md
- **Configuration**: .env.example with all required variables
- **Seed Data**:
  - 3 sample missions (varying difficulty)
  - 3 user accounts (one per role)
  - Sample player progress data

### 8.2 Documentation Requirements

#### README.md Contents
1. **Project Overview**: Brief description and features
2. **Technology Stack**: Complete list with versions
3. **Setup Instructions**: Step-by-step installation guide
4. **Database Migrations**: Prisma migration commands
5. **API Documentation**: Complete endpoint reference
6. **ER Diagram**: Visual database schema
7. **Demo Credentials**: Test accounts for each role

### 8.3 Optional Deliverables
- **Live Demo**: Deployed application URL
- **Video Walkthrough**: 5-10 minute feature demonstration
- **Postman Collection**: API testing collection

---

## 9. Evaluation Criteria

| Criterion | Weight | Focus Areas |
|-----------|--------|-------------|
| **Code Quality** | 30% | Clean code, best practices, documentation |
| **Functionality** | 30% | Feature completeness, error handling |
| **Architecture & Design** | 20% | Scalability, modularity, patterns |
| **UI/UX** | 10% | Responsiveness, intuitiveness, accessibility |
| **Security** | 5% | Authentication, authorization, data protection |
| **Documentation** | 5% | README, API docs, setup guides |

---

## 10. Development Timeline

### Recommended 6-Day Sprint

| Day | Focus | Deliverables |
|-----|-------|--------------|
| **Day 1** | Backend Foundation | Database design, Prisma setup, Auth API |
| **Day 2** | Core APIs | Missions API, Players API, Analytics endpoints |
| **Day 3** | Frontend Setup | Next.js configuration, Auth flow, routing |
| **Day 4** | UI Implementation | Mission UI, Player UI, RBAC implementation |
| **Day 5** | Advanced Features | Real-time updates, Redis caching, polish |
| **Day 6** | Finalization | Documentation, deployment, testing, submission |

---

## 11. Appendix: Sample Data

### Sample Mission Data (Singapore Context)

#### Mission 1: Basic Navigation
```json
{
  "id": "mission_001",
  "title": "Marina Bay Navigation",
  "description": "Basic navigation exercise in Singapore's Marina Bay area. Perfect for cadets learning fundamental maritime navigation skills.",
  "difficulty": "EASY",
  "type": "PvE",
  "status": "ACTIVE",
  "duration": 20,
  "learningObjectives": [
    "Basic Navigation",
    "Chart Reading",
    "Vessel Control"
  ],
  "createdAt": "2024-01-10",
  "createdBy": "trainer_user_id"
}
```

#### Mission 2: Intermediate Patrol
```json
{
  "id": "mission_002",
  "title": "Singapore Strait Patrol",
  "description": "Navigate through the busy Singapore Strait while avoiding civilian traffic and maintaining maritime security protocols. This mission simulates real-world patrol scenarios in one of the world's busiest shipping lanes.",
  "difficulty": "MEDIUM",
  "type": "PvE",
  "status": "ACTIVE",
  "duration": 30,
  "learningObjectives": [
    "Navigation",
    "Traffic Management",
    "Communication",
    "Situational Awareness"
  ],
  "createdAt": "2024-01-15",
  "createdBy": "admin_user_id"
}
```

#### Mission 3: Advanced Defense
```json
{
  "id": "mission_003",
  "title": "Jurong Port Defense",
  "description": "Coordinate defense operations for Singapore's Jurong Port during a simulated security threat. Practice multi-vessel coordination and rapid response protocols.",
  "difficulty": "HARD",
  "type": "PvP",
  "status": "ACTIVE",
  "duration": 45,
  "learningObjectives": [
    "Tactical Planning",
    "Team Coordination",
    "Crisis Management"
  ],
  "createdAt": "2024-01-16",
  "createdBy": "admin_user_id"
}
```

### Sample Player Progress
```json
{
  "playerId": "player_001",
  "displayName": "Cadet Tan Wei Ming",
  "currentMission": "mission_001",
  "missionsCompleted": 5,
  "averageScore": 85.5,
  "winRate": 0.75,
  "totalTimeSpent": 180
}
```

### Sample Mission Result
```json
{
  "id": "result_001",
  "missionId": "mission_001",
  "playerId": "player_001",
  "completionStatus": true,
  "score": 92.5,
  "timeSpent": 28,
  "createdAt": "2024-01-20T10:30:00Z"
}
```

### Sample User Accounts
```json
// Administrator
{
  "id": "user_admin_001",
  "email": "admin@navytraining.sg",
  "role": "ADMIN",
  "description": "Senior training officer with full system access"
}

// Trainer
{
  "id": "user_trainer_001",
  "email": "trainer@navytraining.sg",
  "role": "TRAINER",
  "description": "Instructor with limited editing and learner management"
}

// Learner
{
  "id": "user_learner_001",
  "email": "cadet.tan@navytraining.sg",
  "role": "LEARNER",
  "description": "Naval cadet with view-only access to own progress"
}
```

---

## Document Version
- **Version**: 2.0
- **Last Updated**: November 2024
- **Status**: Final - Implementation Ready