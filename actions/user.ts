'use server';

import { db } from '@/server/db/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function getProfile() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        characters: {
          include: {
            character: true,
          },
        },
        skills: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Formatear datos para el frontend
    const activeCharacter = user.characters.find(uc => uc.character.unlocked)?.character || 
                           user.characters[0]?.character;

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

    return { success: true, data: profile };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch profile',
    };
  }
}

export async function updateProfile(data: { name?: string; avatar?: string }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data,
      include: {
        characters: {
          include: {
            character: true,
          },
        },
        skills: true,
      },
    });

    revalidatePath('/profile');
    revalidatePath('/');

    return { success: true, data: updatedUser };
  } catch (error) {
    console.error('Error updating profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update profile',
    };
  }
}

export async function resetLevels() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    // Resetear nivel y XP del usuario
    await db.user.update({
      where: { id: session.user.id },
      data: {
        level: 1,
        totalXP: 0,
        coins: 0,
        streak: 0,
      },
    });

    // Resetear todas las habilidades
    await db.userSkill.updateMany({
      where: { userId: session.user.id },
      data: {
        level: 1,
        currentXP: 0,
        totalXP: 0,
        xpToNextLevel: 200,
      },
    });

    // Obtener usuario actualizado
    const updatedUser = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        characters: {
          include: {
            character: true,
          },
        },
        skills: true,
      },
    });

    revalidatePath('/profile');
    revalidatePath('/');

    return { success: true, data: updatedUser };
  } catch (error) {
    console.error('Error resetting levels:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reset levels',
    };
  }
}
