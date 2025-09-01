'use server';

import { auth } from '@/auth';
import { db } from '@/server/db/prisma';
import type { Prisma } from '@prisma/client';

export async function getChallenges() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'No autorizado' };
    }

    // Obtener todos los challenges activos
    const challenges = await db.challenge.findMany({
      where: { 
        active: true,
        OR: [
          { startDate: null },
          { startDate: { lte: new Date() } }
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: new Date() } }
            ]
          }
        ]
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Obtener el progreso del usuario en estos challenges
    const userChallenges = await db.userChallenge.findMany({
      where: { 
        userId: session.user.id,
        challengeId: { in: challenges.map(c => c.id) }
      }
    });

    // Combinar challenges con progreso del usuario
    const challengesWithProgress = challenges.map(challenge => {
      const userProgress = userChallenges.find(uc => uc.challengeId === challenge.id);
      
      return {
        ...challenge,
        userProgress: userProgress ? {
          progress: userProgress.progress,
          target: userProgress.target,
          completed: userProgress.completed,
          completedAt: userProgress.completedAt,
          progressData: userProgress.progressData
        } : null
      };
    });

    return { success: true, data: challengesWithProgress };
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return { success: false, error: 'Error al obtener challenges' };
  }
}

export async function joinChallenge(challengeId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'No autorizado' };
    }

    // Verificar que el challenge existe y está activo
    const challenge = await db.challenge.findUnique({
      where: { id: challengeId }
    });

    if (!challenge || !challenge.active) {
      return { success: false, error: 'Challenge no encontrado o inactivo' };
    }

    // Verificar que el usuario no esté ya en este challenge
    const existingUserChallenge = await db.userChallenge.findUnique({
      where: {
        userId_challengeId: {
          userId: session.user.id!,
          challengeId: challengeId
        }
      }
    });

    if (existingUserChallenge) {
      return { success: false, error: 'Ya estás participando en este challenge' };
    }

    // Determinar el target basado en los requirements
    const requirements = challenge.requirements as Record<string, unknown>;
    let target = 1;
    
    if (typeof requirements === 'object' && requirements !== null) {
      switch (requirements.type as string) {
        case 'daily':
          target = (requirements.tasksToComplete as number) || 1;
          break;
        case 'streak':
          target = (requirements.streakDays as number) || 1;
          break;
        case 'skill':
          target = (requirements.skillLevel as number) || 1;
          break;
        case 'diversity':
          const categories = requirements.categoriesRequired as unknown[];
          target = Array.isArray(categories) ? categories.length : 1;
          break;
        case 'temporal':
          target = (requirements.tasksToComplete as number) || 1;
          break;
      }
    }

    // Crear la entrada de UserChallenge
    const userChallenge = await db.userChallenge.create({
      data: {
        userId: session.user.id!,
        challengeId: challengeId,
        progress: 0,
        target: target,
        progressData: {}
      }
    });

    return { success: true, data: userChallenge };
  } catch (error) {
    console.error('Error joining challenge:', error);
    return { success: false, error: 'Error al unirse al challenge' };
  }
}

export async function getUserChallenges() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'No autorizado' };
    }

    const userChallenges = await db.userChallenge.findMany({
      where: { userId: session.user.id },
      include: {
        challenge: true
      },
      orderBy: [
        { completed: 'asc' },
        { id: 'desc' }
      ]
    });

    return { success: true, data: userChallenges };
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    return { success: false, error: 'Error al obtener challenges del usuario' };
  }
}

// Función para actualizar el progreso de challenges cuando se completa una tarea
export async function updateChallengeProgress(userId: string) {
  try {
    // Obtener challenges activos del usuario
    const userChallenges = await db.userChallenge.findMany({
      where: {
        userId: userId,
        completed: false
      },
      include: {
        challenge: true
      }
    });

    for (const userChallenge of userChallenges) {
      const requirements = userChallenge.challenge.requirements as Record<string, unknown>;
      let shouldUpdate = false;
      let newProgress = userChallenge.progress;
      const newProgressData = { ...(userChallenge.progressData as Record<string, unknown>) };

      switch (requirements.type) {
        case 'daily':
          // Contar tareas completadas hoy
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const tasksCompletedToday = await db.task.count({
            where: {
              userId: userId,
              completed: true,
              completedAt: {
                gte: today
              }
            }
          });

          if (tasksCompletedToday > userChallenge.progress) {
            newProgress = tasksCompletedToday;
            newProgressData.tasksCompletedToday = tasksCompletedToday;
            newProgressData.lastUpdated = new Date();
            shouldUpdate = true;
          }
          break;

        case 'diversity':
          // Verificar categorías completadas esta semana
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          weekStart.setHours(0, 0, 0, 0);

          const completedTasks = await db.task.findMany({
            where: {
              userId: userId,
              completed: true,
              completedAt: {
                gte: weekStart
              }
            },
            include: {
              category: true
            }
          });

          const uniqueCategories = [...new Set(completedTasks.map(t => t.category.primarySkill))];
          if (uniqueCategories.length > userChallenge.progress) {
            newProgress = uniqueCategories.length;
            newProgressData.categoriesCompleted = uniqueCategories;
            newProgressData.weekStartDate = weekStart;
            shouldUpdate = true;
          }
          break;

        case 'temporal':
          // Actualizar progreso temporal
          const totalTasksCompleted = await db.task.count({
            where: {
              userId: userId,
              completed: true,
              completedAt: {
                gte: userChallenge.challenge.startDate || new Date('2024-01-01')
              }
            }
          });

          if (totalTasksCompleted > userChallenge.progress) {
            newProgress = totalTasksCompleted;
            newProgressData.totalTasks = totalTasksCompleted;
            shouldUpdate = true;
          }
          break;
      }

      if (shouldUpdate) {
        await db.userChallenge.update({
          where: { id: userChallenge.id },
          data: {
            progress: newProgress,
            progressData: newProgressData as Prisma.InputJsonValue
          }
        });

        // Si se completó el challenge, marcarlo como completado y otorgar recompensas
        if (newProgress >= userChallenge.target && !userChallenge.completed) {
          await db.userChallenge.update({
            where: { id: userChallenge.id },
            data: {
              completed: true,
              completedAt: new Date()
            }
          });

          // Otorgar recompensas
          await db.user.update({
            where: { id: userId },
            data: {
              totalXP: {
                increment: userChallenge.challenge.xpReward
              },
              coins: {
                increment: userChallenge.challenge.coinReward
              }
            }
          });
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating challenge progress:', error);
    return { success: false, error: 'Error al actualizar progreso de challenges' };
  }
}
