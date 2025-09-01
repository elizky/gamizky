import { db } from '../server/db/prisma';

async function seedChallenges() {
  console.log('🌱 Seeding challenges...');

  const challenges = [
    {
      title: 'Guerrero Diario',
      description: 'Completa 5 tareas en un solo día',
      icon: '⚔️',
      type: 'daily',
      difficulty: 'medium',
      xpReward: 100,
      coinReward: 50,
      requirements: {
        type: 'daily',
        tasksToComplete: 5,
      },
      active: true,
      featured: true,
      rarity: 'common',
      category: 'productivity',
    },
    {
      title: 'Racha Imparable',
      description: 'Mantén una racha de 7 días consecutivos',
      icon: '🔥',
      type: 'weekly',
      difficulty: 'hard',
      xpReward: 300,
      coinReward: 150,
      requirements: {
        type: 'streak',
        streakDays: 7,
      },
      active: true,
      featured: true,
      rarity: 'rare',
      category: 'consistency',
    },
    {
      title: 'Maestro Físico',
      description: 'Alcanza el nivel 10 en habilidad Física',
      icon: '💪',
      type: 'skill',
      difficulty: 'epic',
      xpReward: 500,
      coinReward: 300,
      requirements: {
        type: 'skill',
        skillType: 'physical',
        skillLevel: 10,
      },
      active: true,
      featured: false,
      rarity: 'epic',
      category: 'fitness',
    },
    {
      title: 'Equilibrio Total',
      description: 'Completa tareas de todas las 6 categorías en una semana',
      icon: '⚖️',
      type: 'diversity',
      difficulty: 'hard',
      xpReward: 250,
      coinReward: 125,
      requirements: {
        type: 'diversity',
        categoriesRequired: ['physical', 'wisdom', 'mental', 'social', 'creativity', 'discipline'],
      },
      active: true,
      featured: true,
      rarity: 'rare',
      category: 'balance',
    },
    {
      title: 'Novato Persistente',
      description: 'Completa 3 tareas en un día para principiantes',
      icon: '🌱',
      type: 'daily',
      difficulty: 'easy',
      xpReward: 50,
      coinReward: 25,
      requirements: {
        type: 'daily',
        tasksToComplete: 3,
      },
      active: true,
      featured: false,
      rarity: 'common',
      category: 'beginner',
    },
    {
      title: 'Sabio del Conocimiento',
      description: 'Alcanza el nivel 8 en habilidad Sabiduría',
      icon: '📚',
      type: 'skill',
      difficulty: 'hard',
      xpReward: 400,
      coinReward: 200,
      requirements: {
        type: 'skill',
        skillType: 'wisdom',
        skillLevel: 8,
      },
      active: true,
      featured: false,
      rarity: 'rare',
      category: 'learning',
    },
    {
      title: 'Desafío de Fin de Año',
      description: 'Evento especial: Completa 50 tareas antes del 31 de diciembre',
      icon: '🎊',
      type: 'temporal',
      difficulty: 'epic',
      xpReward: 1000,
      coinReward: 500,
      requirements: {
        type: 'temporal',
        tasksToComplete: 50,
        deadline: new Date('2024-12-31'),
      },
      startDate: new Date('2024-12-01'),
      endDate: new Date('2024-12-31'),
      active: true,
      featured: true,
      rarity: 'legendary',
      category: 'event',
    },
    {
      title: 'Maestro de la Disciplina',
      description: 'Alcanza el nivel 5 en habilidad Disciplina',
      icon: '🎯',
      type: 'skill',
      difficulty: 'medium',
      xpReward: 200,
      coinReward: 100,
      requirements: {
        type: 'skill',
        skillType: 'discipline',
        skillLevel: 5,
      },
      active: true,
      featured: false,
      rarity: 'common',
      category: 'discipline',
    },
    {
      title: 'Maratón Semanal',
      description: 'Completa 20 tareas en una semana',
      icon: '🏃‍♂️',
      type: 'weekly',
      difficulty: 'epic',
      xpReward: 600,
      coinReward: 300,
      requirements: {
        type: 'weekly',
        tasksToComplete: 20,
      },
      active: true,
      featured: true,
      rarity: 'epic',
      category: 'endurance',
    },
    {
      title: 'Artista Creativo',
      description: 'Alcanza el nivel 6 en habilidad Creatividad',
      icon: '🎨',
      type: 'skill',
      difficulty: 'medium',
      xpReward: 250,
      coinReward: 125,
      requirements: {
        type: 'skill',
        skillType: 'creativity',
        skillLevel: 6,
      },
      active: true,
      featured: false,
      rarity: 'rare',
      category: 'creativity',
    },
  ];

  // Crear challenges uno por uno
  for (const challenge of challenges) {
    try {
      const existing = await db.challenge.findFirst({
        where: { title: challenge.title }
      });

      if (!existing) {
        await db.challenge.create({
          data: challenge
        });
        console.log(`✅ Created challenge: ${challenge.title}`);
      } else {
        console.log(`⏭️  Challenge already exists: ${challenge.title}`);
      }
    } catch (error) {
      console.error(`❌ Error creating challenge ${challenge.title}:`, error);
    }
  }

  console.log('🎉 Challenges seeding completed!');
}

// Ejecutar el script si se llama directamente
if (require.main === module) {
  seedChallenges()
    .then(() => {
      console.log('Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

export default seedChallenges;
