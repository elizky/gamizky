import { PrismaClient } from '@prisma/client';

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
        subcategories: ['Familia', 'Amigos', 'Red profesional', 'Voluntariado', 'Comunidad'],
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
        color: 'bg-gray-500',
        description: 'Organización, productividad y hábitos',
        primarySkill: 'discipline',
        subcategories: ['Limpieza', 'Organización', 'Finanzas', 'Rutinas', 'Planificación'],
      },
    }),
  ]);

  // Crear personajes básicos
  console.log('🎭 Creating characters...');
  const characters = await Promise.all([
    prisma.character.create({
      data: {
        id: 'default',
        name: 'Aventurero',
        avatar: '🎮',
        unlocked: true,
        cost: null,
      },
    }),
    prisma.character.create({
      data: {
        id: 'wizard',
        name: 'Mago',
        avatar: '🧙‍♂️',
        unlocked: false,
        cost: 500,
      },
    }),
    prisma.character.create({
      data: {
        id: 'warrior',
        name: 'Guerrero',
        avatar: '⚔️',
        unlocked: false,
        cost: 300,
      },
    }),
    prisma.character.create({
      data: {
        id: 'scholar',
        name: 'Erudito',
        avatar: '📚',
        unlocked: false,
        cost: 400,
      },
    }),
  ]);

  console.log('✅ Database seeding completed successfully!');
  console.log(`📝 Created ${taskCategories.length} task categories`);
  console.log(`🎭 Created ${characters.length} characters`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });