export interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  type: 'SIMULATION' | 'THEORY' | 'PRACTICAL' | 'ASSESSMENT';
  duration: number;
  learningObjectives: string[];
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  results?: MissionResult[];
  _count?: {
    results: number;
  };
}

export interface MissionResult {
  id: string;
  missionId: string;
  playerId: string;
  score: number;
  isCompleted: boolean;
  completedAt?: string | null;
  timeTaken?: number | null;
  createdAt: string;
  updatedAt: string;
  mission?: Mission;
  player?: PlayerProfile;
}

export interface PlayerProfile {
  id: string;
  userId: string;
  callSign: string;
  rank: string;
  experiencePoints: number;
  level: number;
  missionsCompleted: number;
  totalPlayTime: number;
  averageScore: number;
  achievements: any[];
  createdAt: string;
  updatedAt: string;
  user?: User;
  results?: MissionResult[];
}

export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'TRAINER' | 'LEARNER';
  createdAt: string;
  updatedAt: string;
  playerProfile?: PlayerProfile;
}