# Mission Control Dashboard - Frontend

Modern React frontend for the Maritime Training Mission Control Dashboard built with Next.js 15, TypeScript, and Tailwind CSS.

## Phase 3 Implementation Status

### Completed Features

#### 1. Authentication System
- [x] Login page with form validation (Zod + React Hook Form)
- [x] Auth context provider with JWT handling
- [x] Protected route middleware
- [x] Automatic token refresh
- [x] Role-based access control

#### 2. API Integration
- [x] Axios-based API client with interceptors
- [x] TanStack Query (React Query) setup
- [x] Automatic auth header injection
- [x] Error handling and retry logic
- [x] Token management (localStorage)

#### 3. Dashboard Layout
- [x] Responsive sidebar navigation
- [x] Role-based menu items
- [x] User profile dropdown
- [x] Collapsible sidebar
- [x] Logout functionality

#### 4. Mission Pages
- [x] Mission list with pagination
- [x] Mission filtering (status, difficulty, search)
- [x] Mission detail view
- [x] Mission objectives display
- [x] Mission scenarios display
- [x] Mission statistics

#### 5. Player Pages
- [x] Player list with pagination (ADMIN/TRAINER only)
- [x] Player filtering and sorting
- [x] Player profile cards
- [x] XP progress display
- [x] Player statistics

#### 6. Additional Pages
- [x] Dashboard home with stats
- [x] Leaderboard page
- [x] Role-based navigation

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS 3.4
- **State Management**: TanStack Query 5.62
- **Forms**: React Hook Form 7.54 + Zod 3.23
- **HTTP Client**: Axios
- **Icons**: Heroicons (inline SVG)

## Project Structure

```
frontend/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx                 # Login page
│   ├── (dashboard)/
│   │   ├── layout.tsx                   # Dashboard layout with sidebar
│   │   ├── page.tsx                     # Dashboard home
│   │   ├── missions/
│   │   │   ├── page.tsx                 # Mission list
│   │   │   └── [id]/
│   │   │       └── page.tsx             # Mission detail
│   │   ├── players/
│   │   │   └── page.tsx                 # Player list
│   │   └── leaderboard/
│   │       └── page.tsx                 # Leaderboard
│   ├── globals.css                      # Global styles
│   ├── layout.tsx                       # Root layout
│   ├── page.tsx                         # Root page (redirect)
│   └── providers.tsx                    # Root providers
├── components/
│   └── auth/
│       ├── AuthProvider.tsx             # Auth context
│       └── ProtectedRoute.tsx           # Route protection
├── lib/
│   ├── api.ts                           # API client
│   ├── auth.ts                          # Auth service
│   └── utils.ts                         # Utility functions
├── types/
│   └── index.ts                         # TypeScript types
├── .env.local                           # Environment variables
├── package.json
├── tailwind.config.js                   # Tailwind configuration
└── tsconfig.json                        # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on http://localhost:4000

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Update .env.local with your API URL
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Development

```bash
# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Build

```bash
# Type check
npm run type-check

# Build for production
npm run build

# Start production server
npm start
```

## Authentication Flow

1. User enters credentials on login page
2. AuthProvider calls `/api/auth/login`
3. JWT tokens stored in localStorage
4. All API requests include `Authorization: Bearer <token>` header
5. Token automatically refreshed on 401 errors
6. User redirected to login on refresh failure

## Role-Based Access

### ADMIN
- Full access to all features
- Can create/edit missions
- Can view all players
- Can access analytics

### TRAINER
- Can create/edit missions
- Can view all players
- Can access analytics
- Cannot modify system settings

### PLAYER
- Can view and start missions
- Can view own profile
- Can view leaderboard
- Cannot access admin features

## API Integration

### TanStack Query Setup

```typescript
// Fetch missions with filters
const { data, isLoading, error } = useQuery<PaginatedResponse<Mission>>({
  queryKey: ['missions', filters],
  queryFn: () => api.get<PaginatedResponse<Mission>>('/missions', filters),
});
```

### API Client Features

- Automatic JWT token injection
- Token refresh on 401 errors
- Request/response interceptors
- Error handling with retry logic
- TypeScript type safety

## Styling & Theming

### Dark Sci-Fi Theme

- **Primary**: Cyan blue (#0284c7)
- **Secondary**: Purple/magenta
- **Background**: Dark navy/black (#0f172a, #020617)
- **Accent**: Success/warning/error states

### Custom Tailwind Classes

```typescript
// Gradient text
gradient-text

// Sci-fi border glow
shadow-sci-fi
shadow-sci-fi-lg

// Background pattern
bg-grid-pattern

// Status colors
text-success, text-warning, text-error, text-info
```

## Forms & Validation

### React Hook Form + Zod

```typescript
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(loginSchema),
});
```

## Demo Credentials

```
Admin:   admin@maritime.sg / admin123
Trainer: trainer@maritime.sg / trainer123
Player:  player@maritime.sg / player123
```

## Next Steps (Phase 4)

- [ ] Mission create/edit forms
- [ ] Player profile detail page
- [ ] Real-time mission attempt tracking
- [ ] Analytics dashboard
- [ ] Advanced filtering and search
- [ ] File upload for avatars
- [ ] Notifications system
- [ ] Settings page

## Performance

- Production build: ~102 kB First Load JS
- Type-safe with 100% TypeScript coverage
- Optimized images and fonts
- Code splitting per route
- Static page generation where possible

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Proprietary - Singapore Maritime Training System
