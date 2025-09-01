'use server';

import { db } from '@/server/db/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { updateChallengeProgress } from './challenges';
import { checkAndUnlockAchievements } from './achievements';

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

    return { success: true, data: tasks };
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
        completed: true 
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
  recurringType?: 'daily' | 'weekly' | 'monthly';
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

    if (!data.categories.length || !data.categories.some(cat => cat.categoryId)) {
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
        completed: data.completed || false,
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
    recurringType?: 'daily' | 'weekly' | 'monthly';
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

    if (existingTask.completed) {
      throw new Error('Task is already completed');
    }

    const updatedTask = await db.task.update({
      where: { id },
      data: { 
        completed: true,
        completedAt: new Date()
      },
      include: { category: true },
    });

          // Actualizar progreso de challenges del usuario
      await updateChallengeProgress(session.user.id);

    // Verificar y desbloquear achievements
    await checkAndUnlockAchievements(session.user.id);

    revalidatePath('/tasks');
    revalidatePath('/');

    return { success: true, data: updatedTask };
  } catch (error) {
    console.error('Error completing task:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to complete task',
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
