import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/server/db/prisma';

// POST /api/shop/purchase - Comprar una recompensa
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { rewardId, type } = await request.json();

    if (!rewardId || !type) {
      return NextResponse.json(
        { error: 'ID del item y tipo requeridos' },
        { status: 400 }
      );
    }

    // Obtener el usuario actual
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    if (type === 'reward') {
      // Verificar que la recompensa existe y está disponible
      const reward = await db.reward.findUnique({
        where: { id: rewardId }
      });

      if (!reward || !reward.available) {
        return NextResponse.json(
          { error: 'Recompensa no encontrada o no disponible' },
          { status: 404 }
        );
      }

      // Verificar que el usuario tiene suficientes monedas
      if (user.coins < reward.cost) {
        return NextResponse.json(
          { error: 'Monedas insuficientes' },
          { status: 400 }
        );
      }

      // Verificar que el usuario no ya ha comprado esta recompensa
      const existingPurchase = await db.userReward.findUnique({
        where: {
          userId_rewardId: {
            userId: user.id,
            rewardId: rewardId
          }
        }
      });

      if (existingPurchase) {
        return NextResponse.json(
          { error: 'Ya has comprado esta recompensa' },
          { status: 400 }
        );
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
            rewardId: rewardId,
            claimed: true,
            claimedAt: new Date()
          }
        })
      ]);

      return NextResponse.json({
        success: true,
        message: `¡${reward.title} comprado exitosamente!`,
        coinsSpent: reward.cost
      });

    } else if (type === 'character') {
      // Verificar que el personaje existe
      const character = await db.character.findUnique({
        where: { id: rewardId }
      });

      if (!character) {
        return NextResponse.json(
          { error: 'Personaje no encontrado' },
          { status: 404 }
        );
      }

      // Verificar que el usuario tiene suficientes monedas
      if (user.coins < (character.cost || 0)) {
        return NextResponse.json(
          { error: 'Monedas insuficientes' },
          { status: 400 }
        );
      }

      // Verificar que el usuario no ya ha desbloqueado este personaje
      const existingCharacter = await db.userCharacter.findUnique({
        where: {
          userId_characterId: {
            userId: user.id,
            characterId: rewardId
          }
        }
      });

      if (existingCharacter) {
        return NextResponse.json(
          { error: 'Ya has desbloqueado este personaje' },
          { status: 400 }
        );
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
            characterId: rewardId
          }
        })
      ]);

      return NextResponse.json({
        success: true,
        message: `¡Personaje ${character.name} desbloqueado!`,
        coinsSpent: character.cost || 0
      });
    }

    return NextResponse.json(
      { error: 'Tipo de compra no válido' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error purchasing item:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
