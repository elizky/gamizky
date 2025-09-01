export interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  totalXP: number;
  coins: number;
  streak: number;
  avatar: string;
  character: Character;
  skills: UserSkills;
}

export interface UserSkills {
  physical: SkillLevel;
  wisdom: SkillLevel;
  mental: SkillLevel;
  social: SkillLevel;
  creativity: SkillLevel;
  discipline: SkillLevel;
}

export interface SkillLevel {
  level: number;
  currentXP: number;
  totalXP: number;
  xpToNextLevel: number;
}

export interface Character {
  id: string;
  name: string;
  avatar: string;
  unlocked: boolean;
  cost?: number;
}

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

export interface SkillRewards {
  physical?: number;
  wisdom?: number;
  mental?: number;
  social?: number;
  creativity?: number;
  discipline?: number;
}

export interface TaskCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  primarySkill: keyof UserSkills;
  subcategories: string[];
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  type: 'internal' | 'external' | 'cosmetic' | 'character';
  category: string;
  icon: string;
  available: boolean;
  claimed: boolean;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface CalendarEvent {
  id: string;
  taskId: string;
  date: Date;
  completed: boolean;
  type: 'scheduled' | 'recurring';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  requirement: string;
  skillRequirement?: Partial<Record<keyof UserSkills, number>>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  totalXP: number;
  coins: number;
  streak: number;
  avatar: string;
  character: Character;
  skills: {
    physical: SkillLevel;
    wisdom: SkillLevel;
    mental: SkillLevel;
    social: SkillLevel;
    creativity: SkillLevel;
    discipline: SkillLevel;
  };
}
