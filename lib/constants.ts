// Constantes de la aplicación GAMIZKY

// Configuración de XP
export const XP_CONFIG = {
  BASE_XP_PER_LEVEL: 200,
  XP_MULTIPLIER: 1.5,
  MIN_XP_FOR_LEVEL: 100,
} as const;

// Configuración de monedas
export const COIN_CONFIG = {
  BASE_COIN_REWARD: 25,
  BONUS_COIN_MULTIPLIER: 1.2,
  DAILY_STREAK_BONUS: 5,
} as const;

// Configuración de dificultad
export const DIFFICULTY_CONFIG = {
  EASY: { multiplier: 1.0, color: 'bg-green-500' },
  MEDIUM: { multiplier: 1.5, color: 'bg-yellow-500' },
  HARD: { multiplier: 2.0, color: 'bg-red-500' },
} as const;

// Configuración de habilidades
export const SKILLS = {
  PHYSICAL: 'physical',
  WISDOM: 'wisdom',
  MENTAL: 'mental',
  SOCIAL: 'social',
  CREATIVITY: 'creativity',
  DISCIPLINE: 'discipline',
} as const;

// Configuración de recurrencia
export const RECURRENCE_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
} as const;

// Configuración de categorías por defecto
export const DEFAULT_CATEGORIES = [
  {
    name: 'Ejercicio',
    icon: '💪',
    color: 'bg-blue-500',
    primarySkill: SKILLS.PHYSICAL,
    description: 'Actividades físicas y deportes',
  },
  {
    name: 'Estudio',
    icon: '📚',
    color: 'bg-green-500',
    primarySkill: SKILLS.WISDOM,
    description: 'Aprendizaje y desarrollo intelectual',
  },
  {
    name: 'Trabajo',
    icon: '💼',
    color: 'bg-purple-500',
    primarySkill: SKILLS.MENTAL,
    description: 'Tareas laborales y proyectos',
  },
  {
    name: 'Social',
    icon: '👥',
    color: 'bg-pink-500',
    primarySkill: SKILLS.SOCIAL,
    description: 'Interacciones sociales y networking',
  },
  {
    name: 'Creatividad',
    icon: '🎨',
    color: 'bg-orange-500',
    primarySkill: SKILLS.CREATIVITY,
    description: 'Proyectos artísticos y creativos',
  },
  {
    name: 'Organización',
    icon: '📋',
    color: 'bg-teal-500',
    primarySkill: SKILLS.DISCIPLINE,
    description: 'Planificación y organización personal',
  },
] as const;

// Configuración de personajes
export const CHARACTERS = [
  {
    name: 'Guerrero',
    avatar: '⚔️',
    cost: 0,
    unlocked: true,
    description: 'Un valiente guerrero que lucha por sus objetivos',
  },
  {
    name: 'Mago',
    avatar: '🔮',
    cost: 100,
    unlocked: false,
    description: 'Un sabio mago que domina el conocimiento',
  },
  {
    name: 'Arquero',
    avatar: '🏹',
    cost: 150,
    unlocked: false,
    description: 'Un hábil arquero que apunta a la excelencia',
  },
  {
    name: 'Druida',
    avatar: '🌿',
    cost: 200,
    unlocked: false,
    description: 'Un druida conectado con la naturaleza y la sabiduría',
  },
] as const;

// Configuración de la aplicación
export const APP_CONFIG = {
  NAME: 'GAMIZKY',
  VERSION: '1.0.0',
  DESCRIPTION: 'Gamificación Personal para Productividad',
  AUTHOR: 'Tu Nombre',
  WEBSITE: 'https://gamizky.com',
} as const;
