# Mission Control Dashboard for Maritime Training 🚢

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

A secure, scalable, and role-based web application designed to support Singapore's maritime training and defense education sectors. Built for institutions including SAF, NUS, NTU, and maritime academies.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-core-features)
- [Tech Stack](#️-tech-stack)
- [Quick Start](#-quick-start)
- [Local Development](#-local-development)
- [Docker Setup](#-docker-setup)
- [API Endpoints](#-api-endpoints)
- [User Roles](#-user-roles)
- [Demo Credentials](#-demo-credentials)
- [Documentation](#-documentation)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🎯 Overview

The Mission Control Dashboard enables administrators and trainers to:
- ✅ Create and manage training missions with varying difficulty levels
- ✅ Monitor trainee/cadet progress in real-time
- ✅ Analyze learning outcomes with comprehensive analytics
- ✅ Enforce strict role-based access control (RBAC)
- ✅ Track player performance metrics and trends

---

## 🎮 Core Features

### Mission Management
- Create, edit, and archive training missions
- Set difficulty levels (Easy, Medium, Hard)
- Define mission types (PvE Campaign, PvP Multiplayer)
- Track learning objectives and completion statistics
- Update mission status (Draft/Active/Archived)

### Player Progress Tracking
- Real-time progress monitoring
- Performance analytics and trends
- Mission history with detailed scores
- Win rate and time tracking
- Leaderboard system

### Real-Time Dashboard
- Live activity feed with recent completions
- Active mission monitoring
- Player presence tracking
- Performance metrics visualization

### Analytics & Insights
- Comprehensive dashboard overview
- Mission-specific analytics
- Player performance analysis
- Historical trend tracking
- Trending missions feed

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **Next.js 15+** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **React 19+** | UI library with modern hooks |
| **TanStack Query v5** | Server state management & caching |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Accessible component library |
| **React Hook Form + Zod** | Form validation |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework |
| **TypeScript** | Type-safe development |
| **Prisma ORM** | Database ORM with type safety |
| **PostgreSQL** | Relational database |
| **Redis** | Caching & session management |
| **JWT** | Authentication with refresh tokens |
| **Helmet + CORS** | Security middleware |

### DevOps
- Docker & Docker Compose
- Production-ready Dockerfiles
- Environment-based configuration

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop/))
- **Git** ([Download](https://git-scm.com/))

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/DigitalxVault/MARITIME-Eugene.git
cd mission-control-dashboard
```

2. **Set up environment variables:**
```bash
# Copy example env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. **Start with Docker Compose (Recommended):**
```bash
docker-compose up -d
```

4. **Access the application:**
- 🌐 **Frontend**: http://localhost:3000
- 🔌 **Backend API**: http://localhost:4000
- 📊 **Prisma Studio**: http://localhost:5555

---

## ⚙️ Environment Variables

### Backend Environment Variables (`backend/.env`)

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/maritime_db"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT Secrets (Change these in production!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"

# JWT Expiration
JWT_EXPIRES_IN="15m"          # Access token expires in 15 minutes
JWT_REFRESH_EXPIRES_IN="7d"   # Refresh token expires in 7 days

# Server Configuration
PORT=4000
NODE_ENV="development"        # Options: development, production

# CORS Configuration
CORS_ORIGIN="http://localhost:3000"  # Frontend URL

# Rate Limiting
RATE_LIMIT_MAX=5              # Max login attempts
RATE_LIMIT_WINDOW_MS=900000   # 15 minutes in milliseconds

# Bcrypt Configuration
BCRYPT_SALT_ROUNDS=10         # Password hashing strength
```

### Frontend Environment Variables (`frontend/.env`)

```bash
# Backend API URL
NEXT_PUBLIC_API_URL="http://localhost:4000"

# Optional: Analytics, monitoring, etc.
# NEXT_PUBLIC_ANALYTICS_ID="your-analytics-id"
```

### Required vs Optional

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Required | PostgreSQL connection string |
| `REDIS_URL` | ✅ Required | Redis connection string |
| `JWT_SECRET` | ✅ Required | Secret key for JWT access tokens |
| `JWT_REFRESH_SECRET` | ✅ Required | Secret key for JWT refresh tokens |
| `PORT` | ⚠️ Optional | Backend server port (default: 4000) |
| `NODE_ENV` | ⚠️ Optional | Environment mode (default: development) |
| `CORS_ORIGIN` | ✅ Required | Frontend URL for CORS |
| `NEXT_PUBLIC_API_URL` | ✅ Required | Backend API URL for frontend |

### Production Configuration

For production deployment, ensure you:
1. **Generate strong secrets** for JWT keys (use `openssl rand -base64 32`)
2. **Update CORS_ORIGIN** with your production frontend URL
3. **Set NODE_ENV** to `production`
4. **Use managed database services** (AWS RDS, DigitalOcean Managed DB, etc.)
5. **Enable SSL/TLS** for database connections

---

## 💻 Local Development

### Method 1: Docker Compose (Recommended)

Start all services (frontend, backend, PostgreSQL, Redis):

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Method 2: Manual Setup

#### Prerequisites
Make sure **Docker Desktop is running** for PostgreSQL and Redis containers.

#### Step 1: Start Database Services

```bash
# From project root
docker-compose up -d postgres redis

# Verify containers are running
docker ps
```

#### Step 2: Backend Setup

**Terminal 1 - Backend:**
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed database with sample data
npx prisma db seed

# Start development server
npm run dev
```

**Backend will run on**: `http://localhost:4000`

#### Step 3: Frontend Setup

**Terminal 2 - Frontend:**
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will run on**: `http://localhost:3000`

#### Step 4: Prisma Studio (Optional)

**Terminal 3 - Database Management:**
```bash
# Navigate to backend
cd backend

# Open Prisma Studio
npx prisma studio
```

**Prisma Studio will run on**: `http://localhost:5555`

---

## 🐳 Docker Setup

### Available Scripts

```bash
# Start all services
docker-compose up -d

# Start with build (rebuild images)
docker-compose up -d --build

# View logs
docker-compose logs -f [service-name]

# Stop all services
docker-compose down

# Remove volumes (clean database)
docker-compose down -v

# Restart specific service
docker-compose restart [service-name]
```

### Service Names
- `frontend` - Next.js application
- `backend` - Express.js API server
- `postgres` - PostgreSQL database
- `redis` - Redis cache

---

## 📡 API Endpoints

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@navytraining.sg",
  "password": "Admin123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "admin@navytraining.sg",
      "username": "Admin User",
      "role": "ADMIN"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Other Auth Endpoints
```http
POST   /api/auth/logout        # Logout current session
POST   /api/auth/refresh       # Refresh access token
GET    /api/auth/me            # Get current user profile
```

### Mission Management

#### List Missions
```http
GET /api/missions?page=1&limit=10&status=ACTIVE&difficulty=MEDIUM
Authorization: Bearer <access-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "title": "Naval Navigation Basics",
      "description": "Learn fundamental navigation skills",
      "type": "PVE",
      "difficulty": "MEDIUM",
      "status": "ACTIVE",
      "duration": 45,
      "createdBy": "admin-uuid",
      "createdAt": "2025-11-25T10:00:00Z",
      "_count": {
        "results": 12
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalCount": 25,
    "totalPages": 3
  }
}
```

#### Create Mission
```http
POST /api/missions
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "title": "Advanced Radar Operations",
  "description": "Master radar system operations",
  "type": "PVE",
  "difficulty": "HARD",
  "status": "DRAFT",
  "duration": 60
}
```

#### Other Mission Endpoints
```http
GET    /api/missions/:id          # Get single mission
PUT    /api/missions/:id          # Update mission (ADMIN/TRAINER)
DELETE /api/missions/:id          # Soft delete mission (ADMIN)
PATCH  /api/missions/:id/status   # Update status (ADMIN)
GET    /api/missions/:id/stats    # Get mission statistics
```

### Player Management

#### Get Player Details
```http
GET /api/players/:id
Authorization: Bearer <access-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "player-uuid",
    "email": "learner@navytraining.sg",
    "username": "John Doe",
    "role": "LEARNER",
    "rank": "Ensign",
    "profile": {
      "totalScore": 850,
      "completedMissions": 10,
      "activeMissions": 3
    },
    "recentResults": [
      {
        "missionId": "mission-uuid",
        "missionTitle": "Naval Navigation Basics",
        "score": 85,
        "timeSpent": 42,
        "isCompleted": true,
        "completedAt": "2025-11-20T14:30:00Z"
      }
    ]
  }
}
```

#### Other Player Endpoints
```http
GET    /api/players               # List players
GET    /api/players/me            # Get current user's profile
PUT    /api/players/:id           # Update player profile
GET    /api/players/:id/progress  # Get player progress
POST   /api/players/:id/progress  # Record mission result
GET    /api/players/:id/stats     # Get player statistics
GET    /api/players/leaderboard   # Get leaderboard
```

### Analytics

#### Dashboard Overview
```http
GET /api/analytics/overview
Authorization: Bearer <access-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "metrics": {
      "totalMissions": 50,
      "activeMissions": 25,
      "totalPlayers": 120,
      "activePlayers": 80,
      "totalCompletions": 450,
      "completionRate": 75.5
    },
    "distributions": {
      "missionsByDifficulty": [
        { "difficulty": "EASY", "count": 15 },
        { "difficulty": "MEDIUM", "count": 20 },
        { "difficulty": "HARD", "count": 15 }
      ],
      "missionsByType": [
        { "type": "PVE", "count": 35 },
        { "type": "PVP", "count": 15 }
      ]
    }
  }
}
```

#### Other Analytics Endpoints
```http
GET    /api/analytics/missions/:id  # Mission-specific analytics
GET    /api/analytics/players/:id   # Player analytics
GET    /api/analytics/trending      # Trending missions
```

### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number (default: 1) | `?page=2` |
| `limit` | number | Items per page (default: 10) | `?limit=20` |
| `status` | enum | Filter by status | `?status=ACTIVE` |
| `difficulty` | enum | Filter by difficulty | `?difficulty=HARD` |
| `type` | enum | Filter by type | `?type=PVE` |
| `search` | string | Search in title/description | `?search=navigation` |
| `sortBy` | string | Sort field (default: createdAt) | `?sortBy=title` |
| `sortOrder` | enum | Sort order: asc/desc | `?sortOrder=desc` |

### Authentication Headers

All protected endpoints require JWT token in Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

📘 **Full API Documentation**: [docs/API-SWAGGER.md](./docs/API-SWAGGER.md)

---

## 👥 User Roles

| Role | Permissions |
|------|------------|
| **ADMIN** | Full system access, user management, all CRUD operations, delete missions |
| **TRAINER** | View missions, manage assigned learners, view/create missions, access analytics |
| **LEARNER** | View own progress, access assigned missions, view leaderboard |

---

## 🧪 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@navytraining.sg | Admin123! |
| **Trainer** | trainer@navytraining.sg | Trainer123! |
| **Learner** | learner@navytraining.sg | Learner123! |

---

## 📚 Documentation

Complete documentation is available in the `/docs` folder:

| Document | Description |
|----------|-------------|
| [Product Requirements](./docs/FS_JOB%20ASSIGNMENT.md) | Project requirements and specifications |
| [System Architecture](./docs/SYSTEM-ARCHITECTURE.md) | System design and architecture |
| [API Documentation](./docs/API-SWAGGER.md) | Complete API reference with examples |
| [Database Schema (ERD)](./docs/ERD.md) | Database structure and relationships |
| [Folder Structure](./docs/FOLDER-STRUCTURE.md) | Project organization |
| [Style Guide](./docs/STYLE.md) | UI/UX design guidelines |

---

## 🏗️ Project Structure

```
mission-control-dashboard/
├── backend/                    # Node.js/Express API server
│   ├── src/
│   │   ├── api/               # API routes (auth, missions, players, analytics)
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # Auth, validation, RBAC
│   │   ├── schemas/           # Zod validation schemas
│   │   └── prisma/            # Database schema & migrations
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # Next.js application
│   ├── app/                   # Next.js 15 App Router
│   ├── components/            # React components
│   ├── lib/                   # Utilities & API client
│   ├── Dockerfile
│   └── package.json
│
├── docs/                      # Project documentation
├── docker-compose.yml         # Docker orchestration
└── README.md
```

---

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM for type-safe database operations.

### Core Tables

#### **Users** (`User`)
- `id` (String, UUID) - Primary key
- `email` (String, unique) - User email for authentication
- `username` (String, unique) - Display name
- `password` (String) - Hashed with bcrypt (salt rounds: 10)
- `role` (Enum) - `ADMIN`, `TRAINER`, or `LEARNER`
- `createdAt`, `updatedAt` (DateTime) - Timestamps
- `deletedAt` (DateTime?) - Soft delete timestamp

#### **Missions** (`Mission`)
- `id` (String, UUID) - Primary key
- `title` (String) - Mission name
- `description` (String) - Mission details
- `type` (Enum) - `PVE` (Campaign) or `PVP` (Multiplayer)
- `difficulty` (Enum) - `EASY`, `MEDIUM`, or `HARD`
- `status` (Enum) - `DRAFT`, `ACTIVE`, `COMPLETED`, or `ARCHIVED`
- `duration` (Int) - Estimated completion time in minutes
- `createdBy` (String) - Foreign key to User
- `createdAt`, `updatedAt` (DateTime) - Timestamps
- `deletedAt` (DateTime?) - Soft delete timestamp

#### **PlayerProfiles** (`PlayerProfile`)
- `id` (String, UUID) - Primary key
- `userId` (String, unique) - Foreign key to User
- `rank` (String) - Player rank/level (default: "Ensign")
- `totalScore` (Int) - Cumulative score across all missions
- `createdAt`, `updatedAt` (DateTime) - Timestamps

#### **MissionResults** (`MissionResult`)
- `id` (String, UUID) - Primary key
- `missionId` (String) - Foreign key to Mission
- `playerId` (String) - Foreign key to User
- `score` (Int) - Performance score (0-100)
- `timeSpent` (Int) - Time taken in minutes
- `isCompleted` (Boolean) - Completion status
- `feedback` (String?) - Optional trainer feedback
- `completedAt` (DateTime) - Timestamp of completion

### Soft Delete Pattern

All primary entities use **soft delete**:
- Records are never permanently deleted from the database
- `deletedAt` field is set to current timestamp when "deleted"
- Queries filter out soft-deleted records using `WHERE deletedAt IS NULL`
- Soft-deleted records remain visible in Prisma Studio for audit purposes
- Only ADMIN users can soft delete missions

### View Database

```bash
# Open Prisma Studio (database GUI)
cd backend
npx prisma studio
```

Access at: http://localhost:5555

### Full Schema Reference

Complete Prisma schema: [`backend/src/prisma/schema.prisma`](./backend/src/prisma/schema.prisma)
ER Diagram: [`docs/ERD.md`](./docs/ERD.md)

---

## 🔐 Security Features

- ✅ JWT-based authentication with refresh tokens
- ✅ Role-Based Access Control (RBAC)
- ✅ bcrypt password hashing (salt rounds: 10)
- ✅ Input validation with Zod schemas
- ✅ Rate limiting on authentication endpoints (5 attempts/15 min)
- ✅ CORS protection with whitelist
- ✅ SQL injection protection via Prisma ORM
- ✅ XSS protection via React
- ✅ Helmet.js security headers
- ✅ Soft delete functionality

---

## 🚢 Deployment

The application is production-ready and can be deployed to:

### Cloud Platforms
- **AWS**: EC2 + RDS (PostgreSQL) + ElastiCache (Redis)
- **Railway**: [railway.app](https://railway.app)
- **Render**: [render.com](https://render.com)
- **Fly.io**: [fly.io](https://fly.io)
- **DigitalOcean**: App Platform + Managed Databases

### Deployment Steps

1. **Set environment variables** on your platform
2. **Deploy PostgreSQL and Redis** databases
3. **Deploy backend** with Dockerfile
4. **Run migrations**: `npx prisma migrate deploy`
5. **Seed database**: `npm run prisma:seed`
6. **Deploy frontend** with Dockerfile
7. **Configure CORS** with production URLs

---

## 🔧 Troubleshooting

### Issue: "Can't reach database server at localhost:5432"

**Solution**: Database containers are not running.

```bash
# Start database containers
docker-compose up -d postgres redis

# Verify containers are running
docker ps
```

### Issue: "Prisma schema not found"

**Solution**: You're in the wrong directory.

```bash
# Navigate to backend folder
cd backend

# Then run Prisma commands
npx prisma generate
```

### Issue: Port already in use

**Solution**: Kill processes on occupied ports.

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or stop Docker containers
docker-compose down
```

### Issue: TypeScript build errors

**Solution**: Ensure all dependencies are installed and Prisma client is generated.

```bash
cd backend
npm install
npx prisma generate
npm run build
```

### Issue: Frontend not connecting to backend

**Solution**: Check environment variables.

```bash
# frontend/.env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 🧪 Testing

### Backend API Testing

Use the provided demo credentials to test API endpoints:

```bash
# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@navytraining.sg","password":"Admin123!"}'

# Get missions (with token)
curl http://localhost:4000/api/missions \
  -H "Authorization: Bearer <your-token>"
```

---

## ⚠️ Known Issues & Limitations

### Current Limitations

#### 1. Player Detail Page (In Development)
The Player Detail Page (`/dashboard/players/:id`) currently shows a placeholder "Coming Soon" message. Full implementation is planned with the following features:

**Planned Features:**
- Complete mission history table with scores and timestamps
- Performance trend charts (score over time, completion rates)
- Current active mission status
- Detailed player statistics and metrics
- Mission completion timeline

**Status:** 🔄 In Development (Priority: High)

**Workaround:** Use `/dashboard/players` list page to view basic player information and stats.

#### 2. Real-Time Updates
- Dashboard uses HTTP polling (30-second intervals) instead of WebSocket connections
- Activity feed updates every 10 seconds
- Leaderboard refreshes every 30 seconds

**Impact:** Minor delay in real-time data updates

**Status:** ✅ Working as designed (WebSocket implementation not required for MVP)

#### 3. Mission Deletion
- All mission deletions are soft deletes (records remain in database with `deletedAt` timestamp)
- No hard delete option available through UI
- Soft-deleted missions are hidden from all users but visible in Prisma Studio

**Status:** ✅ Working as designed (Preserves audit trail)

### Upcoming Features

The following features are planned for future releases:

- [ ] Player Detail Page (v1.1.0)
- [ ] Advanced analytics dashboard
- [ ] Mission template system
- [ ] Batch player import/export
- [ ] Email notifications for mission assignments
- [ ] Mobile responsive improvements
- [ ] Multi-language support (i18n)

### Reporting Issues

If you encounter any bugs or have feature requests:

1. Check existing issues: [GitHub Issues](https://github.com/DigitalxVault/MARITIME-Eugene/issues)
2. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details (browser, OS)

---

## 📄 License

**Proprietary** - Singapore Government / Defense Use Only

This software is developed for Singapore's maritime training and defense sectors. Unauthorized distribution or use is prohibited.

---

## 🤝 Contributing

This is a private project for Singapore's maritime training sector. For contributions or issues:

1. Contact the development team
2. Raise an issue in the repository
3. Submit pull requests for review

---

## 📞 Support

For technical support or questions:
- 📧 Email: support@navytraining.sg
- 🐛 Issues: [GitHub Issues](https://github.com/DigitalxVault/MARITIME-Eugene/issues)
- 📖 Documentation: [docs/README.md](./docs/README.md)

---

## 🙏 Acknowledgments

Built for Singapore's Maritime Training Excellence by **Origene Ventures**.

Special thanks to:
- Singapore Armed Forces (SAF)
- National University of Singapore (NUS)
- Nanyang Technological University (NTU)
- Maritime and Port Authority of Singapore (MPA)

---

**Built with ❤️ for Singapore's Maritime Training Excellence**

*Last Updated: November 2025*
