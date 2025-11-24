# Entity Relationship Diagram

## Database Schema Overview

The Mission Control Dashboard uses PostgreSQL with Prisma ORM. The schema follows a normalized design with proper relationships and constraints.

---

## ERD Diagram

```
┌─────────────────────────────────────┐
│              USERS                   │
├─────────────────────────────────────┤
│ PK: id (UUID)                       │
│ email (STRING, UNIQUE)              │
│ password (STRING)                   │
│ role (ENUM: ADMIN|TRAINER|LEARNER)  │
│ createdAt (DATETIME)                │
│ updatedAt (DATETIME)                │
│ deletedAt (DATETIME?)               │
└─────────────────────────────────────┘
              │
              │ 1:1
              ↓
┌─────────────────────────────────────┐
│         PLAYER_PROFILES              │
├─────────────────────────────────────┤
│ PK: id (UUID)                       │
│ FK: userId (UUID)                   │
│ displayName (STRING)                │
│ currentMissionId (UUID?)            │
│ totalScore (INT)                    │
│ missionsCompleted (INT)             │
│ missionsAttempted (INT)             │
│ totalTimeSpent (INT)                │
│ lastActiveAt (DATETIME)             │
│ createdAt (DATETIME)                │
│ updatedAt (DATETIME)                │
└─────────────────────────────────────┘
              │
              │ 1:N
              ↓
┌─────────────────────────────────────┐     ┌─────────────────────────────────────┐
│         MISSION_RESULTS              │     │            MISSIONS                  │
├─────────────────────────────────────┤     ├─────────────────────────────────────┤
│ PK: id (UUID)                       │     │ PK: id (UUID)                       │
│ FK: missionId (UUID)                │←────│ title (STRING)                      │
│ FK: playerId (UUID)                 │     │ description (TEXT)                  │
│ score (FLOAT)                       │     │ difficulty (ENUM: EASY|MED|HARD)    │
│ timeSpent (INT)                     │     │ type (ENUM: PvE|PvP)                │
│ completed (BOOLEAN)                 │     │ duration (INT)                      │
│ startedAt (DATETIME)                │     │ learningObjectives (JSON)           │
│ completedAt (DATETIME?)             │     │ status (ENUM: DRAFT|ACTIVE|ARCH)    │
│ createdAt (DATETIME)                │     │ FK: createdBy (UUID)                │
│ updatedAt (DATETIME)                │     │ createdAt (DATETIME)                │
└─────────────────────────────────────┘     │ updatedAt (DATETIME)                │
                                            │ deletedAt (DATETIME?)               │
                                            └─────────────────────────────────────┘
```

---

## Table Definitions

### Users Table
Primary table for authentication and authorization.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| password | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| role | ENUM | NOT NULL | User role (ADMIN, TRAINER, LEARNER) |
| createdAt | TIMESTAMP | NOT NULL | Account creation time |
| updatedAt | TIMESTAMP | NOT NULL | Last update time |
| deletedAt | TIMESTAMP | NULLABLE | Soft delete timestamp |

---

### Player Profiles Table
Game-specific profile for users with LEARNER role.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| userId | UUID | FOREIGN KEY, UNIQUE | Reference to Users table |
| displayName | VARCHAR(100) | NOT NULL | Player display name |
| currentMissionId | UUID | FOREIGN KEY, NULLABLE | Currently active mission |
| totalScore | INTEGER | DEFAULT 0 | Cumulative score |
| missionsCompleted | INTEGER | DEFAULT 0 | Number of completed missions |
| missionsAttempted | INTEGER | DEFAULT 0 | Number of attempted missions |
| totalTimeSpent | INTEGER | DEFAULT 0 | Total time in minutes |
| lastActiveAt | TIMESTAMP | NOT NULL | Last activity timestamp |
| createdAt | TIMESTAMP | NOT NULL | Profile creation time |
| updatedAt | TIMESTAMP | NOT NULL | Last update time |

---

