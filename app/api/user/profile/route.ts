import { NextResponse } from 'next/server';
import { db } from '@/server/db/prisma';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Obtener usuario con todas sus relaciones
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        skills: {
          orderBy: { skillType: 'asc' },
        },
        characters: {
          include: {
            character: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Obtener personaje activo (el primero desbloqueado)
    const activeCharacter = user.characters.find(uc => uc.character.unlocked)?.character || 
                           user.characters[0]?.character;

    // Formatear habilidades para el frontend
    const skills = {
      physical: { level: 1, currentXP: 0, totalXP: 0, xpToNextLevel: 200 },
      wisdom: { level: 1, currentXP: 0, totalXP: 0, xpToNextLevel: 200 },
      mental: { level: 1, currentXP: 0, totalXP: 0, xpToNextLevel: 200 },
      social: { level: 1, currentXP: 0, totalXP: 0, xpToNextLevel: 200 },
      creativity: { level: 1, currentXP: 0, totalXP: 0, xpToNextLevel: 200 },
      discipline: { level: 1, currentXP: 0, totalXP: 0, xpToNextLevel: 200 },
    };

    // Mapear habilidades de la base de datos
    user.skills.forEach(skill => {
      if (skill.skillType in skills) {
        skills[skill.skillType as keyof typeof skills] = {
          level: skill.level,
          currentXP: skill.currentXP,
          totalXP: skill.totalXP,
          xpToNextLevel: skill.xpToNextLevel,
        };
      }
    });

    // Calcular XP para el siguiente nivel
    Object.keys(skills).forEach(skillType => {
      const skill = skills[skillType as keyof typeof skills];
      skill.xpToNextLevel = skill.level * 200;
    });

    const profile = {
      id: user.id,
      name: user.name || 'Usuario',
      email: user.email,
      level: user.level,
      totalXP: user.totalXP,
      coins: user.coins,
      streak: user.streak,
      avatar: user.avatar,
      character: activeCharacter ? {
        id: activeCharacter.id,
        name: activeCharacter.name,
        avatar: activeCharacter.avatar,
        unlocked: activeCharacter.unlocked,
        cost: activeCharacter.cost,
      } : null,
      skills,
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}
