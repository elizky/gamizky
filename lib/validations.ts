import { z } from 'zod';

// Esquemas de validación usando Zod

// Validación de perfil de usuario
export const profileSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  avatar: z.string()
    .min(1, 'El avatar es requerido')
    .max(10, 'El avatar no puede exceder 10 caracteres'),
});

// Validación de tarea
export const taskSchema = z.object({
  title: z.string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no puede exceder 100 caracteres'),
  description: z.string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),
  categories: z.array(z.object({
    categoryId: z.string().min(1, 'Debe seleccionar una categoría'),
    points: z.number()
      .min(1, 'Los puntos deben ser al menos 1')
      .max(1000, 'Los puntos no pueden exceder 1000'),
  })).min(1, 'Debe seleccionar al menos una categoría'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  estimatedDuration: z.number()
    .min(0, 'La duración no puede ser negativa')
    .max(480, 'La duración no puede exceder 8 horas'),
  recurring: z.boolean().default(true),
  recurringType: z.enum(['daily', 'weekly', 'monthly']),
});

// Validación de categoría
export const categorySchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  description: z.string()
    .max(200, 'La descripción no puede exceder 200 caracteres')
    .optional(),
  icon: z.string()
    .min(1, 'El icono es requerido')
    .max(10, 'El icono no puede exceder 10 caracteres'),
  color: z.string()
    .min(1, 'El color es requerido')
    .regex(/^bg-\w+-\d+$/, 'El color debe ser una clase de Tailwind válida'),
  primarySkill: z.enum(['physical', 'wisdom', 'mental', 'social', 'creativity']),
  subcategories: z.array(z.string()).default([]),
});

// Validación de búsqueda
export const searchSchema = z.object({
  query: z.string()
    .min(1, 'La búsqueda no puede estar vacía')
    .max(100, 'La búsqueda no puede exceder 100 caracteres'),
  filters: z.object({
    status: z.enum(['all', 'pending', 'completed']).default('all'),
    difficulty: z.enum(['all', 'easy', 'medium', 'hard']).default('all'),
    category: z.string().optional(),
  }).default({
    status: 'all',
    difficulty: 'all',
  }),
});

// Validación de paginación
export const paginationSchema = z.object({
  page: z.number()
    .min(1, 'La página debe ser al menos 1')
    .default(1),
  limit: z.number()
    .min(1, 'El límite debe ser al menos 1')
    .max(100, 'El límite no puede exceder 100')
    .default(20),
});

// Validación de filtros de tareas
export const taskFiltersSchema = z.object({
  status: z.enum(['all', 'pending', 'completed']).default('all'),
  difficulty: z.enum(['all', 'easy', 'medium', 'hard']).default('all'),
  category: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  search: z.string().optional(),
});

// Validación de configuración de usuario
export const userSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    reminders: z.boolean().default(true),
  }).default({
    email: true,
    push: true,
    reminders: true,
  }),
  privacy: z.object({
    profilePublic: z.boolean().default(false),
    showProgress: z.boolean().default(true),
    showAchievements: z.boolean().default(true),
  }).default({
    profilePublic: false,
    showProgress: true,
    showAchievements: true,
  }),
});

// Tipos inferidos de los esquemas
export type ProfileFormData = z.infer<typeof profileSchema>;
export type TaskFormData = z.infer<typeof taskSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type SearchFormData = z.infer<typeof searchSchema>;
export type PaginationData = z.infer<typeof paginationSchema>;
export type TaskFilters = z.infer<typeof taskFiltersSchema>;
export type UserSettings = z.infer<typeof userSettingsSchema>;

// Funciones de validación personalizadas
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una mayúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una minúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('La contraseña debe contener al menos un carácter especial');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUsername = (username: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (username.length < 3) {
    errors.push('El nombre de usuario debe tener al menos 3 caracteres');
  }
  
  if (username.length > 20) {
    errors.push('El nombre de usuario no puede exceder 20 caracteres');
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.push('El nombre de usuario solo puede contener letras, números, guiones y guiones bajos');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};
