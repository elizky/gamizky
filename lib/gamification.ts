/**
 * Gamification utilities for automatic XP and reward calculation
 */

export interface TaskXPCalculation {
  totalXP: number;
  skillRewards: Record<string, number>;
  coinReward: number;
  breakdown: {
    baseXP: number;
    difficultyMultiplier: number;
    durationBonus: number;
    finalXP: number;
  };
}

/**
 * Calculate automatic XP and rewards based on task difficulty and duration
 */
export function calculateTaskRewards(
  difficulty: 'easy' | 'medium' | 'hard',
  estimatedDuration: number, // in minutes
  primarySkill: string
): TaskXPCalculation {
  // Base XP values by difficulty
  const baseXPByDifficulty = {
    easy: 25,
    medium: 50,
    hard: 100
  };

  // Difficulty multipliers
  const difficultyMultipliers = {
    easy: 1.0,
    medium: 1.5,
    hard: 2.0
  };

  // Calculate base XP
  const baseXP = baseXPByDifficulty[difficulty];
  
  // Apply difficulty multiplier
  const difficultyMultiplier = difficultyMultipliers[difficulty];
  
  // Duration bonus: Fixed bonuses to avoid OP long tasks
  let durationBonus = 0;
  if (estimatedDuration > 0) {
    if (estimatedDuration <= 30) {
      durationBonus = 10; // Hasta 30 min → +10 XP
    } else if (estimatedDuration <= 60) {
      durationBonus = 20; // 31 a 60 min → +20 XP
    } else if (estimatedDuration <= 120) {
      durationBonus = 30; // 61 a 120 min → +30 XP
    } else {
      durationBonus = 40; // Más de 120 min → +40 XP (tope)
    }
  }

  // Calculate final XP
  const finalXP = Math.round((baseXP + durationBonus) * difficultyMultiplier);

  // Give all XP to the primary skill only
  const skillRewards: Record<string, number> = {};
  
  // 5 habilidades principales
  const allSkills = ['physical', 'wisdom', 'mental', 'social', 'creativity'];
  allSkills.forEach(skill => {
    skillRewards[skill] = 0;
  });
  
  // Assign all XP to primary skill (for now, later we can add proportional distribution)
  skillRewards[primarySkill] = finalXP;

  // Calculate coin reward: XP_final * 0.1
  const coinReward = Math.round(finalXP * 0.1);

  return {
    totalXP: finalXP,
    skillRewards,
    coinReward,
    breakdown: {
      baseXP,
      difficultyMultiplier,
      durationBonus,
      finalXP
    }
  };
}

/**
 * Get XP multiplier for recurring tasks to prevent farming
 */
export function getRecurringXPMultiplier(
  recurringType: string | null,
  completionsToday: number,
  completionsThisWeek: number
): number {
  if (!recurringType) return 1.0;

  switch (recurringType) {
    case 'daily':
      // Full XP for first completion, reduced for subsequent (in case of bugs)
      return completionsToday === 0 ? 1.0 : 0.1;
    
    case 'weekly':
      // Full XP for first completion this week
      return completionsThisWeek === 0 ? 1.0 : 0.1;
    
    case 'monthly':
      // Always full XP for monthly tasks
      return 1.0;
    
    case 'x_per_week':
    case 'x_per_month':
      // Full XP for each completion within the target
      return 1.0;
    
    default:
      return 1.0;
  }
}

/**
 * Format XP breakdown for display
 */
export function formatXPBreakdown(calculation: TaskXPCalculation): string {
  const { breakdown } = calculation;
  return [
    `Base: ${breakdown.baseXP} XP`,
    `Dificultad: x${breakdown.difficultyMultiplier}`,
    breakdown.durationBonus > 0 ? `Duración: +${breakdown.durationBonus} XP` : null,
    `Total: ${breakdown.finalXP} XP`
  ].filter(Boolean).join(' | ');
}

/**
 * Get difficulty emoji and color
 */
export function getDifficultyInfo(difficulty: 'easy' | 'medium' | 'hard') {
  const difficultyMap = {
    easy: { emoji: '🟢', color: 'green', label: 'Fácil' },
    medium: { emoji: '🟡', color: 'yellow', label: 'Medio' },
    hard: { emoji: '🔴', color: 'red', label: 'Difícil' }
  };
  
  return difficultyMap[difficulty];
}

/**
 * Calculate XP required for a specific level using formula: 200 * N^1.4
 */
export function getXPRequiredForLevel(level: number): number {
  return Math.round(200 * Math.pow(level, 1.4));
}

/**
 * Calculate level from total XP using inverse formula
 */
export function calculateLevel(totalXP: number): number {
  // Inverse of 200 * N^1.4: N = (totalXP / 200)^(1/1.4)
  const level = Math.pow(totalXP / 200, 1 / 1.4);
  return Math.floor(level) + 1;
}

/**
 * Calculate XP needed for next level
 */
export function getXPForNextLevel(currentLevel: number): number {
  return getXPRequiredForLevel(currentLevel);
}

/**
 * Calculate current level progress
 */
export function getLevelProgress(totalXP: number): {
  currentLevel: number;
  xpInCurrentLevel: number;
  xpNeededForNext: number;
  progressPercentage: number;
} {
  const currentLevel = calculateLevel(totalXP);
  const xpForCurrentLevel = getXPRequiredForLevel(currentLevel - 1);
  const xpForNextLevel = getXPRequiredForLevel(currentLevel);
  const xpInCurrentLevel = totalXP - xpForCurrentLevel;
  const xpNeededForNext = xpForNextLevel - totalXP;
  const progressPercentage = (xpInCurrentLevel / (xpForNextLevel - xpForCurrentLevel)) * 100;

  return {
    currentLevel,
    xpInCurrentLevel,
    xpNeededForNext,
    progressPercentage
  };
}