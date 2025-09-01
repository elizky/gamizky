import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupUser() {
  try {
    // Buscar el usuario más reciente (asumiendo que es el que acaba de registrarse)
    const user = await prisma.user.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!user) {
      console.log('❌ No se encontró ningún usuario');
      return;
    }

    console.log(`👤 Configurando usuario: ${user.name || user.email}`);

    // Crear habilidades iniciales para el usuario
    const skillTypes = ['physical', 'wisdom', 'mental', 'social', 'creativity', 'discipline'];

    for (const skillType of skillTypes) {
      await prisma.userSkill.upsert({
        where: {
          userId_skillType: {
            userId: user.id,
            skillType,
          },
        },
        update: {},
        create: {
          userId: user.id,
          skillType,
          level: 1,
          currentXP: 0,
          totalXP: 0,
          xpToNextLevel: 200,
        },
      });
    }

    // Asignar personaje Guerrero al usuario
    const warrior = await prisma.character.findFirst({
      where: { name: 'Guerrero' },
    });

    if (warrior) {
      await prisma.userCharacter.upsert({
        where: {
          userId_characterId: {
            userId: user.id,
            characterId: warrior.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          characterId: warrior.id,
          unlockedAt: new Date(),
        },
      });
    }

    // Crear algunas tareas iniciales básicas
    const basicTasks = [
      {
        title: 'Hacer 30 minutos de ejercicio',
        description: 'Cualquier actividad física que te guste',
        categoryId: 'physical',
        subcategory: 'Cardio',
        difficulty: 'medium' as const,
        skillRewards: { physical: 50 },
        coinReward: 25,
      },
      {
        title: 'Leer 20 páginas de un libro',
        description: 'Continúa con tu lectura actual o empieza uno nuevo',
        categoryId: 'wisdom',
        subcategory: 'Lectura',
        difficulty: 'easy' as const,
        skillRewards: { wisdom: 30 },
        coinReward: 15,
      },
      {
        title: 'Organizar escritorio',
        description: 'Mantén tu espacio de trabajo limpio y organizado',
        categoryId: 'discipline',
        subcategory: 'Organización',
        difficulty: 'easy' as const,
        skillRewards: { discipline: 25 },
        coinReward: 10,
      },
    ];

    for (const task of basicTasks) {
      await prisma.task.create({
        data: {
          ...task,
          recurring: true,
          recurringType: 'daily',
          estimatedDuration: 30,
          userId: user.id,
        },
      });
    }

    console.log('✅ User setup completed successfully!');
    console.log(`📝 Created ${basicTasks.length} initial tasks`);
    console.log(`🧠 Created skills for user`);
    console.log(`⚔️ Assigned Warrior character`);
  } catch (error) {
    console.error('❌ Error setting up user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupUser();
