# Project Folder Structure

## Overview
The Mission Control Dashboard follows a modular, feature-based organization with clear separation between frontend and backend codebases.

---

## Complete Structure

```
mission-control-dashboard/
│
├── backend/                        # Backend API server
│   ├── src/
│   │   ├── api/                   # API route handlers
│   │   │   ├── auth/              # Authentication endpoints
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.routes.ts
│   │   │   ├── missions/          # Mission management
│   │   │   │   ├── missions.controller.ts
│   │   │   │   ├── missions.service.ts
│   │   │   │   └── missions.routes.ts
│   │   │   ├── players/           # Player management
│   │   │   │   ├── players.controller.ts
│   │   │   │   ├── players.service.ts
│   │   │   │   └── players.routes.ts
│   │   │   └── analytics/         # Analytics endpoints
│   │   │       ├── analytics.controller.ts
│   │   │       ├── analytics.service.ts
│   │   │       └── analytics.routes.ts
│   │   │
│   │   ├── middleware/            # Express middleware
│   │   │   ├── auth.middleware.ts      # JWT verification
│   │   │   ├── rbac.middleware.ts      # Role-based access
│   │   │   ├── validation.middleware.ts # Request validation
│   │   │   └── error.middleware.ts     # Error handling
│   │   │
│   │   ├── services/              # Business logic services
│   │   │   ├── cache.service.ts        # Redis caching
│   │   │   ├── jwt.service.ts          # Token management
│   │   │   └── websocket.service.ts    # Real-time updates
│   │   │
│   │   ├── schemas/               # Zod validation schemas
│   │   │   ├── auth.schema.ts
│   │   │   ├── mission.schema.ts
│   │   │   ├── player.schema.ts
│   │   │   └── common.schema.ts
│   │   │
│   │   ├── utils/                # Utility functions
│   │   │   ├── logger.ts
│   │   │   ├── constants.ts
│   │   │   └── helpers.ts
│   │   │
│   │   ├── prisma/               # Database ORM
│   │   │   ├── schema.prisma           # Database schema
│   │   │   ├── seed.ts                 # Seed data
│   │   │   └── migrations/             # Database migrations
│   │   │
│   │   ├── config/               # Configuration
│   │   │   ├── database.ts
│   │   │   ├── redis.ts
│   │   │   └── app.ts
│   │   │
│   │   └── index.ts              # Application entry point
│   │
│   ├── tests/                    # Test files
│   │   ├── unit/
│   │   ├── integration/
│   │   └── fixtures/
│   │
│   ├── .env.example              # Environment variables template
│   ├── .eslintrc.js             # ESLint configuration
│   ├── .prettierrc              # Prettier configuration
│   ├── Dockerfile                # Docker container definition
│   ├── package.json              # Dependencies and scripts
│   ├── tsconfig.json             # TypeScript configuration
│   └── README.md                 # Backend documentation
│
├── frontend/                     # Frontend Next.js application
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Authentication pages
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── logout/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── dashboard/           # Main dashboard
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── missions/            # Mission management
│   │   │   ├── page.tsx              # Mission list
│   │   │   ├── [id]/                 # Mission detail
│   │   │   │   └── page.tsx
│   │   │   ├── create/               # Create mission
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── players/             # Player management
│   │   │   ├── page.tsx              # Player list
│   │   │   ├── [id]/                 # Player detail
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── analytics/           # Analytics views
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/                 # API route handlers (if needed)
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   └── globals.css          # Global styles
│   │
│   ├── components/              # React components
│   │   ├── ui/                 # UI components (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/             # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── navigation.tsx
│   │   │
│   │   ├── missions/            # Mission-specific components
│   │   │   ├── MissionCard.tsx
│   │   │   ├── MissionForm.tsx
│   │   │   ├── MissionList.tsx
│   │   │   └── MissionDetail.tsx
│   │   │
│   │   ├── players/             # Player-specific components
│   │   │   ├── PlayerCard.tsx
│   │   │   ├── PlayerList.tsx
│   │   │   ├── PlayerProgress.tsx
│   │   │   └── PlayerStats.tsx
│   │   │
│   │   └── common/              # Shared components
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── DataTable.tsx
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useMissions.ts
│   │   ├── usePlayers.ts
│   │   └── useWebSocket.ts
│   │
│   ├── lib/                     # Libraries and utilities
│   │   ├── api/                # API client
│   │   │   ├── client.ts
│   │   │   ├── missions.ts
│   │   │   ├── players.ts
│   │   │   └── auth.ts
│   │   │
│   │   ├── utils/              # Utility functions
│   │   │   ├── cn.ts                 # Class name helper
│   │   │   ├── formatters.ts
│   │   │   └── validators.ts
│   │   │
│   │   └── constants.ts        # Application constants
│   │
│   ├── public/                 # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── styles/                 # Additional styles
│   │   └── components/
│   │
│   ├── types/                  # TypeScript type definitions
│   │   ├── api.ts
│   │   ├── mission.ts
│   │   ├── player.ts
│   │   └── auth.ts
│   │
│   ├── .env.example            # Environment variables template
│   ├── .eslintrc.js           # ESLint configuration
│   ├── .prettierrc            # Prettier configuration
│   ├── Dockerfile              # Docker container definition
│   ├── next.config.js          # Next.js configuration
│   ├── package.json            # Dependencies and scripts
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── tsconfig.json           # TypeScript configuration
│   └── README.md               # Frontend documentation
│
├── docs/                       # Project documentation
│   ├── PRD.md                 # Product requirements
│   ├── README.md              # Main project documentation
│   ├── system-architecture.md # Architecture overview
│   ├── api-swagger.md         # API documentation
│   ├── erd.md                 # Database schema
│   └── folder-structure.md    # This file
│
├── docker-compose.yml          # Multi-container Docker setup
├── .gitignore                 # Git ignore patterns
├── .env.example               # Root environment variables
├── LICENSE                    # License file
└── README.md                  # Project root documentation
```

