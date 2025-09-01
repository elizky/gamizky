'use server';

import { auth } from '@/auth';
import { db } from '@/server/db/prisma';

export async function getAchievements() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'No autorizado' };
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    // Obtener todos los achievements
    const achievements = await db.achievement.findMany({
      orderBy: [
        { rarity: 'desc' },
        { createdAt: 'asc' }
      ]
    });

    // Obtener achievements del usuario
    const userAchievements = await db.userAchievement.findMany({
      where: { userId: user.id },
      include: {
        achievement: true
      }
    });

    // Combinar achievements con progreso del usuario
    const achievementsWithProgress = achievements.map(achievement => {
      const userProgress = userAchievements.find(ua => ua.achievementId === achievement.id);
      
      return {
        ...achievement,
        unlocked: userProgress?.unlocked || false,
        unlockedAt: userProgress?.unlockedAt || null
      };
    });

    return { success: true, data: achievementsWithProgress };
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return { success: false, error: 'Error al obtener achievements' };
  }
}

export async function checkAndUnlockAchievements(userId: string) {
  try {
    // Obtener datos del usuario y sus estadísticas
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        skills: true,
        tasks: true,
        challenges: {
          include: { challenge: true }
        },
        rewards: true
      }
    });

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    // Obtener achievements disponibles
    const achievements = await db.achievement.findMany();

    // Obtener achievements ya desbloqueados
    const unlockedAchievements = await db.userAchievement.findMany({
      where: { userId }
    });

    const unlockedIds = unlockedAchievements.map(ua => ua.achievementId);
    const newlyUnlocked = [];

    for (const achievement of achievements) {
      // Skip si ya está desbloqueado
      if (unlockedIds.includes(achievement.id)) continue;

      let shouldUnlock = false;

      // Verificar condiciones según el tipo de achievement
      switch (achievement.requirement) {
        case 'Completar 1 tarea':
          shouldUnlock = user.tasks.filter(t => t.completed).length >= 1;
          break;

        case 'Mantener una racha de 7 días':
          shouldUnlock = user.streak >= 7;
          break;

        case 'Alcanzar nivel 5 en Físico':
          const physicalSkill = user.skills.find(s => s.skillType === 'physical');
          shouldUnlock = !!(physicalSkill && physicalSkill.level >= 5);
          break;

        case 'Alcanzar nivel 10 en Sabiduría':
          const wisdomSkill = user.skills.find(s => s.skillType === 'wisdom');
          shouldUnlock = !!(wisdomSkill && wisdomSkill.level >= 10);
          break;

        case 'Alcanzar nivel 5 en Social':
          const socialSkill = user.skills.find(s => s.skillType === 'social');
          shouldUnlock = !!(socialSkill && socialSkill.level >= 5);
          break;

        case 'Completar 10 tareas':
          shouldUnlock = user.tasks.filter(t => t.completed).length >= 10;
          break;

        case 'Completar 50 tareas':
          shouldUnlock = user.tasks.filter(t => t.completed).length >= 50;
          break;

        case 'Completar 100 tareas':
          shouldUnlock = user.tasks.filter(t => t.completed).length >= 100;
          break;

        case 'Alcanzar nivel 10':
          shouldUnlock = user.level >= 10;
          break;

        case 'Alcanzar nivel 25':
          shouldUnlock = user.level >= 25;
          break;

        case 'Completar 5 challenges':
          shouldUnlock = user.challenges.filter(c => c.completed).length >= 5;
          break;

        case 'Ganar 1000 monedas':
          shouldUnlock = user.coins >= 1000;
          break;

        case 'Mantener una racha de 30 días':
          shouldUnlock = user.streak >= 30;
          break;

        case 'Completar todas las categorías en un día':
          // Este requeriría verificar tareas completadas por día
          // Por simplicidad, lo dejamos como false por ahora
          shouldUnlock = false;
          break;
      }

      if (shouldUnlock) {
        // Desbloquear achievement
        await db.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
            unlocked: true,
            unlockedAt: new Date()
          }
        });

        newlyUnlocked.push(achievement);
      }
    }

    return { 
      success: true, 
      data: { 
        newlyUnlocked,
        totalUnlocked: unlockedIds.length + newlyUnlocked.length
      }
    };
  } catch (error) {
    console.error('Error checking achievements:', error);
    return { success: false, error: 'Error al verificar achievements' };
  }
}

export async function getUserAchievements() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'No autorizado' };
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    const userAchievements = await db.userAchievement.findMany({
      where: { 
        userId: user.id,
        unlocked: true
      },
      include: {
        achievement: true
      },
      orderBy: { unlockedAt: 'desc' }
    });

    return { success: true, data: userAchievements };
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    return { success: false, error: 'Error al obtener achievements del usuario' };
  }
}
