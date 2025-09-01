// ========================================
// TIPOS DE BASE DE DATOS (PRISMA)
// ========================================

// Usuario de Prisma (base)
export interface PrismaUser {
  id: string;
  name: string | null;
  email: string;
  level: number;
  totalXP: number;
  coins: number;
  streak: number;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

// Usuario con datos extendidos (como lo devuelve getProfile)
export interface PrismaUserWithExtras {
  id: string;
  name: string | null;
  email: string;
  level: number;
  totalXP: number;
  coins: number;
  streak: number;
  avatar: string;
  character?: {
    id: string;
    name: string;
    avatar: string;
    unlocked: boolean;
    cost: number | null;
  } | null;
  skills: {
    physical: { level: number; currentXP: number; totalXP: number; xpToNextLevel: number };
    wisdom: { level: number; currentXP: number; totalXP: number; xpToNextLevel: number };
    mental: { level: number; currentXP: number; totalXP: number; xpToNextLevel: number };
    social: { level: number; currentXP: number; totalXP: number; xpToNextLevel: number };
    creativity: { level: number; currentXP: number; totalXP: number; xpToNextLevel: number };
    discipline: { level: number; currentXP: number; totalXP: number; xpToNextLevel: number };
  };
}

// Tarea de Prisma
export interface PrismaTask {
  id: string;
  title: string;
  description: string;
  subcategory: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
  coinReward: number;
  skillRewards: Record<string, number>;
  completed: boolean;
  completedAt: Date | null;
  dueDate: Date | null;
  recurring: boolean;
  recurringType: 'daily' | 'weekly' | 'monthly' | null;
  scheduledFor: Date | null;
  spontaneous: boolean;
  estimatedDuration: number | null;
  categoryId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  category: PrismaTaskCategory;
}

// Categoría de tarea de Prisma
export interface PrismaTaskCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  primarySkill: string;
  subcategories: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Habilidad de usuario de Prisma
export interface PrismaUserSkill {
  id: string;
  userId: string;
  skillType: string;
  level: number;
  currentXP: number;
  totalXP: number;
  xpToNextLevel: number;
}

// Character de Prisma
export interface PrismaCharacter {
  id: string;
  name: string;
  avatar: string;
  unlocked: boolean;
  cost: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// ========================================
// TIPOS DE APLICACIÓN (FRONTEND)
// ========================================

// Tipos de skills
export type SkillType = 'physical' | 'wisdom' | 'mental' | 'social' | 'creativity' | 'discipline';

export interface SkillLevel {
  level: number;
  currentXP: number;
  totalXP: number;
  xpToNextLevel: number;
}

export interface UserSkills {
  physical: SkillLevel;
  wisdom: SkillLevel;
  mental: SkillLevel;
  social: SkillLevel;
  creativity: SkillLevel;
  discipline: SkillLevel;
}

export interface SkillRewards {
  physical?: number;
  wisdom?: number;
  mental?: number;
  social?: number;
  creativity?: number;
  discipline?: number;
}

// Usuario de aplicación (con datos procesados)
export interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  totalXP: number;
  coins: number;
  streak: number;
  avatar: string;
  skills: UserSkills;
}

// Tarea de aplicación
export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  subcategory?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  skillRewards: SkillRewards;
  coinReward: number;
  completed: boolean;
  completedAt?: Date;
  dueDate?: Date;
  recurring: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly';
  scheduledFor?: Date;
  spontaneous?: boolean;
  estimatedDuration?: number;
}

// Categoría de tarea
export interface TaskCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  primarySkill: SkillType;
  subcategories: string[];
}

// Character
export interface Character {
  id: string;
  name: string;
  avatar: string;
  unlocked: boolean;
  cost?: number;
}

// ========================================
// TIPOS DE COMPONENTES Y FORMULARIOS
// ========================================

// Datos para crear tarea
export interface CreateTaskData {
  title: string;
  description: string;
  categories: Array<{ categoryId: string; points: number }>;
  difficulty: 'easy' | 'medium' | 'hard';
  skillRewards?: Record<string, number>;
  coinReward?: number;
  estimatedDuration?: number;
  recurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly';
  completed?: boolean;
}

// Datos para actualizar tarea
export interface UpdateTaskData {
  title?: string;
  description?: string;
  categoryId?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  skillRewards?: Record<string, number>;
  coinReward?: number;
  estimatedDuration?: number;
  recurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly';
  completed?: boolean;
}

// Respuesta de API
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ========================================
// TIPOS DE ESTADÍSTICAS
// ========================================

export interface StatsOverview {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  currentStreak: number;
  totalXP: number;
}

export interface CategoryStats {
  categoryName: string;
  categoryIcon: string;
  primarySkill: string;
  total: number;
  completed: number;
  totalCoins: number;
  completionRate: number;
}

export interface TaskActivity {
  completedAt: Date | null;
  coinReward: number;
  category: {
    name: string;
    primarySkill: string;
  };
}

export interface StatsData {
  overview: StatsOverview;
  tasksByCategory: CategoryStats[];
  tasksLast30Days: TaskActivity[];
  skills: Array<{
    id: string;
    skillType: string;
    level: number;
    currentXP: number;
    totalXP: number;
    xpToNextLevel: number;
  }>;
}