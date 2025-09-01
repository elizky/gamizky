'use server';

import { auth } from '@/auth';
import { db } from '@/server/db/prisma';

export async function getShopItems() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'No autorizado' };
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    // Obtener recompensas disponibles
    const rewards = await db.reward.findMany({
      where: { available: true },
      orderBy: [
        { rarity: 'desc' },
        { cost: 'asc' }
      ]
    });

    // Obtener personajes
    const characters = await db.character.findMany({
      orderBy: { cost: 'asc' }
    });

    // Obtener items ya comprados por el usuario
    const userRewards = await db.userReward.findMany({
      where: { userId: user.id }
    });

    const userCharacters = await db.userCharacter.findMany({
      where: { userId: user.id }
    });

    return {
      success: true,
      data: {
        rewards,
        characters,
        userRewards: userRewards.map(ur => ur.rewardId),
        userCharacters: userCharacters.map(uc => uc.characterId),
        userCoins: user.coins
      }
    };
  } catch (error) {
    console.error('Error fetching shop items:', error);
    return { success: false, error: 'Error al obtener items de la tienda' };
  }
}

export async function purchaseItem(itemId: string, type: 'reward' | 'character') {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'No autorizado' };
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    if (type === 'reward') {
      // Verificar que la recompensa existe y está disponible
      const reward = await db.reward.findUnique({
        where: { id: itemId }
      });

      if (!reward || !reward.available) {
        return { success: false, error: 'Recompensa no encontrada o no disponible' };
      }

      // Verificar que el usuario tiene suficientes monedas
      if (user.coins < reward.cost) {
        return { success: false, error: 'Monedas insuficientes' };
      }

      // Verificar que el usuario no ya ha comprado esta recompensa
      const existingPurchase = await db.userReward.findUnique({
        where: {
          userId_rewardId: {
            userId: user.id,
            rewardId: itemId
          }
        }
      });

      if (existingPurchase) {
        return { success: false, error: 'Ya has comprado esta recompensa' };
      }

      // Realizar la transacción
      await db.$transaction([
        // Descontar monedas del usuario
        db.user.update({
          where: { id: user.id },
          data: {
            coins: {
              decrement: reward.cost
            }
          }
        }),
        // Crear la entrada de UserReward
        db.userReward.create({
          data: {
            userId: user.id,
            rewardId: itemId,
            claimed: true,
            claimedAt: new Date()
          }
        })
      ]);

      return {
        success: true,
        message: `¡${reward.title} comprado exitosamente!`,
        data: {
          coinsSpent: reward.cost,
          newCoinsBalance: user.coins - reward.cost
        }
      };

    } else if (type === 'character') {
      // Verificar que el personaje existe
      const character = await db.character.findUnique({
        where: { id: itemId }
      });

      if (!character) {
        return { success: false, error: 'Personaje no encontrado' };
      }

      // Verificar que el usuario tiene suficientes monedas
      if (user.coins < (character.cost || 0)) {
        return { success: false, error: 'Monedas insuficientes' };
      }

      // Verificar que el usuario no ya ha desbloqueado este personaje
      const existingCharacter = await db.userCharacter.findUnique({
        where: {
          userId_characterId: {
            userId: user.id,
            characterId: itemId
          }
        }
      });

      if (existingCharacter) {
        return { success: false, error: 'Ya has desbloqueado este personaje' };
      }

      // Realizar la transacción
      await db.$transaction([
        // Descontar monedas del usuario
        db.user.update({
          where: { id: user.id },
          data: {
            coins: {
              decrement: character.cost || 0
            }
          }
        }),
        // Crear la entrada de UserCharacter
        db.userCharacter.create({
          data: {
            userId: user.id,
            characterId: itemId
          }
        })
      ]);

      return {
        success: true,
        message: `¡Personaje ${character.name} desbloqueado!`,
        data: {
          coinsSpent: character.cost || 0,
          newCoinsBalance: user.coins - (character.cost || 0)
        }
      };
    }

    return { success: false, error: 'Tipo de compra no válido' };

  } catch (error) {
    console.error('Error purchasing item:', error);
    return { success: false, error: 'Error al comprar el item' };
  }
}

export async function getUserPurchases() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'No autorizado' };
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    // Obtener recompensas compradas
    const userRewards = await db.userReward.findMany({
      where: { userId: user.id },
      include: { reward: true },
      orderBy: { claimedAt: 'desc' }
    });

    // Obtener personajes desbloqueados
    const userCharacters = await db.userCharacter.findMany({
      where: { userId: user.id },
      include: { character: true },
      orderBy: { unlockedAt: 'desc' }
    });

    return {
      success: true,
      data: {
        rewards: userRewards,
        characters: userCharacters
      }
    };
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    return { success: false, error: 'Error al obtener compras del usuario' };
  }
}
