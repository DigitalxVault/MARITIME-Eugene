Full Stack Developer - Technical Assessment
Overview

Mission Control Dashboard for Maritime Training — TL;DR
Build a secure, scalable, and user-friendly web app for Singapore’s maritime training organizations to manage missions, track player progress, analyze learning outcomes, and control access for administrators, trainers, and learners. Core features include real-time dashboards, robust security, and multi-role support. Designed for use by defense and education sectors (e.g., SAF, NUS, NTU).

Contents
Overview	1
Mission Control Dashboard for Maritime Training — TL;DR	1
Contents	1
Context	3
The Challenge: What you will build	3
Technical Requirements	3
Why This Matters	3
Technical Requirements	4
1. Frontend (React/Next.js)	4
Tech Stack (Must Use):	4
Required Features:	4
A. Mission Management Dashboard	4
B. Player Progress Tracking	5
C. Role-Based Access Control (RBAC)	5
D. Real-Time Dashboard (Simplified)	5
E. Responsive Design	6
2. Backend (Node.js/Express)	6
Tech Stack (Must Use):	6
Required Features:	6
A. RESTful API Design	6
B. Authentication & Authorization	7
C. Database Design (PostgreSQL + Prisma)	7
D. Caching Strategy (Redis - Basic)	7
E. Security Implementation	8
3. Third-Party Integrations (Optional - Bonus Points)	8
A. AI/LLM Integration (Bonus)	8
4. DevOps & Deployment	9
Required:	9
A. Dockerization	9
B. Deployment Documentation	9
Deliverables	10
1. Code Repository (GitHub)	10
2. Documentation (README.md)	10
3. Live Demo (Preferred but Optional)	10
4. Brief Video Walkthrough (Optional but Recommended)	11
Evaluation Criteria	11
Code Quality (30%)	11
Functionality (30%)	11
Architecture & Design (20%)	11
UI/UX (10%)	12
Security (5%)	12
Documentation & Setup (5%)	12
Bonus Points	12
Timeline	13
Setup Starter Commands	13
Sample Data Structure	14
Questions?	16
Important Notes	17




Context
Singapore's defense and education sectors increasingly rely on immersive training simulations to prepare naval officers, cadets, and maritime professionals for real-world scenarios. These training systems require robust mission management platforms where administrators can create, monitor, and analyze learning experiences while ensuring security, scalability, and proper access control.
The Challenge: What you will build
You'll build a Mission Control Dashboard - a web application that enables game administrators and trainers to manage missions (learning scenarios) for an immersive naval training game. This system will be used by organizations like the Singapore Armed Forces (SAF) or local educational institutions (such as NUS, NTU, or specialized maritime academies) to:

●	Create and configure training missions with varying difficulty levels
●	Track player progress and performance in real-time
●	Analyze learning outcomes and mission effectiveness
●	Manage access for different user roles (administrators, trainers, learners)
Technical Requirements
This assignment demonstrates your full-stack capabilities across React/Next.js, Node.js/Express, PostgreSQL, and real-time features. It reflects the technologies and challenges you'll encounter at MAGES Studio, where you'll be building systems for AR/VR/AI-powered educational and healthcare applications in Singapore.
Why This Matters
In Singapore's context, where maritime security and naval training are critical, such systems must be:

●	Secure: Handle sensitive training data with proper authentication and authorization
●	Scalable: Support multiple cohorts of trainees simultaneously
●	Reliable: Ensure mission data integrity and system availability
●	User-Friendly: Enable non-technical administrators to manage training content effectively

 
Technical Requirements
1. Frontend (React/Next.js)
Tech Stack (Must Use):
●	Next.js 15+ (App Router)
●	TypeScript
●	React 19+ with modern hooks
●	TanStack Query (for data fetching/caching)
●	React Hook Form + Zod (form validation)
●	Tailwind CSS (styling)
●	shadcn/ui or similar component library (optional but recommended)
Required Features:
A. Mission Management Dashboard
●	Mission Editor: Create/edit missions with:
○	Title, description, difficulty level (Easy/Medium/Hard)
○	Mission type (PvE Campaign / PvP Multiplayer)
○	Duration estimate
○	Learning objectives
○	Status (Draft/Active/Archived)
●	Mission List:
○	Table/grid view with search and filters (by difficulty, type, status)
○	Pagination
○	Sort by creation date, difficulty, etc.
●	Mission Details View:
○	Display full mission information
○	Show player completion statistics
○	View associated player results
B. Player Progress Tracking
●	Player List: View all players with their:
○	Current mission progress
○	Completion rates
○	Performance metrics (average score, win rate)
●	Player Detail View:
○	Mission history with results
○	Performance trends (charts/graphs)
○	Current mission status
C. Role-Based Access Control (RBAC)
Implement three user roles:

●	ADMIN: Full access (create, edit, delete missions, view all players)
●	TRAINER: View missions, view assigned players' progress, limited editing
●	LEARNER: View own progress and mission history only
●	Protected routes based on user role
●	Conditional UI rendering based on permissions
D. Real-Time Dashboard (Simplified)
●	Live player activity feed (recent mission completions)
●	WebSocket connection for real-time updates (optional - can be polling if WebSocket is too complex)
●	Simple metrics display:
○	Total active missions
○	Total players
○	Recent completions count
E. Responsive Design
●	Mobile-first approach
●	Works on desktop and tablet (mobile optimization is bonus)

 
2. Backend (Node.js/Express)
Tech Stack (Must Use):
●	Node.js with Express.js
●	TypeScript
●	PostgreSQL database
●	Prisma ORM
●	Redis (for caching - at least session management)
●	JWT authentication
Required Features:
A. RESTful API Design
Implement the following endpoints:

Authentication:
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

Mission Management:
GET    /api/missions              (list with pagination, filters)
GET    /api/missions/:id         (get single mission)
POST   /api/missions             (create new mission - ADMIN only)
PUT    /api/missions/:id         (update mission - ADMIN/TRAINER)
DELETE /api/missions/:id         (soft delete - ADMIN only)
PATCH  /api/missions/:id/status  (update status - ADMIN only)

Player Management:
GET    /api/players               (list players with filters)
GET    /api/players/:id          (get player details)
GET    /api/players/:id/progress (get player progress)

Analytics:
GET    /api/analytics/overview   (dashboard stats)
GET    /api/analytics/missions/:id (mission-specific stats)
B. Authentication & Authorization
●	JWT-based authentication
●	Secure password hashing (bcrypt)
●	Role-based middleware for route protection
●	Session management with Redis (optional - can use JWT only)
C. Database Design (PostgreSQL + Prisma)
Design schema with the following entities:

●	Users: id, email, password, role (ADMIN/TRAINER/LEARNER), createdAt, updatedAt
●	Missions: id, title, description, difficulty, type, status, duration, createdAt, updatedAt, createdBy
●	PlayerProfiles: id, userId, displayName, playerTag, createdAt, updatedAt
●	MissionResults: id, missionId, playerId, completionStatus, score, timeSpent, createdAt

Implement:

●	Proper relations and foreign keys
●	Indexes for performance
●	Soft delete functionality (deletedAt field)
●	Database migrations
D. Caching Strategy (Redis - Basic)
●	Cache mission list (published missions)
●	Cache user sessions (if using session-based auth)
●	Basic cache invalidation on mission updates
E. Security Implementation
●	Input validation using Zod schemas
●	SQL injection prevention (Prisma handles this)
●	XSS protection (sanitize user inputs)
●	CORS configuration
●	Rate limiting on authentication endpoints
●	Helmet.js for security headers

 
3. Third-Party Integrations (Optional - Bonus Points)
A. AI/LLM Integration (Bonus)
If time permits, integrate an LLM API (OpenAI, Groq, or OpenRouter) to:

●	Mission Description Enhancement: Auto-generate or improve mission descriptions
●	Difficulty Assessment: Suggest difficulty level based on mission parameters

Example endpoint:

POST /api/ai/enhance-mission
{
  "missionId": "123",
  "field": "description"
}

 
4. DevOps & Deployment
Required:
A. Dockerization
●	Create Dockerfile for backend
●	Create Dockerfile for frontend (Next.js production build)
●	Docker Compose for local development with:
○	Backend service
○	Frontend service
○	PostgreSQL
○	Redis
B. Deployment Documentation
Provide clear documentation on:

●	How to build and run with Docker Compose locally
●	Environment variable configuration
●	Database migration process
●	Deployment steps for:
○	Option 1: AWS (EC2 + RDS + Redis on ElastiCache)
○	Option 2: Railway/Render/Fly.io (simpler deployment)
○	Option 3: Detailed localhost setup instructions

Note: Live deployment is preferred but not required. If you can't deploy, ensure the Docker Compose setup works perfectly locally.

 
Deliverables
1. Code Repository (GitHub)
●	Well-organized repository (monorepo or separate frontend/backend)
●	Clear folder structure
●	.env.example files with all required environment variables
●	Comprehensive .gitignore
●	Seed data for testing (at least 3 missions, 2-3 users with different roles)
2. Documentation (README.md)
Include:
●	Project Overview: Brief description
●	Tech Stack: List all technologies used
●	Setup Instructions:
○	Prerequisites
○	Installation steps
○	Database setup and migrations
○	Environment variables
○	How to run with Docker Compose
●	API Documentation: All endpoints with request/response examples
●	Database Schema: Prisma schema or ER diagram
●	Demo Credentials: Test users for each role
●	Known Issues/Limitations: Any incomplete features
3. Live Demo (Preferred but Optional)
●	Deploy the application and provide a live URL
●	Include demo credentials for different roles
4. Brief Video Walkthrough (Optional but Recommended)
●	3-5 minute video demonstrating:
○	Key features
○	Code structure highlights
○	How to run the project

 
Evaluation Criteria
Code Quality (30%)
●	Clean, readable, and well-structured code
●	Proper TypeScript usage with types/interfaces
●	Consistent coding style
●	Meaningful variable and function names
●	Proper error handling
Functionality (30%)
●	All core features working as expected
●	Proper authentication and authorization
●	Correct database operations
●	API endpoints working correctly
●	Role-based access control functioning
Architecture & Design (20%)
●	Scalable and maintainable architecture
●	Proper separation of concerns
●	Efficient database schema design
●	Smart caching strategies (basic implementation is fine)
UI/UX (10%)
●	Intuitive and user-friendly interface
●	Responsive design (at least desktop + tablet)
●	Loading states and error handling
●	Consistent styling
Security (5%)
●	Proper authentication implementation
●	Input validation
●	Secure password handling
Documentation & Setup (5%)
●	Clear and comprehensive documentation
●	Easy setup process
●	Docker Compose working smoothly

 
Bonus Points
●	AI/LLM Integration: Working AI features
●	Real-Time Features: WebSocket implementation (not just polling)
●	Advanced Caching: Sophisticated Redis caching strategies
●	Testing: Unit tests or integration tests
●	Performance Optimization: Lazy loading, code splitting
●	Live Deployment: Successfully deployed application

 
Timeline
Component	Recommended Breakdown
Day 1	Database design, Prisma setup, authentication API
Day 2	Mission management API, player management API
Day 3	Frontend setup, authentication, mission list/editor
Day 4	Player progress views, role-based access, dashboard
Day 5	Real-time features (if time), caching, polish
Day 6	Documentation, deployment (if applicable), testing

Submission Deadline: 6 days from assignment receipt

 
Setup Starter Commands
# Backend setup
mkdir mission-control-dashboard && cd mission-control-dashboard
mkdir backend frontend

# Backend
cd backend
npm init -y
npm install express typescript @types/node @types/express prisma @prisma/client
npm install bcrypt jsonwebtoken redis cors helmet express-rate-limit zod
npm install -D @types/bcrypt @types/jsonwebtoken @types/cors ts-node nodemon

# Frontend
cd ../frontend
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
npm install @tanstack/react-query react-hook-form zod @hookform/resolvers
npm install axios

# Docker
cd ..
touch docker-compose.yml
touch backend/Dockerfile
touch frontend/Dockerfile

 
Sample Data Structure
To help you understand the domain and Singapore context, here are example data structures:

// Example Missions (Singapore-focused scenarios)
{
  id: "mission_001",
  title: "Singapore Strait Patrol",
  description: "Navigate through the busy Singapore Strait while avoiding civilian traffic and maintaining maritime security protocols. This mission simulates real-world patrol scenarios in one of the world's busiest shipping lanes.",
  difficulty: "MEDIUM",
  type: "PvE",
  status: "ACTIVE",
  duration: 30, // minutes
  learningObjectives: ["Navigation", "Traffic Management", "Communication", "Situational Awareness"],
  createdAt: "2025-01-15",
  createdBy: "admin_user_id"
}

{
  id: "mission_002",
  title: "Jurong Port Defense",
  description: "Coordinate defense operations for Singapore's Jurong Port during a simulated security threat. Practice multi-vessel coordination and rapid response protocols.",
  difficulty: "HARD",
  type: "PvP",
  status: "ACTIVE",
  duration: 45,
  learningObjectives: ["Tactical Planning", "Team Coordination", "Crisis Management"],
  createdAt: "2025-01-16",
  createdBy: "admin_user_id"
}

{
  id: "mission_003",
  title: "Marina Bay Navigation",
  description: "Basic navigation exercise in Singapore's Marina Bay area. Perfect for cadets learning fundamental maritime navigation skills.",
  difficulty: "EASY",
  type: "PvE",
  status: "ACTIVE",
  duration: 20,
  learningObjectives: ["Basic Navigation", "Chart Reading", "Vessel Control"],
  createdAt: "2025-01-10",
  createdBy: "trainer_user_id"
}

// Player Progress (Trainee/Cadet)
{
  playerId: "player_001",
  displayName: "Cadet Tan Wei Ming",
  currentMission: "mission_001",
  missionsCompleted: 5,
  averageScore: 85.5,
  winRate: 0.75,
  totalTimeSpent: 180 // minutes
}

// Mission Result
{
  id: "result_001",
  missionId: "mission_001",
  playerId: "player_001",
  completionStatus: true,
  score: 92.5,
  timeSpent: 28, // minutes
  createdAt: "2025-01-20T10:30:00Z"
}

// User Roles (Singapore context)
{
  id: "user_admin_001",
  email: "admin@navytraining.sg",
  role: "ADMIN", // Full system access
  // Typically: Senior training officers, system administrators
}

{
  id: "user_trainer_001",
  email: "trainer@navytraining.sg",
  role: "TRAINER", // Can view and manage assigned trainees
  // Typically: Instructors, training coordinators
}

{
  id: "user_learner_001",
  email: "cadet.tan@navytraining.sg",
  role: "LEARNER", // Can only view own progress
  // Typically: Naval cadets, trainees, students
}

Note: These examples reflect realistic scenarios for Singapore's maritime training context. Feel free to adapt mission names and descriptions, but maintain the core data structure.

 
Questions?
If you have any questions about the requirements or need clarification, please email hr@mages.edu.sg with the subject: [Technical Assessment - Question]

 












Important Notes
1.	Focus on Core Features: Don't try to implement everything. A working system with core features is better than an incomplete system with many features.
2.	Quality over Quantity: We value clean, maintainable code over feature count.
3.	Documentation Matters: Clear setup instructions and API documentation are crucial. Remember that in Singapore's defense and education sectors, systems often need to be handed over to different teams or maintained by non-original developers.
4.	Security First: Proper authentication, authorization, and input validation are non-negotiable. In Singapore's context, where this system might handle sensitive training data for SAF or educational institutions, security cannot be an afterthought.
5.	Singapore Context: While not explicitly required in the code, consider how this system might be used:
○	Defense Sector: SAF naval training, where mission data might be classified or sensitive
○	Education Sector: Local universities (NUS, NTU) or polytechnics training maritime professionals
○	Regulatory Compliance: Consider data privacy (PDPA) and security requirements
○	Multi-lingual Support: While English is primary, consider how the system might scale to support other languages if needed
6.	Real-World Thinking: Think about how administrators would actually use this system. What workflows make sense? How would a trainer monitor 50+ cadets simultaneously? How would an admin quickly identify which missions need attention?

 

Good luck! We're excited to see your approach to building a practical, secure, and scalable mission management system.