### Missions Table
Training missions created by administrators.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| title | VARCHAR(200) | NOT NULL | Mission title |
| description | TEXT | NOT NULL | Mission description |
| difficulty | ENUM | NOT NULL | Difficulty level (EASY, MEDIUM, HARD) |
| type | ENUM | NOT NULL | Mission type (PvE, PvP) |
| duration | INTEGER | NOT NULL | Expected duration in minutes |
| learningObjectives | JSON | NOT NULL | Array of learning objectives |
| status | ENUM | NOT NULL | Mission status (DRAFT, ACTIVE, ARCHIVED) |
| createdBy | UUID | FOREIGN KEY | Reference to Users table |
| createdAt | TIMESTAMP | NOT NULL | Mission creation time |
| updatedAt | TIMESTAMP | NOT NULL | Last update time |
| deletedAt | TIMESTAMP | NULLABLE | Soft delete timestamp |

---

### Mission Results Table
Records of player performance in missions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| missionId | UUID | FOREIGN KEY | Reference to Missions table |
| playerId | UUID | FOREIGN KEY | Reference to Player Profiles |
| score | FLOAT | NOT NULL | Achievement score (0-100) |
| timeSpent | INTEGER | NOT NULL | Time spent in minutes |
| completed | BOOLEAN | DEFAULT FALSE | Completion status |
| startedAt | TIMESTAMP | NOT NULL | Mission start time |
| completedAt | TIMESTAMP | NULLABLE | Mission completion time |
| createdAt | TIMESTAMP | NOT NULL | Record creation time |
| updatedAt | TIMESTAMP | NOT NULL | Last update time |

---

## Relationships

### One-to-One
- Users ↔ PlayerProfiles (via userId)

### One-to-Many
- Users → Missions (via createdBy)
- PlayerProfiles → MissionResults (via playerId)
- Missions → MissionResults (via missionId)

### Many-to-Many
- Players ↔ Missions (through MissionResults)

---

## Indexes

### Primary Indexes
- users.id
- player_profiles.id
- missions.id
- mission_results.id

### Secondary Indexes
- users.email (UNIQUE)
- users.role
- player_profiles.userId (UNIQUE)
- missions.status
- missions.difficulty
- missions.type
- mission_results.missionId
- mission_results.playerId
- mission_results.completed

### Composite Indexes
- mission_results.(playerId, missionId)
- missions.(status, difficulty)

---

## Constraints

### Foreign Key Constraints
- player_profiles.userId → users.id (CASCADE DELETE)
- player_profiles.currentMissionId → missions.id (SET NULL)
- missions.createdBy → users.id (RESTRICT)
- mission_results.missionId → missions.id (CASCADE)
- mission_results.playerId → player_profiles.id (CASCADE)

### Check Constraints
- missions.duration > 0
- mission_results.score >= 0 AND score <= 100
- mission_results.timeSpent >= 0

### Default Values
- users.createdAt = NOW()
- users.updatedAt = NOW()
- player_profiles.totalScore = 0
- player_profiles.missionsCompleted = 0
- mission_results.completed = FALSE

---

## Sample Queries

### Get player with profile
```sql
SELECT u.*, p.*
FROM users u
JOIN player_profiles p ON p.userId = u.id
WHERE u.id = ?;
```

### Get mission with completion stats
```sql
SELECT
  m.*,
  COUNT(mr.id) as total_attempts,
  COUNT(CASE WHEN mr.completed THEN 1 END) as completions,
  AVG(mr.score) as avg_score,
  AVG(mr.timeSpent) as avg_time
FROM missions m
LEFT JOIN mission_results mr ON mr.missionId = m.id
WHERE m.id = ?
GROUP BY m.id;
```

### Get player progress
```sql
SELECT
  p.*,
  COUNT(mr.id) as missions_played,
  AVG(mr.score) as avg_score,
  SUM(mr.timeSpent) as total_time
FROM player_profiles p
LEFT JOIN mission_results mr ON mr.playerId = p.id
WHERE p.id = ?
GROUP BY p.id;
```