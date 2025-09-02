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
  
  // Duration bonus: +1 XP per minute, with diminishing returns after 60 minutes
  let durationBonus = 0;
  if (estimatedDuration > 0) {
    if (estimatedDuration <= 60) {
      durationBonus = estimatedDuration * 1; // 1 XP per minute
    } else {
      durationBonus = 60 + (estimatedDuration - 60) * 0.5; // 0.5 XP per minute after 60
    }
  }

  // Calculate final XP
  const finalXP = Math.round((baseXP + durationBonus) * difficultyMultiplier);

  // Give all XP to the primary skill only
  const skillRewards: Record<string, number> = {};
  
  // All available skills initialized to 0
  const allSkills = ['physical', 'wisdom', 'mental', 'social', 'creativity', 'discipline'];
  allSkills.forEach(skill => {
    skillRewards[skill] = 0;
  });
  
  // Assign all XP to primary skill
  skillRewards[primarySkill] = finalXP;

  // Calculate coin reward based on difficulty and duration
  const baseCoinsByDifficulty = {
    easy: 10,
    medium: 25,
    hard: 50
  };
  
  const coinReward = baseCoinsByDifficulty[difficulty] + Math.round(estimatedDuration / 10);

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
 * Calculate level from total XP
 */
export function calculateLevel(totalXP: number): number {
  // Level formula: level = floor(totalXP / 200) + 1
  return Math.floor(totalXP / 200) + 1;
}

/**
 * Calculate XP needed for next level
 */
export function getXPForNextLevel(currentLevel: number): number {
  return currentLevel * 200;
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
  const xpForCurrentLevel = (currentLevel - 1) * 200;
  const xpInCurrentLevel = totalXP - xpForCurrentLevel;
  const xpNeededForNext = 200 - xpInCurrentLevel;
  const progressPercentage = (xpInCurrentLevel / 200) * 100;

  return {
    currentLevel,
    xpInCurrentLevel,
    xpNeededForNext,
    progressPercentage
  };
}