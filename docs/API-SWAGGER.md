# API Documentation

## Base URL
```
Development: http://localhost:4000/api
Production: https://api.mission-control.sg/api
```

## Authentication

All endpoints except login require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### Authentication

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "admin@navytraining.sg",
  "password": "Admin123!"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_001",
    "email": "admin@navytraining.sg",
    "role": "ADMIN"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid credentials"
}
```

---

#### POST /auth/logout
Invalidate the current session.

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

#### GET /auth/me
Get current authenticated user.

**Response (200 OK):**
```json
{
  "id": "user_001",
  "email": "admin@navytraining.sg",
  "role": "ADMIN",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

---

### Missions

#### GET /missions
Get list of all missions with pagination and filters.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `difficulty` (string): Filter by difficulty (EASY, MEDIUM, HARD)
- `type` (string): Filter by type (PvE, PvP)
- `status` (string): Filter by status (DRAFT, ACTIVE, ARCHIVED)
- `search` (string): Search in title and description

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "mission_001",
      "title": "Singapore Strait Patrol",
      "description": "Navigate through busy shipping lanes...",
      "difficulty": "MEDIUM",
      "type": "PvE",
      "status": "ACTIVE",
      "duration": 30,
      "learningObjectives": ["Navigation", "Communication"],
      "createdAt": "2025-01-15T00:00:00Z",
      "createdBy": "admin_001"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

#### GET /missions/:id
Get a specific mission by ID.

**Response (200 OK):**
```json
{
  "id": "mission_001",
  "title": "Singapore Strait Patrol",
  "description": "Navigate through busy shipping lanes...",
  "difficulty": "MEDIUM",
  "type": "PvE",
  "status": "ACTIVE",
  "duration": 30,
  "learningObjectives": ["Navigation", "Communication"],
  "completions": 45,
  "averageScore": 82.5,
  "averageTime": 28,
  "createdAt": "2025-01-15T00:00:00Z",
  "updatedAt": "2025-01-20T00:00:00Z",
  "createdBy": {
    "id": "admin_001",
    "name": "Admin User"
  }
}
```

---

#### POST /missions
Create a new mission (ADMIN only).

**Request Body:**
```json
{
  "title": "Jurong Port Defense",
  "description": "Coordinate defense operations...",
  "difficulty": "HARD",
  "type": "PvP",
  "duration": 45,
  "learningObjectives": ["Tactical Planning", "Team Coordination"],
  "status": "DRAFT"
}
```

**Response (201 Created):**
```json
{
  "id": "mission_002",
  "title": "Jurong Port Defense",
  "description": "Coordinate defense operations...",
  "difficulty": "HARD",
  "type": "PvP",
  "status": "DRAFT",
  "duration": 45,
  "learningObjectives": ["Tactical Planning", "Team Coordination"],
  "createdAt": "2025-01-25T00:00:00Z",
  "createdBy": "admin_001"
}
```

---

#### PUT /missions/:id
Update a mission (ADMIN/TRAINER with restrictions).

**Request Body:**
```json
{
  "title": "Updated Mission Title",
  "description": "Updated description",
  "difficulty": "MEDIUM",
  "status": "ACTIVE"
}
```

**Response (200 OK):**
```json
{
  "id": "mission_001",
  "title": "Updated Mission Title",
  "description": "Updated description",
  "difficulty": "MEDIUM",
  "status": "ACTIVE",
  "updatedAt": "2025-01-26T00:00:00Z"
}
```

---

#### DELETE /missions/:id
Soft delete a mission (ADMIN only).

**Response (200 OK):**
```json
{
  "message": "Mission deleted successfully"
}
```

---

#### PATCH /missions/:id/status
Update mission status (ADMIN only).

**Request Body:**
```json
{
  "status": "ARCHIVED"
}
```

**Response (200 OK):**
```json
{
  "id": "mission_001",
  "status": "ARCHIVED",
  "updatedAt": "2025-01-26T00:00:00Z"
}
```

---

### Players

#### GET /players
Get list of all players with metrics.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `search` (string): Search player names

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "player_001",
      "displayName": "Cadet Tan Wei Ming",
      "currentMission": "mission_001",
      "missionsCompleted": 5,
      "averageScore": 85.5,
      "winRate": 0.75,
      "totalTimeSpent": 180,
      "lastActive": "2025-01-25T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

#### GET /players/:id
Get detailed player profile.

**Response (200 OK):**
```json
{
  "id": "player_001",
  "displayName": "Cadet Tan Wei Ming",
  "email": "cadet.tan@navytraining.sg",
  "currentMission": {
    "id": "mission_001",
    "title": "Singapore Strait Patrol",
    "progress": 0.65
  },
  "stats": {
    "missionsCompleted": 5,
    "missionsAttempted": 7,
    "averageScore": 85.5,
    "highestScore": 98,
    "winRate": 0.75,
    "totalTimeSpent": 180,
    "favoriteType": "PvE"
  },
  "recentMissions": [
    {
      "missionId": "mission_001",
      "title": "Singapore Strait Patrol",
      "completedAt": "2025-01-24T00:00:00Z",
      "score": 92,
      "timeSpent": 28
    }
  ]
}
```

---

#### GET /players/:id/progress
Get player's mission progress.

**Response (200 OK):**
```json
{
  "playerId": "player_001",
  "missionHistory": [
    {
      "missionId": "mission_001",
      "title": "Singapore Strait Patrol",
      "status": "COMPLETED",
      "score": 92,
      "timeSpent": 28,
      "completedAt": "2025-01-24T00:00:00Z"
    }
  ],
  "currentProgress": {
    "missionId": "mission_002",
    "title": "Jurong Port Defense",
    "startedAt": "2025-01-25T09:00:00Z",
    "progress": 0.35
  },
  "achievements": [
    {
      "id": "ach_001",
      "name": "First Victory",
      "unlockedAt": "2025-01-20T00:00:00Z"
    }
  ]
}
```

---

### Analytics

#### GET /analytics/overview
Get dashboard-level analytics.

**Response (200 OK):**
```json
{
  "missions": {
    "total": 25,
    "active": 18,
    "draft": 4,
    "archived": 3
  },
  "players": {
    "total": 150,
    "active": 89,
    "inactive": 61,
    "averageScore": 78.5
  },
  "recentActivity": {
    "completionsToday": 24,
    "completionsWeek": 145,
    "averageSessionTime": 32
  },
  "topMissions": [
    {
      "id": "mission_001",
      "title": "Singapore Strait Patrol",
      "completions": 45,
      "averageScore": 82.5
    }
  ],
  "topPlayers": [
    {
      "id": "player_001",
      "displayName": "Cadet Tan Wei Ming",
      "score": 1250,
      "missionsCompleted": 15
    }
  ]
}
```

---

#### GET /analytics/missions/:id
Get mission-specific analytics.

**Response (200 OK):**
```json
{
  "missionId": "mission_001",
  "stats": {
    "totalAttempts": 67,
    "completions": 45,
    "completionRate": 0.672,
    "averageScore": 82.5,
    "averageTime": 28,
    "minTime": 22,
    "maxTime": 35
  },
  "difficultyDistribution": {
    "failed": 22,
    "passed": 45,
    "excellent": 12
  },
  "scoreDistribution": [
    { "range": "0-50", "count": 5 },
    { "range": "51-70", "count": 10 },
    { "range": "71-85", "count": 18 },
    { "range": "86-100", "count": 12 }
  ],
  "recentCompletions": [
    {
      "playerId": "player_001",
      "playerName": "Cadet Tan",
      "score": 92,
      "timeSpent": 28,
      "completedAt": "2025-01-25T10:00:00Z"
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

- Login endpoint: 5 requests per 15 minutes per IP
- API endpoints: 100 requests per minute per user
- Exceeded limits return 429 Too Many Requests