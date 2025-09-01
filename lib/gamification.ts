export function calculateLevel(totalXP: number): number {
  return Math.floor(totalXP / 200) + 1
}

export function calculateXPForNextLevel(level: number): number {
  return level * 200
}

export function calculateCurrentLevelXP(totalXP: number, level: number): number {
  return totalXP - (level - 1) * 200
}

export function getDifficultyMultiplier(difficulty: "easy" | "medium" | "hard"): number {
  switch (difficulty) {
    case "easy":
      return 1
    case "medium":
      return 1.5
    case "hard":
      return 2
    default:
      return 1
  }
}

export function getStreakBonus(streak: number): number {
  if (streak >= 30) return 2
  if (streak >= 14) return 1.5
  if (streak >= 7) return 1.25
  return 1
}

export function formatXP(xp: number): string {
  return `${xp.toLocaleString()} XP`
}

export function formatCoins(coins: number): string {
  return `${coins.toLocaleString()} Coinzkys 💰`
}
