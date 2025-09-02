'use server';

import { db } from '@/server/db/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { isTaskAvailableToday, getTaskCompletionStatus } from '@/lib/recurring';
import { getRecurringXPMultiplier } from '@/lib/gamification';

export async function getTasks() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const tasks = await db.task.findMany({
      where: { userId: session.user.id },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    // Update completed status based on recurring logic
    const tasksWithUpdatedStatus = tasks.map((task) => {
      if (!task.recurring) {
        // For non-recurring tasks, use the existing completed status
        return task;
      }

      // For recurring tasks, check if they're available today
      const status = getTaskCompletionStatus({
        completions: task.completions,
        recurring: task.recurring,
        recurringType: task.recurringType,
        recurringTarget: task.recurringTarget,
      });

      return {
        ...task,
        completed: !status.isAvailable, // If not available, it means it's completed for today/period
      };
    });

    return { success: true, data: tasksWithUpdatedStatus };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch tasks',
    };
  }
}

export async function getTaskHistory() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const completedTasks = await db.task.findMany({
      where: {
        userId: session.user.id,
        completed: true,
      },
      include: { category: true },
      orderBy: { updatedAt: 'desc' },
    });

    return { success: true, data: completedTasks };
  } catch (error) {
    console.error('Error fetching task history:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch task history',
    };
  }
}

export async function createTask(data: {
  title: string;
  description: string;
  categories: Array<{ categoryId: string; points: number }>;
  difficulty: 'easy' | 'medium' | 'hard';
  skillRewards?: Record<string, number>;
  coinReward?: number;
  estimatedDuration?: number;
  recurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly' | 'x_per_week' | 'x_per_month';
  recurringTarget?: number;
  completed?: boolean;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    if (!data.title.trim()) {
      throw new Error('Task title is required');
    }

    if (!data.categories.length || !data.categories.some((cat) => cat.categoryId)) {
      throw new Error('At least one category is required');
    }

    const task = await db.task.create({
      data: {
        title: data.title.trim(),
        description: data.description?.trim() || '',
        difficulty: data.difficulty,
        skillRewards: data.skillRewards || {},
        coinReward: data.coinReward || 25,
        estimatedDuration: data.estimatedDuration || 0,
        recurring: data.recurring ?? true,
        recurringType: data.recurringType || 'daily',
        recurringTarget: data.recurringTarget,
        completed: data.completed || false,
        completions: [],
        userId: session.user.id,
        categoryId: data.categories[0].categoryId, // Usar la primera categoría como principal
      },
      include: { category: true },
    });

    revalidatePath('/tasks');
    revalidatePath('/');

    return { success: true, data: task };
  } catch (error) {
    console.error('Error creating task:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create task',
    };
  }
}

export async function updateTask(
  id: string,
  data: {
    title?: string;
    description?: string;
    categoryId?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    skillRewards?: Record<string, number>;
    coinReward?: number;
    estimatedDuration?: number;
    recurring?: boolean;
    recurringType?: 'daily' | 'weekly' | 'monthly' | 'x_per_week' | 'x_per_month';
    recurringTarget?: number;
    completed?: boolean;
  }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const existingTask = await db.task.findFirst({
      where: { id, userId: session.user.id },
      include: { category: true },
    });

    if (!existingTask) {
      throw new Error('Task not found or unauthorized');
    }

    const updatedTask = await db.task.update({
      where: { id },
      data,
      include: { category: true },
    });

    revalidatePath('/tasks');
    revalidatePath('/');

    return { success: true, data: updatedTask };
  } catch (error) {
    console.error('Error updating task:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update task',
    };
  }
}

