import { db } from '../server/db/prisma';

async function seedAchievements() {
  console.log('🏆 Seeding achievements...');

  const achievements = [
    {
      title: 'Primeros Pasos',
      description: 'Completa tu primera tarea',
      icon: '👣',
      requirement: 'Completar 1 tarea',
      rarity: 'common',
    },
    {
      title: 'Racha de 7 días',
      description: 'Mantén una racha de 7 días completando tareas',
      icon: '🔥',
      requirement: 'Mantener una racha de 7 días',
      rarity: 'rare',
    },
    {
      title: 'Nivel 5 en Físico',
      description: 'Alcanza el nivel 5 en la habilidad Físico',
      icon: '💪',
      requirement: 'Alcanzar nivel 5 en Físico',
      rarity: 'rare',
    },
    {
      title: 'Maestro del Saber',
      description: 'Alcanza el nivel 10 en Sabiduría',
      icon: '📚',
      requirement: 'Alcanzar nivel 10 en Sabiduría',
      rarity: 'epic',
    },
    {
      title: 'Social Butterfly',
      description: 'Alcanza el nivel 5 en Social',
      icon: '👥',
      requirement: 'Alcanzar nivel 5 en Social',
      rarity: 'rare',
    },
    {
      title: 'Productivo',
      description: 'Completa 10 tareas en total',
      icon: '✅',
      requirement: 'Completar 10 tareas',
      rarity: 'common',
    },
    {
      title: 'Súper Productivo',
      description: 'Completa 50 tareas en total',
      icon: '🚀',
      requirement: 'Completar 50 tareas',
      rarity: 'rare',
    },
    {
      title: 'Máquina de Productividad',
      description: 'Completa 100 tareas en total',
      icon: '⚡',
      requirement: 'Completar 100 tareas',
      rarity: 'epic',
    },
    {
      title: 'Veterano',
      description: 'Alcanza el nivel 10',
      icon: '🏅',
      requirement: 'Alcanzar nivel 10',
      rarity: 'rare',
    },
    {
      title: 'Leyenda',
      description: 'Alcanza el nivel 25',
      icon: '👑',
      requirement: 'Alcanzar nivel 25',
      rarity: 'legendary',
    },
    {
      title: 'Desafiante',
      description: 'Completa 5 challenges',
      icon: '🏆',
      requirement: 'Completar 5 challenges',
      rarity: 'rare',
    },
    {
      title: 'Rico',
      description: 'Acumula 1000 monedas',
      icon: '💰',
      requirement: 'Ganar 1000 monedas',
      rarity: 'rare',
    },
    {
      title: 'Imparable',
      description: 'Mantén una racha de 30 días',
      icon: '🔥',
      requirement: 'Mantener una racha de 30 días',
      rarity: 'legendary',
    },
    {
      title: 'Equilibrado',
      description: 'Completa tareas de todas las categorías en un día',
      icon: '⚖️',
      requirement: 'Completar todas las categorías en un día',
      rarity: 'epic',
    },
    {
      title: 'Principiante Dedicado',
      description: 'Completa 5 tareas en total',
      icon: '🌟',
      requirement: 'Completar 5 tareas',
      rarity: 'common',
    },
    {
      title: 'Maestro de la Creatividad',
      description: 'Alcanza el nivel 8 en Creatividad',
      icon: '🎨',
      requirement: 'Alcanzar nivel 8 en Creatividad',
      rarity: 'rare',
    },
    {
      title: 'Disciplinado',
      description: 'Alcanza el nivel 6 en Disciplina',
      icon: '🎯',
      requirement: 'Alcanzar nivel 6 en Disciplina',
      rarity: 'rare',
    },
    {
      title: 'Mente Brillante',
      description: 'Alcanza el nivel 7 en Mental',
      icon: '🧠',
      requirement: 'Alcanzar nivel 7 en Mental',
      rarity: 'rare',
    },
    {
      title: 'Comprador Frecuente',
      description: 'Realiza 5 compras en la tienda',
      icon: '🛍️',
      requirement: 'Realizar 5 compras',
      rarity: 'common',
    },
    {
      title: 'Coleccionista',
      description: 'Desbloquea todos los personajes',
      icon: '🎭',
      requirement: 'Desbloquear todos los personajes',
      rarity: 'legendary',
    },
  ];

  // Crear achievements uno por uno
  for (const achievement of achievements) {
    try {
      const existing = await db.achievement.findFirst({
        where: { title: achievement.title }
      });

      if (!existing) {
        await db.achievement.create({
          data: achievement
        });
        console.log(`✅ Created achievement: ${achievement.title}`);
      } else {
        console.log(`⏭️  Achievement already exists: ${achievement.title}`);
      }
    } catch (error) {
      console.error(`❌ Error creating achievement ${achievement.title}:`, error);
    }
  }

  console.log('🎉 Achievements seeding completed!');
}

// Ejecutar el script si se llama directamente
if (require.main === module) {
  seedAchievements()
    .then(() => {
      console.log('Achievements seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Achievements seeding failed:', error);
      process.exit(1);
    });
}

export default seedAchievements;
