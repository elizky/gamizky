import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/server/db/prisma';

// POST /api/challenges/[id]/complete - Completar un challenge y otorgar recompensas
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id: challengeId } = await params;

    // Buscar el UserChallenge
    const userChallenge = await db.userChallenge.findUnique({
      where: {
        userId_challengeId: {
          userId: session.user.id,
          challengeId: challengeId
        }
      },
      include: {
        challenge: true
      }
    });

    if (!userChallenge) {
      return NextResponse.json(
        { error: 'No estás participando en este challenge' },
        { status: 404 }
      );
    }

    if (userChallenge.completed) {
      return NextResponse.json(
        { error: 'Este challenge ya está completado' },
        { status: 400 }
      );
    }

    // Verificar si el challenge está realmente completado
    if (userChallenge.progress < userChallenge.target) {
      return NextResponse.json(
        { error: 'Challenge no completado aún' },
        { status: 400 }
      );
    }

    // Marcar el challenge como completado
    const completedUserChallenge = await db.userChallenge.update({
      where: {
        userId_challengeId: {
          userId: session.user.id,
          challengeId: challengeId
        }
      },
      data: {
        completed: true,
        completedAt: new Date()
      },
      include: {
        challenge: true
      }
    });

    // Otorgar recompensas al usuario
    await db.user.update({
      where: { id: session.user.id },
      data: {
        totalXP: {
          increment: userChallenge.challenge.xpReward
        },
        coins: {
          increment: userChallenge.challenge.coinReward
        }
      }
    });

    // Recalcular nivel si es necesario
    const updatedUser = await db.user.findUnique({
      where: { id: session.user.id }
    });

    if (updatedUser) {
      const newLevel = Math.floor(updatedUser.totalXP / 200) + 1;
      if (newLevel > updatedUser.level) {
        await db.user.update({
          where: { id: session.user.id },
          data: { level: newLevel }
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: completedUserChallenge,
      rewards: {
        xp: userChallenge.challenge.xpReward,
        coins: userChallenge.challenge.coinReward
      }
    });

  } catch (error) {
    console.error('Error completing challenge:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