export async function completeTask(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const existingTask = await db.task.findFirst({
      where: { id, userId: session.user.id },
      include: { category: true },
    });

    if (!existingTask) {
      throw new Error('Task not found or unauthorized');
    }

    // Check if task is available to be completed today
    const isAvailable = isTaskAvailableToday({
      completions: existingTask.completions,
      recurring: existingTask.recurring,
      recurringType: existingTask.recurringType,
      recurringTarget: existingTask.recurringTarget,
    });

    if (!isAvailable) {
      throw new Error('Task is not available to be completed at this time');
    }

    const now = new Date();
    const updatedTask = await db.task.update({
      where: { id },
      data: {
        completed: true,
        completedAt: now,
        completions: {
          push: now,
        },
      },
      include: { category: true },
    });

    // Usar las recompensas definidas en la tarea
    const taskSkillRewards = existingTask.skillRewards as Record<string, number>;
    const taskTotalXP = Object.values(taskSkillRewards).reduce((sum, xp) => sum + xp, 0);
    const taskCoinReward = existingTask.coinReward;

    // Aplicar multiplicador para tareas recurrentes
    const multiplier = getRecurringXPMultiplier(
      existingTask.recurringType,
      existingTask.completions.filter(
        (c) => new Date(c).toDateString() === new Date().toDateString()
      ).length,
      existingTask.completions.filter((c) => {
        const completionDate = new Date(c);
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        return completionDate >= weekStart;
      }).length
    );

    const finalSkillRewards = Object.fromEntries(
      Object.entries(taskSkillRewards).map(([skill, xp]) => [
        skill,
        Math.round(xp * multiplier),
      ])
    );
    const finalTotalXP = Math.round(taskTotalXP * multiplier);
    const finalCoinReward = Math.round(taskCoinReward * multiplier);

    // Actualizar usuario con XP total
    const updatedUserData = await db.user.update({
      where: { id: session.user.id },
      data: {
        totalXP: { increment: finalTotalXP },
        coins: { increment: finalCoinReward },
      },
    });

    // Recalcular y actualizar el nivel basado en el XP total
    const newLevel = Math.floor(updatedUserData.totalXP / 200) + 1;
    if (newLevel !== updatedUserData.level) {
      await db.user.update({
        where: { id: session.user.id },
        data: { level: newLevel },
      });
    }

    // Actualizar habilidades específicas
    for (const [skillType, xpAmount] of Object.entries(finalSkillRewards)) {
      if (xpAmount > 0) {
        // Obtener o crear la habilidad del usuario
        const existingSkill = await db.userSkill.findUnique({
          where: {
            userId_skillType: {
              userId: session.user.id,
              skillType: skillType,
            },
          },
        });

        if (existingSkill) {
          // Calcular nuevo XP y nivel
          const newCurrentXP = existingSkill.currentXP + xpAmount;
          const newTotalXP = existingSkill.totalXP + xpAmount;
          const xpForNextLevel = existingSkill.level * 200;
          const newLevel = existingSkill.level + Math.floor(newCurrentXP / xpForNextLevel);
          const finalCurrentXP = newCurrentXP % xpForNextLevel;

          await db.userSkill.update({
            where: { id: existingSkill.id },
            data: {
              currentXP: finalCurrentXP,
              totalXP: newTotalXP,
              level: newLevel,
              xpToNextLevel: xpForNextLevel - finalCurrentXP,
            },
          });
        } else {
          // Crear nueva habilidad si no existe
          await db.userSkill.create({
            data: {
              userId: session.user.id,
              skillType: skillType,
              currentXP: xpAmount,
              totalXP: xpAmount,
              level: Math.floor(xpAmount / 200) + 1,
              xpToNextLevel: 200 - (xpAmount % 200),
            },
          });
        }
      }
    }

    // Obtener datos actualizados del usuario para la UI
    const updatedUser = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        skills: true,
      },
    });

    revalidatePath('/tasks');
    revalidatePath('/');

    return { 
      success: true, 
      data: updatedTask,
      user: updatedUser,
      rewards: {
        xp: finalTotalXP,
        coins: finalCoinReward,
        skillRewards: finalSkillRewards,
      }
    };
  } catch (error) {
    console.error('Error completing task:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to complete task',
    };
  }
}

