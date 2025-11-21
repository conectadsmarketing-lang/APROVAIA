
export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
}

export enum PlanType {
  FREE = 'FREE',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMESTERLY = 'SEMESTERLY',
  YEARLY = 'YEARLY',
}

export type SubscriptionStatus = 'ACTIVE' | 'PENDING' | 'OVERDUE' | 'CANCELED';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  plan: PlanType;
  xp: number;
  level: number;
  streak: number;
  coins: number;
  badges: string[];
  createdAt: string;
  dailyGoal: number; // Minutes
  studiedToday: number; // Minutes
  englishLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  
  // Security & Monetization
  subscriptionStatus: SubscriptionStatus;
  lastPaymentDate?: string;
  nextBillingDate?: string;
  currentSessionId?: string; // For Anti-fraud
  
  // Admin Flags
  isBanned?: boolean;
}

export interface Payment {
  id: string;
  userId: string;
  referenceId: string; // PicPay Reference
  value: number;
  status: 'created' | 'paid' | 'failed';
  qrCodeBase64?: string;
  qrCodeText?: string;
  paymentUrl?: string;
  createdAt: string;
  paidAt?: string;
}

export interface Edital {
  id: string;
  userId: string;
  title: string;
  institution: string;
  position: string;
  examDate?: string;
  subjects: Subject[];
  createdAt: string;
  status: 'processing' | 'ready' | 'error';
  summary?: string;
  strategicTips?: string[];
}

export interface Subject {
  id: string;
  name: string;
  weight: number; // 1-5 importance
  topics: Topic[];
  progress: number; // 0-100
  color: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Topic {
  id: string;
  name: string;
  studied: boolean;
  reviewCount: number;
  lastReview?: string;
  masteryLevel?: 'low' | 'medium' | 'high';
}

export interface StudySession {
  id: string;
  userId: string;
  subjectId: string;
  durationMinutes: number;
  date: string;
  xpEarned: number;
}

export interface Flashcard {
  id: string;
  subjectId: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  nextReview: string;
  type?: 'general' | 'english';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  xpReward: number;
  type: 'study' | 'review' | 'exercise' | 'system' | 'english' | 'duel';
}

export interface Simulado {
  id: string;
  title: string;
  totalQuestions: number;
  score?: number; // Correct answers
  status: 'pending' | 'completed';
  date: string;
  type: 'general' | 'english';
}

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

export interface EnglishLesson {
  id: string;
  title: string;
  level: string;
  completed: boolean;
  content: {
    vocabulary: { word: string; translation: string; example: string }[];
    dialogue: { speaker: string; text: string; translation: string }[];
    grammarTip: string;
  };
}

// --- AprovaIA Predictive Types ---

export interface PredictiveData {
  approvalProbability: number;
  projectedScore: number;
  weakestSubject: string;
  strongestSubject: string;
  trends: { date: string; score: number }[];
  insights: string[];
}

export interface Duel {
  id: string;
  opponentName: string;
  opponentAvatar: string;
  subject: string;
  scoreUser: number;
  scoreOpponent: number;
  status: 'waiting' | 'active' | 'finished';
  winner?: 'user' | 'opponent' | 'draw';
}

export interface HealthLog {
  date: string;
  mood: 'happy' | 'anxious' | 'tired' | 'focused';
  focusTime: number;
  journalEntry?: string;
}

export interface StoreItem {
  id: string;
  name: string;
  price: number;
  type: 'avatar' | 'theme' | 'effect';
  icon: string;
  owned: boolean;
}

// --- AprovaIA Admin Types ---

export interface SystemConfig {
  appName: string;
  welcomeMessage: string;
  monthlyPrice: number;
  features: {
    english: boolean;
    duels: boolean;
    tutorIA: boolean;
    store: boolean;
  };
  colors: {
    primary: string;
  };
}

export interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  totalEditais: number;
  weeklyGrowth: number; // Percentage
  newSubscriptionsMonth: number;
  churnRate: number;
  paywallConversion: number;
  avgStudyHours: number;
  totalSimulados: number;
  totalAIMessages: number;
  recentActivity: { type: string; user: string; time: string }[];
  errorLogs: number;
}

export interface MockDB {
  users: User[];
  editais: Edital[];
  sessions: StudySession[];
  flashcards: Flashcard[];
  tasks: Task[];
  simulados: Simulado[];
  achievements: Achievement[];
  englishLessons: EnglishLesson[];
  duels: Duel[];
  healthLogs: HealthLog[];
  storeItems: StoreItem[];
  payments: Payment[];
  config: SystemConfig;
}