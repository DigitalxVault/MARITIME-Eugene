# Mission Control Dashboard for Maritime Training 🚢

A secure, scalable, and role-based web application designed to support Singapore's maritime training and defense education sectors. Built for institutions including SAF, NUS, NTU, and maritime academies.

## 🎯 Overview

The Mission Control Dashboard enables administrators and trainers to:
- Create and manage training missions
- Monitor trainee/cadet progress in real-time
- Analyze learning outcomes with comprehensive analytics
- Enforce strict role-based access control (RBAC)

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 15+ with App Router
- **Language:** TypeScript
- **UI Library:** React 19+
- **State Management:** TanStack Query v5
- **Styling:** Tailwind CSS + shadcn/ui
- **Forms:** React Hook Form + Zod validation

### Backend
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Cache:** Redis
- **Authentication:** JWT with refresh tokens
- **Security:** Helmet, CORS, rate limiting

### DevOps
- Docker & Docker Compose
- Production-ready Dockerfiles
- Environment-based configuration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/DigitalxVault/MARITIME-Eugene.git
cd mission-control-dashboard
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Start with Docker Compose:
```bash
docker-compose up -d
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## 📚 Documentation

Complete documentation is available in the `/docs` folder:

- [Product Requirements Document](./docs/PRD.md)
- [System Architecture](./docs/system-architecture.md)
- [API Documentation](./docs/api-swagger.md)
- [Database Schema (ERD)](./docs/erd.md)
- [Folder Structure](./docs/folder-structure.md)
- [Main Documentation](./docs/README.md)

## 🔐 Security Features

- JWT-based authentication with refresh tokens
- Role-Based Access Control (ADMIN, TRAINER, LEARNER)
- bcrypt password hashing
- Input validation with Zod schemas
- Rate limiting on sensitive endpoints
- CORS protection
- SQL injection protection via Prisma ORM
- XSS protection via React

## 🎮 Core Features

### Mission Management
- Create, edit, and archive training missions
- Set difficulty levels (Easy, Medium, Hard)
- Define mission types (PvE Campaign, PvP Multiplayer)
- Track learning objectives
- Monitor completion statistics

### Player Progress Tracking
- Real-time progress monitoring
- Performance analytics and trends
- Mission history and scores
- Win rate and time tracking
- Achievement system

### Real-Time Dashboard
- Live activity feed
- Active mission monitoring
- Player presence tracking
- Performance alerts

### Analytics
- Comprehensive dashboard metrics
- Mission-specific analytics
- Player performance analysis
- Historical trend tracking

## 👥 User Roles

| Role | Permissions |
|------|------------|
| **ADMIN** | Full system access, user management, all CRUD operations |
| **TRAINER** | View missions, manage assigned learners, view analytics |
| **LEARNER** | View own progress, access assigned missions |

## 🧪 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@navytraining.sg | Admin123! |
| Trainer | trainer@navytraining.sg | Trainer123! |
| Learner | learner@navytraining.sg | Learner123! |

## 🏗️ Project Structure

```
mission-control-dashboard/
├── backend/          # Node.js/Express API server
├── frontend/         # Next.js application
├── docs/            # Project documentation
├── docker-compose.yml
└── .env.example
```

## 📈 Development

### Local Development

Backend:
```bash
cd backend
npm install
npm run dev
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

### Database Setup

```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

## 🚢 Deployment

The application is Docker-ready and can be deployed to:
- AWS (EC2 + RDS + ElastiCache)
- Railway
- Render
- Fly.io
- Any Docker-compatible platform

## 📄 License

Proprietary - Singapore Government / Defense Use Only

## 🤝 Contributing

This is a private project for Singapore's maritime training sector. For contributions or issues, please contact the development team.

## 📞 Support

For technical support or questions, please raise an issue in the repository or contact the development team directly.

---

Built with ❤️ for Singapore's Maritime Training Excellence