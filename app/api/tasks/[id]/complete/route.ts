import { NextResponse } from 'next/server';
import { db } from '@/server/db/prisma';
import { auth } from '@/auth';
import { isTaskAvailableToday } from '@/lib/recurring';
import { getRecurringXPMultiplier } from '@/lib/gamification';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: taskId } = await params;

    // Obtener la tarea con sus recompensas
    const task = await db.task.findUnique({
      where: { id: taskId, userId: session.user.id },
      include: {
        category: true,
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Check if task is available to be completed
    const isAvailable = isTaskAvailableToday({
      completions: task.completions,
      recurring: task.recurring,
      recurringType: task.recurringType,
      recurringTarget: task.recurringTarget,
    });

    if (!isAvailable) {
      return NextResponse.json(
        { error: 'Task is not available to be completed at this time' },
        { status: 400 }
      );
    }

    // Marcar la tarea como completada y agregar al array de completions
    const now = new Date();
    await db.task.update({
      where: { id: taskId },
      data: {
        completed: true,
        completedAt: now,
        completions: {
          push: now,
        },
      },
    });

    // Aplicar recompensas
    await applyTaskRewards(task, session.user.id);

    // Obtener la tarea actualizada
    const updatedTask = await db.task.findUnique({
      where: { id: taskId },
      include: {
        category: true,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error completing task:', error);
    return NextResponse.json({ error: 'Failed to complete task' }, { status: 500 });
  }
}

// Función para aplicar recompensas al completar
async function applyTaskRewards(
  task: {
    skillRewards: unknown;
    coinReward: number;
    difficulty: string;
    estimatedDuration: number | null;
    category: { primarySkill: string };
    completions: Date[];
    recurringType: string | null;
  },
  userId: string
) {
  // Obtener o crear las habilidades del usuario
  const userSkills = await db.userSkill.findMany({
    where: { userId },
  });

  // Crear habilidades faltantes si no existen
  const skillTypes = ['physical', 'wisdom', 'mental', 'social', 'creativity', 'discipline'];
  for (const skillType of skillTypes) {
    if (!userSkills.find((s) => s.skillType === skillType)) {
      await db.userSkill.create({
        data: {
          userId,
          skillType,
          level: 1,
          currentXP: 0,
          totalXP: 0,
          xpToNextLevel: 200,
        },
      });
    }
  }

  // Usar las recompensas definidas en la tarea
  const taskSkillRewards = task.skillRewards as Record<string, number>;
  const taskTotalXP = Object.values(taskSkillRewards).reduce((sum, xp) => sum + xp, 0);
  const taskCoinReward = task.coinReward;

  // Aplicar multiplicador para tareas recurrentes
  const multiplier = getRecurringXPMultiplier(
    task.recurringType,
    task.completions.filter((c) => new Date(c).toDateString() === new Date().toDateString()).length,
    task.completions.filter((c) => {
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

  // Aplicar recompensas de habilidades automáticas
  for (const [skillType, amount] of Object.entries(finalSkillRewards)) {
    if (amount > 0) {
      await db.userSkill.update({
        where: {
          userId_skillType: {
            userId,
            skillType,
          },
        },
        data: {
          currentXP: {
            increment: amount,
          },
          totalXP: {
            increment: amount,
          },
        },
      });
    }
  }

  // Actualizar XP total del usuario
  const updatedUserData = await db.user.update({
    where: { id: userId },
    data: {
      totalXP: {
        increment: finalTotalXP,
      },
      coins: {
        increment: finalCoinReward,
      },
    },
  });

  // Recalcular y actualizar el nivel basado en el XP total
  const newLevel = Math.floor(updatedUserData.totalXP / 200) + 1;
  if (newLevel !== updatedUserData.level) {
    await db.user.update({
      where: { id: userId },
      data: { level: newLevel },
    });
  }
}
