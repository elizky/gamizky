import { NextResponse } from 'next/server';
import { db } from '@/server/db/prisma';
import { auth } from '@/auth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: taskId } = await params;
    const body = await request.json();
    const { completed } = body;

    // Obtener la tarea actual
    const task = await db.task.findUnique({
      where: { id: taskId, userId: session.user.id },
      include: {
        category: true,
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Si la tarea ya está en el estado deseado, no hacer nada
    if (task.completed === completed) {
      return NextResponse.json(
        { error: `Task already ${completed ? 'completed' : 'not completed'}` },
        { status: 400 }
      );
    }

    // Actualizar el estado de la tarea
    await db.task.update({
      where: { id: taskId },
      data: {
        completed,
        completedAt: completed ? new Date() : null,
      },
    });

    // Si está completando, aplicar recompensas
    if (completed) {
      await applyTaskRewards(task, session.user.id);
    } else {
      // Si está descompletando, remover recompensas
      await removeTaskRewards(task, session.user.id);
    }

    // Obtener la tarea actualizada
    const updatedTask = await db.task.findUnique({
      where: { id: taskId },
      include: {
        category: true,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// Función para aplicar recompensas al completar
async function applyTaskRewards(task: { skillRewards: unknown; coinReward: number }, userId: string) {
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

  // Aplicar recompensas de habilidades desde el campo JSON
  const skillRewards = task.skillRewards as Record<string, number>;
  for (const [skillType, amount] of Object.entries(skillRewards)) {
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
  const totalSkillXP = Object.values(skillRewards).reduce((sum, amount) => sum + amount, 0);
  await db.user.update({
    where: { id: userId },
    data: {
      totalXP: {
        increment: totalSkillXP,
      },
      coins: {
        increment: task.coinReward,
      },
    },
  });

  // Recalcular nivel del usuario
  const updatedUser = await db.user.findUnique({
    where: { id: userId },
  });

  if (updatedUser) {
    const newLevel = Math.floor(updatedUser.totalXP / 200) + 1;
    if (newLevel > updatedUser.level) {
      await db.user.update({
        where: { id: userId },
        data: { level: newLevel },
      });
    }
  }
}

// Función para remover recompensas al descompletar
async function removeTaskRewards(task: { skillRewards: unknown; coinReward: number }, userId: string) {
  // Remover recompensas de habilidades
  const skillRewards = task.skillRewards as Record<string, number>;
  for (const [skillType, amount] of Object.entries(skillRewards)) {
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
            decrement: amount,
          },
          totalXP: {
            decrement: amount,
          },
        },
      });
    }
  }

  // Remover XP total y monedas del usuario
  const totalSkillXP = Object.values(skillRewards).reduce((sum, amount) => sum + amount, 0);
  await db.user.update({
    where: { id: userId },
    data: {
      totalXP: {
        decrement: totalSkillXP,
      },
      coins: {
        decrement: task.coinReward,
      },
    },
  });

  // Recalcular nivel del usuario
  const updatedUser = await db.user.findUnique({
    where: { id: userId },
  });

  if (updatedUser) {
    const newLevel = Math.floor(updatedUser.totalXP / 200) + 1;
    if (newLevel < updatedUser.level) {
      await db.user.update({
        where: { id: userId },
        data: { level: newLevel },
      });
    }
  }
}