export async function uncompleteTask(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const existingTask = await db.task.findFirst({
      where: { id, userId: session.user.id },
      include: { category: true },
    });

    if (!existingTask) {
      throw new Error('Task not found or unauthorized');
    }

    if (!existingTask.completed) {
      throw new Error('Task is not completed');
    }

    // Remove the most recent completion from the array
    const updatedCompletions = existingTask.completions.slice(0, -1);

    const updatedTask = await db.task.update({
      where: { id },
      data: { 
        completed: updatedCompletions.length === 0 ? false : true,
        completedAt: updatedCompletions.length > 0 ? updatedCompletions[updatedCompletions.length - 1] : null,
        completions: updatedCompletions
      },
      include: { category: true },
    });

    // Revertir recompensas si se desmarca
    const taskSkillRewards = existingTask.skillRewards as Record<string, number>;
    const taskTotalXP = Object.values(taskSkillRewards).reduce((sum, xp) => sum + xp, 0);
    const taskCoinReward = existingTask.coinReward;

    // Aplicar multiplicador para tareas recurrentes (mismo que al completar)
    const multiplier = 1.0; // Por simplicidad, asumimos multiplicador 1 para desmarcar
    
    const finalSkillRewards = Object.fromEntries(
      Object.entries(taskSkillRewards).map(([skill, xp]) => [
        skill,
        -Math.round(xp * multiplier), // Negativo para restar
      ])
    );
    const finalTotalXP = -Math.round(taskTotalXP * multiplier);
    const finalCoinReward = -Math.round(taskCoinReward * multiplier);

    // Actualizar usuario restando XP y monedas
    const updatedUserData = await db.user.update({
      where: { id: session.user.id },
      data: {
        totalXP: { increment: finalTotalXP }, // Negativo = resta
        coins: { increment: finalCoinReward }, // Negativo = resta
      },
    });

    // Recalcular y actualizar el nivel basado en el XP total
    const newLevel = Math.max(1, Math.floor(updatedUserData.totalXP / 200) + 1); // Mínimo nivel 1
    if (newLevel !== updatedUserData.level) {
      await db.user.update({
        where: { id: session.user.id },
        data: { level: newLevel },
      });
    }

    // Actualizar habilidades específicas (restando XP)
    for (const [skillType, xpAmount] of Object.entries(finalSkillRewards)) {
      if (xpAmount !== 0) { // xpAmount es negativo
        // Obtener la habilidad del usuario
        const existingSkill = await db.userSkill.findUnique({
          where: {
            userId_skillType: {
              userId: session.user.id,
              skillType: skillType,
            },
          },
        });

        if (existingSkill) {
          // Calcular nuevo XP (restando)
          const newTotalXP = Math.max(0, existingSkill.totalXP + xpAmount); // No puede ser negativo
          const newLevel = Math.max(1, Math.floor(newTotalXP / 200) + 1); // Mínimo nivel 1
          const xpForNextLevel = newLevel * 200;
          const finalCurrentXP = newTotalXP % 200;

          await db.userSkill.update({
            where: { id: existingSkill.id },
            data: {
              currentXP: finalCurrentXP,
              totalXP: newTotalXP,
              level: newLevel,
              xpToNextLevel: xpForNextLevel - finalCurrentXP,
            },
          });
        }
      }
    }

    // Obtener datos actualizados del usuario para la UI
    const updatedUser = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        skills: true,
      },
    });

    revalidatePath('/tasks');
    revalidatePath('/');

    return { 
      success: true, 
      data: updatedTask,
      user: updatedUser,
      rewards: {
        xp: finalTotalXP, // Negativo
        coins: finalCoinReward, // Negativo
        skillRewards: finalSkillRewards,
      }
    };
  } catch (error) {
    console.error('Error uncompleting task:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to uncomplete task',
    };
  }
}

export async function deleteTask(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const existingTask = await db.task.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingTask) {
      throw new Error('Task not found or unauthorized');
    }

    await db.task.delete({
      where: { id },
    });

    revalidatePath('/tasks');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error deleting task:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete task',
    };
  }
}
