# System Architecture

## Overview

The Mission Control Dashboard follows a modern three-tier architecture with clear separation of concerns, designed for scalability, maintainability, and security compliance with Singapore government standards.

---

## Architecture Layers

### 1. Presentation Layer (Frontend)
- **Framework:** Next.js 15+ with App Router
- **UI Library:** React 19+ with TypeScript
- **State Management:** TanStack Query for server state
- **Styling:** Tailwind CSS with shadcn/ui components
- **Form Handling:** React Hook Form with Zod validation

### 2. Application Layer (Backend)
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Authentication:** JWT with refresh tokens
- **Validation:** Zod schemas
- **ORM:** Prisma for database operations
- **Security:** Helmet, CORS, rate limiting

### 3. Data Layer
- **Primary Database:** PostgreSQL for transactional data
- **Cache:** Redis for sessions and frequently accessed data
- **File Storage:** Local filesystem (expandable to S3)

---

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Next.js    │  │    React     │  │   Tailwind   │     │
│  │  App Router  │  │  Components  │  │     CSS      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              │
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Express    │  │     JWT      │  │   Prisma     │     │
│  │   REST API   │  │    Auth      │  │     ORM      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Business   │  │  Validation  │  │   Caching    │     │
│  │    Logic     │  │     (Zod)    │  │   (Redis)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────────────────────────────────────┐
│                        DATA LAYER                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────┐       ┌──────────────────────┐   │
│  │     PostgreSQL       │       │        Redis         │   │
│  │   (Primary Data)     │       │    (Cache/Sessions)  │   │
│  └──────────────────────┘       └──────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Architecture

### Authentication Flow
1. User submits credentials
2. Backend validates against database
3. JWT token generated with user claims
4. Token stored in httpOnly cookie
5. Subsequent requests include token
6. Backend validates token on each request

### Authorization Model
- Role-Based Access Control (RBAC)
- Three roles: ADMIN, TRAINER, LEARNER
- Permissions checked at API and UI levels
- Database-level row security where applicable

---

## Data Flow

### Mission Creation Flow
1. Admin creates mission via UI
2. Frontend validates with Zod
3. Request sent to POST /api/missions
4. Backend validates request
5. Prisma creates database record
6. Cache invalidated
7. Response sent to frontend
8. UI updates with new mission

### Real-Time Updates
1. WebSocket connection established
2. Client subscribes to relevant channels
3. Server broadcasts updates on data changes
4. Client receives and updates UI
5. Fallback to polling if WebSocket fails

---

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers
- Redis for shared sessions
- Database connection pooling
- Load balancer ready

### Vertical Scaling
- Optimized database queries
- Efficient caching strategies
- Lazy loading on frontend
- Pagination for large datasets

---

## Deployment Architecture

### Docker Compose (Development)
```yaml
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]

  backend:
    build: ./backend
    ports: ["4000:4000"]

  postgres:
    image: postgres:15

  redis:
    image: redis:7-alpine
```

### Production Deployment
- Frontend: Vercel / Netlify (CDN)
- Backend: AWS ECS / Railway
- Database: AWS RDS / Managed PostgreSQL
- Cache: AWS ElastiCache / Managed Redis
- Files: AWS S3 (if needed)

---

## Monitoring & Logging

### Application Monitoring
- Health check endpoints
- Performance metrics
- Error tracking
- User activity logs

### Infrastructure Monitoring
- Docker container health
- Database performance
- Redis memory usage
- API response times

---

## Disaster Recovery

### Backup Strategy
- Daily database backups
- Point-in-time recovery
- Redundant Redis instances
- Version-controlled codebase

### Recovery Procedures
1. Database restoration from backup
2. Redis cache rebuild
3. Application redeployment
4. Data integrity verification