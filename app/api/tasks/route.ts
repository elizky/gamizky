import { NextResponse } from 'next/server';
import { db } from '@/server/db/prisma';
import { auth } from '@/auth';
import { getTaskCompletionStatus } from '@/lib/recurring';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tasks = await db.task.findMany({
      where: { userId: session.user.id },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Update completed status based on recurring logic
    const tasksWithUpdatedStatus = tasks.map(task => {
      if (!task.recurring) {
        return task;
      }

      const status = getTaskCompletionStatus({
        completions: task.completions,
        recurring: task.recurring,
        recurringType: task.recurringType,
        recurringTarget: task.recurringTarget,
      });

      return {
        ...task,
        completed: !status.isAvailable,
      };
    });

    return NextResponse.json(tasksWithUpdatedStatus);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      categories, // Cambiado de categoryId a categories
      difficulty,
      skillRewards = {},
      coinReward,
      estimatedDuration,
      recurring = true,
      recurringType = 'daily',
      recurringTarget,
    } = body;

    // Validar que haya al menos una categoría
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json({ error: 'At least one category is required' }, { status: 400 });
    }

    // Usar la primera categoría como categoría principal para la tarea
    const primaryCategory = categories[0];

    // Crear la tarea con las recompensas de habilidades
    const task = await db.task.create({
      data: {
        title,
        description,
        categoryId: primaryCategory.categoryId, // Usar la primera categoría
        difficulty,
        skillRewards,
        coinReward: coinReward || 25,
        estimatedDuration,
        recurring,
        recurringType,
        recurringTarget,
        completions: [],
        userId: session.user.id,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
