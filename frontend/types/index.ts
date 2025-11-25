/**
 * TypeScript Type Definitions for Maritime Training Mission Control Dashboard
 */

// ============================================================================
// Enums
// ============================================================================

export enum UserRole {
  PLAYER = 'PLAYER',
  TRAINER = 'TRAINER',
  ADMIN = 'ADMIN'
}

export enum MissionStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED'
}

export enum MissionDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export enum AttemptStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  ABANDONED = 'ABANDONED'
}

// ============================================================================
// Core Entities
// ============================================================================

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum MissionType {
  PVE = 'PVE',
  PVP = 'PVP'
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: MissionDifficulty;
  type: MissionType;
  duration: number; // in minutes
  status: MissionStatus;
  learningObjectives: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  _count?: {
    results: number;
  };
}

export interface MissionObjective {
  id: string;
  missionId: string;
  title: string;
  description: string;
  points: number;
  isRequired: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface MissionScenario {
  id: string;
  missionId: string;
  name: string;
  description: string;
  config: Record<string, any>; // JSON configuration
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Player {
  id: string;
  userId: string;
  username: string;
  user?: User;
  level: number;
  experiencePoints: number;
  totalMissionsCompleted: number;
  totalMissionsAttempted: number;
  averageScore: number;
  rank?: string;
  achievements?: PlayerAchievement[];
  statistics?: PlayerStatistics;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerStatistics {
  id: string;
  playerId: string;
  totalPlayTime: number; // in minutes
  bestScore: number;
  worstScore: number;
  averageCompletionTime: number; // in minutes
  successRate: number; // percentage
  lastActive?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerAchievement {
  id: string;
  playerId: string;
  achievementId: string;
  achievement?: Achievement;
  unlockedAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  points: number;
  createdAt: string;
  updatedAt: string;
}

export interface MissionAttempt {
  id: string;
  playerId: string;
  player?: Player;
  missionId: string;
  mission?: Mission;
  status: AttemptStatus;
  score: number;
  startedAt: string;
  completedAt?: string;
  duration?: number; // in minutes
  objectivesCompleted: number;
  totalObjectives: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Authentication
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  refreshTokens: () => Promise<void>;
  isAuthenticated: boolean;
}

// ============================================================================
// API Responses
// ============================================================================

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// ============================================================================
// Query Parameters
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface MissionFilters extends PaginationParams {
  status?: MissionStatus;
  difficulty?: MissionDifficulty;
  type?: MissionType;
  search?: string;
}

export interface PlayerFilters extends PaginationParams {
  search?: string;
  minLevel?: number;
  maxLevel?: number;
  sortBy?: 'level' | 'experiencePoints' | 'totalMissionsCompleted' | 'averageScore';
  sortOrder?: 'asc' | 'desc';
}

export interface AttemptFilters extends PaginationParams {
  playerId?: string;
  missionId?: string;
  status?: AttemptStatus;
  startDate?: string;
  endDate?: string;
}

// ============================================================================
// Form Data
// ============================================================================

export interface MissionFormData {
  title: string;
  description: string;
  difficulty: MissionDifficulty;
  type: MissionType;
  duration: number;
  status: MissionStatus;
  learningObjectives: string[];
}

export interface PlayerProfileUpdateData {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export interface AttemptSubmissionData {
  score: number;
  objectivesCompleted: number;
  totalObjectives: number;
  feedback?: string;
  duration: number;
}

// ============================================================================
// Dashboard Statistics
// ============================================================================

export interface DashboardStats {
  totalMissions: number;
  activeMissions: number;
  totalPlayers: number;
  totalAttempts: number;
  averageScore: number;
  recentActivity: RecentActivity[];
}

export interface RecentActivity {
  id: string;
  type: 'mission_created' | 'mission_completed' | 'player_registered' | 'achievement_unlocked';
  message: string;
  timestamp: string;
  userId?: string;
  user?: User;
}

export interface LeaderboardEntry {
  rank: number;
  player: Player;
  score: number;
  completedMissions: number;
}

// ============================================================================
// Component Props
// ============================================================================

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
}
