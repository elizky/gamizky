import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Crear categorías de tareas
  console.log('📝 Creating task categories...');
  const taskCategories = await Promise.all([
    prisma.taskCategory.create({
      data: {
        id: 'physical',
        name: 'Físico',
        icon: '💪',
        color: 'bg-red-500',
        description: 'Ejercicio, deporte y actividad física',
        primarySkill: 'physical',
        subcategories: ['Cardio', 'Fuerza', 'Flexibilidad', 'Deportes', 'Caminar', 'Salud'],
      },
    }),
    prisma.taskCategory.create({
      data: {
        id: 'wisdom',
        name: 'Sabiduría',
        icon: '📚',
        color: 'bg-blue-500',
        description: 'Aprendizaje, lectura y conocimiento',
        primarySkill: 'wisdom',
        subcategories: ['Lectura', 'Cursos', 'Documentales', 'Investigación', 'Idiomas'],
      },
    }),
    prisma.taskCategory.create({
      data: {
        id: 'mental',
        name: 'Mental',
        icon: '🧠',
        color: 'bg-purple-500',
        description: 'Concentración, memoria y agilidad mental',
        primarySkill: 'mental',
        subcategories: ['Meditación', 'Puzzles', 'Matemáticas', 'Programación', 'Estrategia'],
      },
    }),
    prisma.taskCategory.create({
      data: {
        id: 'social',
        name: 'Social',
        icon: '👥',
        color: 'bg-green-500',
        description: 'Relaciones interpersonales y comunicación',
        primarySkill: 'social',
        subcategories: ['Familia', 'Amigos', 'Networking', 'Voluntariado', 'Presentaciones'],
      },
    }),
    prisma.taskCategory.create({
      data: {
        id: 'creativity',
        name: 'Creatividad',
        icon: '🎨',
        color: 'bg-yellow-500',
        description: 'Arte, música y expresión creativa',
        primarySkill: 'creativity',
        subcategories: ['Dibujo', 'Música', 'Escritura', 'Fotografía', 'Manualidades'],
      },
    }),
    prisma.taskCategory.create({
      data: {
        id: 'discipline',
        name: 'Disciplina',
        icon: '🎯',
        color: 'bg-gray-600',
        description: 'Organización, productividad y hábitos',
        primarySkill: 'discipline',
        subcategories: ['Trabajo', 'Limpieza', 'Finanzas', 'Planificación', 'Rutinas', 'Salud'],
      },
    }),
  ]);

  // Crear personajes
  console.log('👤 Creating characters...');
  const characters = await Promise.all([
    prisma.character.create({
      data: {
        id: '1',
        name: 'Guerrero',
        avatar: '⚔️',
        unlocked: true,
      },
    }),
    prisma.character.create({
      data: {
        id: '2',
        name: 'Mago',
        avatar: '🧙‍♂️',
        unlocked: false,
        cost: 500,
      },
    }),
    prisma.character.create({
      data: {
        id: '3',
        name: 'Ninja',
        avatar: '🥷',
        unlocked: false,
        cost: 750,
      },
    }),
    prisma.character.create({
      data: {
        id: '4',
        name: 'Dragón',
        avatar: '🐉',
        unlocked: false,
        cost: 1000,
      },
    }),
  ]);

  // Crear recompensas
  console.log('🎁 Creating rewards...');
  const rewards = await Promise.all([
    prisma.reward.create({
      data: {
        id: '1',
        title: 'Personaje Mago',
        description: 'Desbloquea el poderoso personaje Mago',
        cost: 500,
        type: 'character',
        category: 'character',
        icon: '🧙‍♂️',
        rarity: 'rare',
      },
    }),
    prisma.reward.create({
      data: {
        id: '2',
        title: 'Café Premium',
        description: 'Disfruta de tu café favorito sin culpa',
        cost: 100,
        type: 'external',
        category: 'food',
        icon: '☕',
        rarity: 'common',
      },
    }),
    prisma.reward.create({
      data: {
        id: '3',
        title: 'Corona Dorada',
        description: 'Accesorio épico para tu avatar',
        cost: 300,
        type: 'cosmetic',
        category: 'accessory',
        icon: '👑',
        rarity: 'epic',
      },
    }),
    prisma.reward.create({
      data: {
        id: '4',
        title: 'Videojuego Nuevo',
        description: 'Ese juego que tanto querías',
        cost: 800,
        type: 'external',
        category: 'entertainment',
        icon: '🎮',
        rarity: 'legendary',
      },
    }),
    prisma.reward.create({
      data: {
        id: '5',
        title: 'Día de Descanso',
        description: 'Un día libre de tareas opcionales',
        cost: 200,
        type: 'internal',
        category: 'break',
        icon: '🛋️',
        rarity: 'common',
      },
    }),
  ]);

  // Crear logros
  console.log('🏆 Creating achievements...');
  const achievements = await Promise.all([
    prisma.achievement.create({
      data: {
        id: '1',
        title: 'Primeros Pasos',
        description: 'Completa tu primera tarea',
        icon: '👣',
        requirement: 'Completar 1 tarea',
        rarity: 'common',
      },
    }),
    prisma.achievement.create({
      data: {
        id: '2',
        title: 'Racha de 7 días',
        description: 'Mantén una racha de 7 días completando tareas',
        icon: '🔥',
        requirement: 'Mantener una racha de 7 días',
        rarity: 'rare',
      },
    }),
    prisma.achievement.create({
      data: {
        id: '3',
        title: 'Nivel 5 en Físico',
        description: 'Alcanza el nivel 5 en la habilidad Físico',
        icon: '💪',
        requirement: 'Alcanzar nivel 5 en Físico',
        rarity: 'epic',
      },
    }),
    prisma.achievement.create({
      data: {
        id: '4',
        title: 'Maestro del Saber',
        description: 'Alcanza el nivel 10 en Sabiduría',
        icon: '📚',
        requirement: 'Alcanzar nivel 10 en Sabiduría',
        rarity: 'legendary',
      },
    }),
    prisma.achievement.create({
      data: {
        id: '5',
        title: 'Social Butterfly',
        description: 'Alcanza el nivel 5 en Social',
        icon: '👥',
        requirement: 'Alcanzar nivel 5 en Social',
        rarity: 'epic',
      },
    }),
  ]);

  console.log('✅ Database seeding completed successfully!');
  console.log(`📝 Created ${taskCategories.length} task categories`);
  console.log(`👤 Created ${characters.length} characters`);
  console.log(`🎁 Created ${rewards.length} rewards`);
  console.log(`🏆 Created ${achievements.length} achievements`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
