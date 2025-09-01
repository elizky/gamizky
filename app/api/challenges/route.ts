import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/server/db/prisma';

// GET /api/challenges - Obtener challenges disponibles para el usuario
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
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
      },
      include: {
        challenge: true
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

    return NextResponse.json({ 
      success: true, 
      data: challengesWithProgress 
    });

  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/challenges - Unirse a un challenge
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { challengeId } = await request.json();

    if (!challengeId) {
      return NextResponse.json(
        { error: 'ID del challenge requerido' },
        { status: 400 }
      );
    }

    // Verificar que el challenge existe y está activo
    const challenge = await db.challenge.findUnique({
      where: { id: challengeId }
    });

    if (!challenge || !challenge.active) {
      return NextResponse.json(
        { error: 'Challenge no encontrado o inactivo' },
        { status: 404 }
      );
    }

    // Verificar que el usuario no esté ya en este challenge
    const existingUserChallenge = await db.userChallenge.findUnique({
      where: {
        userId_challengeId: {
          userId: session.user.id,
          challengeId: challengeId
        }
      }
    });

    if (existingUserChallenge) {
      return NextResponse.json(
        { error: 'Ya estás participando en este challenge' },
        { status: 400 }
      );
    }

    // Determinar el target basado en los requirements
    const requirements = challenge.requirements as any;
    let target = 1;
    
    switch (requirements.type) {
      case 'daily':
        target = requirements.tasksToComplete || 1;
        break;
      case 'streak':
        target = requirements.streakDays || 1;
        break;
      case 'skill':
        target = requirements.skillLevel || 1;
        break;
      case 'diversity':
        target = requirements.categoriesRequired?.length || 1;
        break;
      case 'temporal':
        target = requirements.tasksToComplete || 1;
        break;
    }

    // Crear la entrada de UserChallenge
    const userChallenge = await db.userChallenge.create({
      data: {
        userId: session.user.id,
        challengeId: challengeId,
        progress: 0,
        target: target,
        progressData: {}
      },
      include: {
        challenge: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: userChallenge 
    });

  } catch (error) {
    console.error('Error joining challenge:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
