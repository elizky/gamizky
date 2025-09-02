/**
 * Utilities for handling recurring tasks logic
 */

export interface RecurringTask {
  completions: Date[];
  recurring: boolean;
  recurringType?: string | null;
  recurringTarget?: number | null;
}

/**
 * Get the start of the week (Monday) for a given date
 */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/**
 * Get the end of the week (Sunday) for a given date
 */
export function getWeekEnd(date: Date): Date {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return weekEnd;
}

/**
 * Get the start of the month for a given date
 */
export function getMonthStart(date: Date): Date {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

/**
 * Get the end of the month for a given date
 */
export function getMonthEnd(date: Date): Date {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Get completions for the current day
 */
export function getTodayCompletions(completions: Date[], today: Date = new Date()): Date[] {
  return completions.filter(completion => isSameDay(completion, today));
}

/**
 * Get completions for the current week
 */
export function getThisWeekCompletions(completions: Date[], today: Date = new Date()): Date[] {
  const weekStart = getWeekStart(today);
  const weekEnd = getWeekEnd(today);
  
  return completions.filter(completion => 
    completion >= weekStart && completion <= weekEnd
  );
}

/**
 * Get completions for the current month
 */
export function getThisMonthCompletions(completions: Date[], today: Date = new Date()): Date[] {
  const monthStart = getMonthStart(today);
  const monthEnd = getMonthEnd(today);
  
  return completions.filter(completion => 
    completion >= monthStart && completion <= monthEnd
  );
}

/**
 * Check if a recurring task is available to be completed today
 */
export function isTaskAvailableToday(task: RecurringTask, today: Date = new Date()): boolean {
  // Non-recurring tasks are always available if not completed today
  if (!task.recurring) {
    return getTodayCompletions(task.completions, today).length === 0;
  }

  switch (task.recurringType) {
    case 'daily':
      // Available if not completed today
      return getTodayCompletions(task.completions, today).length === 0;
    
    case 'weekly':
      // Available if not completed this week
      return getThisWeekCompletions(task.completions, today).length === 0;
    
    case 'monthly':
      // Available if not completed this month
      return getThisMonthCompletions(task.completions, today).length === 0;
    
    case 'x_per_week':
      // Available if completed less than target times this week
      const weekCompletions = getThisWeekCompletions(task.completions, today);
      const weeklyTarget = task.recurringTarget || 1;
      return weekCompletions.length < weeklyTarget;
    
    case 'x_per_month':
      // Available if completed less than target times this month
      const monthCompletions = getThisMonthCompletions(task.completions, today);
      const monthlyTarget = task.recurringTarget || 1;
      return monthCompletions.length < monthlyTarget;
    
    default:
      // Default to daily behavior
      return getTodayCompletions(task.completions, today).length === 0;
  }
}

/**
 * Get the completion status for display
 */
export function getTaskCompletionStatus(task: RecurringTask, today: Date = new Date()): {
  isCompleted: boolean;
  completionsToday: number;
  completionsThisWeek: number;
  completionsThisMonth: number;
  isAvailable: boolean;
  nextAvailable?: Date;
} {
  const todayCompletions = getTodayCompletions(task.completions, today);
  const weekCompletions = getThisWeekCompletions(task.completions, today);
  const monthCompletions = getThisMonthCompletions(task.completions, today);
  const isAvailable = isTaskAvailableToday(task, today);

  return {
    isCompleted: todayCompletions.length > 0,
    completionsToday: todayCompletions.length,
    completionsThisWeek: weekCompletions.length,
    completionsThisMonth: monthCompletions.length,
    isAvailable,
  };
}

/**
 * Get progress information for recurring tasks
 */
export function getRecurringProgress(task: RecurringTask, today: Date = new Date()): {
  current: number;
  target: number;
  percentage: number;
  period: string;
} | null {
  if (!task.recurring || !task.recurringTarget) return null;

  switch (task.recurringType) {
    case 'x_per_week':
      const weekCompletions = getThisWeekCompletions(task.completions, today);
      return {
        current: weekCompletions.length,
        target: task.recurringTarget,
        percentage: Math.min((weekCompletions.length / task.recurringTarget) * 100, 100),
        period: 'semana'
      };
    
    case 'x_per_month':
      const monthCompletions = getThisMonthCompletions(task.completions, today);
      return {
        current: monthCompletions.length,
        target: task.recurringTarget,
        percentage: Math.min((monthCompletions.length / task.recurringTarget) * 100, 100),
        period: 'mes'
      };
    
    default:
      return null;
  }
}

/**
 * Check if a task has been neglected (not completed in 3+ days)
 */
export function isTaskNeglected(task: RecurringTask, today: Date = new Date()): {
  isNeglected: boolean;
  daysSinceLastCompletion: number;
  lastCompletionDate?: Date;
} {
  if (!task.recurring || task.completions.length === 0) {
    // For new tasks or non-recurring, check creation date vs today
    return {
      isNeglected: false,
      daysSinceLastCompletion: 0,
    };
  }

  // Get the most recent completion
  const lastCompletion = task.completions[task.completions.length - 1];
  const daysDiff = Math.floor((today.getTime() - lastCompletion.getTime()) / (1000 * 60 * 60 * 24));

  return {
    isNeglected: daysDiff >= 3,
    daysSinceLastCompletion: daysDiff,
    lastCompletionDate: lastCompletion,
  };
}

/**
 * Get neglect indicator info for UI display
 */
export function getNeglectIndicator(task: RecurringTask, today: Date = new Date()): {
  show: boolean;
  emoji: string;
  message: string;
  severity: 'mild' | 'moderate' | 'severe';
} | null {
  const neglectInfo = isTaskNeglected(task, today);
  
  if (!neglectInfo.isNeglected) {
    return null;
  }

  const days = neglectInfo.daysSinceLastCompletion;
  
  if (days >= 7) {
    return {
      show: true,
      emoji: '💀',
      message: `¡${days} días sin hacer esta tarea!`,
      severity: 'severe'
    };
  } else if (days >= 5) {
    return {
      show: true,
      emoji: '😰',
      message: `${days} días sin hacer esta tarea`,
      severity: 'moderate'
    };
  } else if (days >= 3) {
    return {
      show: true,
      emoji: '😔',
      message: `${days} días sin hacer esta tarea`,
      severity: 'mild'
    };
  }
  
  return null;
}