---

## Key Directories Explained

### Backend Structure

#### `/backend/src/api/`
Contains all API endpoint handlers organized by domain (auth, missions, players, analytics). Each domain has:
- **Controller**: Handles HTTP requests/responses
- **Service**: Contains business logic
- **Routes**: Defines endpoint paths

#### `/backend/src/middleware/`
Express middleware for cross-cutting concerns:
- Authentication verification
- Role-based access control
- Request validation
- Error handling

#### `/backend/src/schemas/`
Zod schemas for runtime validation of:
- Request payloads
- Response data
- Database models

#### `/backend/src/prisma/`
Database-related files:
- Schema definition
- Migrations
- Seed data

### Frontend Structure

#### `/frontend/app/`
Next.js App Router pages and layouts. Organized by feature with nested routing.

#### `/frontend/components/`
React components organized by:
- **ui/**: Base UI components (buttons, forms, etc.)
- **layout/**: Page layout components
- **Feature-specific**: Components for missions, players, etc.
- **common/**: Shared components

#### `/frontend/hooks/`
Custom React hooks for:
- Authentication state
- Data fetching
- WebSocket connections

#### `/frontend/lib/`
Utility libraries and API clients for backend communication.

---

## File Naming Conventions

### TypeScript/JavaScript Files
- **Components**: PascalCase (e.g., `MissionCard.tsx`)
- **Utilities/Hooks**: camelCase (e.g., `useAuth.ts`)
- **Routes**: kebab-case folders (e.g., `/mission-detail/`)

### Style Files
- **Global styles**: `globals.css`
- **Module styles**: `ComponentName.module.css`

### Configuration Files
- Dotfiles at root of each project (`.eslintrc.js`, `.prettierrc`)
- Config files use appropriate extensions (`tsconfig.json`, `tailwind.config.js`)

---

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://user:pass@localhost:5432/mission_control
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_WS_URL=ws://localhost:4000
```

---

## Build Output Directories

### Backend
- `/backend/dist/` - Compiled TypeScript output
- `/backend/node_modules/` - Dependencies

### Frontend
- `/frontend/.next/` - Next.js build output
- `/frontend/out/` - Static export (if used)
- `/frontend/node_modules/` - Dependencies

---

## Development vs Production

### Development Files
- `.env.local` - Local environment variables
- `*.test.ts` - Test files
- `/tests/` - Test directories

### Production Files
- Dockerfiles - Container definitions
- docker-compose.yml - Multi-container orchestration
- Build outputs in dist/ and .next/

### Ignored Files (Git)
- node_modules/
- .env files (except .env.example)
- Build directories (dist/, .next/)
- Log files
- IDE configurations