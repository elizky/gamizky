import { PrismaClient } from '../lib/generated/prisma';
import { mockTasks } from '../lib/data';

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

    // Crear tareas iniciales usando mockTasks
    for (const mockTask of mockTasks) {
      await prisma.task.create({
        data: {
          title: mockTask.title,
          description: mockTask.description,
          categoryId: mockTask.category.id,
          subcategory: mockTask.subcategory,
          difficulty: mockTask.difficulty,
          skillRewards: mockTask.skillRewards as Record<string, number>,
          coinReward: mockTask.coinReward,
          recurring: mockTask.recurring,
          recurringType: mockTask.recurringType,
          estimatedDuration: mockTask.estimatedDuration,
          userId: user.id,
        },
      });
    }

    console.log('✅ User setup completed successfully!');
    console.log(`📝 Created ${mockTasks.length} initial tasks`);
    console.log(`🧠 Created skills for user`);
    console.log(`⚔️ Assigned Warrior character`);

  } catch (error) {
    console.error('❌ Error setting up user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupUser();
