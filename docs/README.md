# Mission Control Dashboard for Maritime Training

A secure, scalable, and role-based web application designed to support Singapore's maritime training and defense education sectors. The system enables administrators and trainers to create missions, monitor player progress, analyze learning outcomes, and maintain strict access control aligned with PDPA and government security practices.

---

## 1. Project Overview

The Mission Control Dashboard is a full-stack platform developed using Next.js, Node.js/Express, PostgreSQL (Prisma ORM), Redis, and JWT authentication. It is intended for organizations such as:

- Singapore Armed Forces (SAF)
- National University of Singapore (NUS)
- Nanyang Technological University (NTU)
- Local maritime academies and simulation centres

The system provides mission management, real-time dashboards, and player progression analytics within a secure, enterprise-grade environment.

---

## 2. Key Features

### Mission Management
- Create, edit, archive missions
- Mission difficulty & type classification
- Learning objectives management
- Mission detail views with statistics

### Player Progress Tracking
- Player list with key metrics
- Player detail view with performance trends
- Mission history and completion tracking

### Role-Based Access Control (RBAC)
- **ADMIN:** Full access and system configuration
- **TRAINER:** Mission and learner oversight
- **LEARNER:** Self-progress view only

### Real-Time Dashboard (Simplified)
- Live activity feed of recent mission completions
- Summary metrics: active missions, players, recent completions

### Security
- JWT authentication
- bcrypt password hashing
- Helmet, CORS, rate limiting
- Zod-based input validation

---

## 3. Tech Stack

### Frontend
- Next.js 15+ (App Router)
- React 19+
- TypeScript
- TanStack Query
- React Hook Form + Zod
- Tailwind CSS
- shadcn/ui (optional)

### Backend
- Node.js (TypeScript) + Express
- PostgreSQL + Prisma ORM
- Redis (caching and sessions)
- JWT-based authentication

### DevOps
- Docker & Docker Compose
- Optional deployment: AWS / Railway / Render / Fly.io

---

## 4. Setup Instructions

### 4.1 Prerequisites
- Node.js 18+
- Docker and Docker Compose
- Git

### 4.2 Installation

```bash
git clone <repository-url> mission-control-dashboard
cd mission-control-dashboard

# Copy environment variables
cp .env.example .env

# Start services with Docker Compose
docker-compose up -d

# Install dependencies (for local development)
cd backend && npm install
cd ../frontend && npm install
```

### 4.3 Database Setup

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

### 4.4 Running Locally

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:4000

---

## 5. API Documentation

See [api-swagger.md](./api-swagger.md) for complete API documentation.

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Missions
- `GET /api/missions` - List missions
- `GET /api/missions/:id` - Get mission details
- `POST /api/missions` - Create mission (ADMIN)
- `PUT /api/missions/:id` - Update mission (ADMIN/TRAINER)
- `DELETE /api/missions/:id` - Delete mission (ADMIN)

### Players
- `GET /api/players` - List players
- `GET /api/players/:id` - Get player details
- `GET /api/players/:id/progress` - Get player progress

### Analytics
- `GET /api/analytics/overview` - Dashboard metrics
- `GET /api/analytics/missions/:id` - Mission analytics

---

## 6. Database Schema

See [erd.md](./erd.md) for complete Entity-Relationship Diagram.

### Core Tables
- `users` - System users with roles
- `player_profiles` - Player game profiles
- `missions` - Training missions
- `mission_results` - Player mission outcomes

---

## 7. Demo Credentials

| Role    | Email                    | Password     |
|---------|--------------------------|--------------|
| ADMIN   | admin@navytraining.sg    | Admin123!    |
| TRAINER | trainer@navytraining.sg  | Trainer123!  |
| LEARNER | learner@navytraining.sg  | Learner123!  |

---

## 8. Deployment

### Docker Deployment

```bash
docker-compose up -d --build
```

### Production Deployment

See deployment guides for:
- [AWS Deployment](./docs/deployment-aws.md)
- [Railway Deployment](./docs/deployment-railway.md)
- [Render Deployment](./docs/deployment-render.md)

---

## 9. Security Considerations

- All passwords are bcrypt hashed
- JWT tokens expire after 24 hours
- Rate limiting on authentication endpoints
- CORS configured for specific domains
- Input validation using Zod schemas
- SQL injection protection via Prisma ORM
- XSS protection via React's built-in escaping

---

## 10. License

Proprietary - Singapore Government / Defense Use Only

---

## 11. Support

For support, please contact the development team or raise an issue in the repository.