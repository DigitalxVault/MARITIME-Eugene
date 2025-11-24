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
```
POST   /api/auth/login         # Login with credentials
POST   /api/auth/logout        # Logout current session
POST   /api/auth/refresh       # Refresh access token
GET    /api/auth/me            # Get current user profile
```

### Mission Management
```
GET    /api/missions           # List missions (pagination, filters)
GET    /api/missions/:id       # Get single mission
POST   /api/missions           # Create mission (ADMIN/TRAINER)
PUT    /api/missions/:id       # Update mission (ADMIN/TRAINER)
DELETE /api/missions/:id       # Delete mission (ADMIN)
PATCH  /api/missions/:id/status # Update status (ADMIN)
GET    /api/missions/:id/stats # Get mission statistics
```

### Player Management
```
GET    /api/players            # List players
GET    /api/players/:id        # Get player details
GET    /api/players/me         # Get current user's profile
PUT    /api/players/:id        # Update player profile
GET    /api/players/:id/progress # Get player progress
POST   /api/players/:id/progress # Record mission result
GET    /api/players/:id/stats  # Get player statistics
GET    /api/players/leaderboard # Get leaderboard
```

### Analytics
```
GET    /api/analytics/overview    # Dashboard overview metrics
GET    /api/analytics/missions/:id # Mission-specific analytics
GET    /api/analytics/players/:id  # Player analytics
GET    /api/analytics/trending     # Trending missions
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
