// Tipos que coinciden exactamente con la respuesta de Prisma

// Usuario de Prisma
export interface PrismaUser {
  id: string;
  name: string;
  email: string;
  level: number;
  totalXP: number;
  coins: number;
  streak: number;
  avatar: string;
  character: {
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
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  skillRewards: Record<string, number>;
  coinReward: number;
  estimatedDuration: number;
  recurring: boolean;
  recurringType: 'daily' | 'weekly' | 'monthly';
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  categoryId: string;
  category: PrismaTaskCategory;
}

// Categoría de tarea de Prisma
export interface PrismaTaskCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  primarySkill: string; // string genérico de Prisma
  subcategories: string[];
  createdAt: Date;
  updatedAt: Date;
}
