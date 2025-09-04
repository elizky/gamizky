import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Crear o actualizar categorías de tareas con el nuevo framework
  console.log('📝 Creating/updating task categories...');
  await Promise.all([
    prisma.taskCategory.upsert({
      where: { id: 'physical' },
      update: {
        name: 'Físico',
        icon: '💪',
        color: 'bg-blue-500',
        description: 'El Guerrero - Mi cuerpo es mi primera herramienta de batalla',
        primarySkill: 'physical',
        subcategories: [
          'Cardio',
          'Fuerza',
          'Flexibilidad',
          'Deportes',
          'Baile',
          'Caminata',
          'Descanso',
          'Hábitos saludables',
        ],
      },
      create: {
        id: 'physical',
        name: 'Físico',
        icon: '💪',
        color: 'bg-blue-500',
        description: 'El Guerrero - Mi cuerpo es mi primera herramienta de batalla',
        primarySkill: 'physical',
        subcategories: [
          'Cardio',
          'Fuerza',
          'Flexibilidad',
          'Deportes',
          'Baile',
          'Caminata',
          'Descanso',
          'Hábitos saludables',
        ],
      },
    }),
    prisma.taskCategory.upsert({
      where: { id: 'wisdom' },
      update: {
        name: 'Sabiduría',
        icon: '📚',
        color: 'bg-green-500',
        description: 'El Sabio - El conocimiento no me da poder. Me da libertad',
        primarySkill: 'wisdom',
        subcategories: [
          'Lectura',
          'Cursos',
          'Idiomas',
          'Investigación',
          'Escritura',
          'Documentales',
          'Podcasts',
          'Ciencia',
          'Filosofía',
          'Cultura general',
        ],
      },
      create: {
        id: 'wisdom',
        name: 'Sabiduría',
        icon: '📚',
        color: 'bg-green-500',
        description: 'El Sabio - El conocimiento no me da poder. Me da libertad',
        primarySkill: 'wisdom',
        subcategories: [
          'Lectura',
          'Cursos',
          'Idiomas',
          'Investigación',
          'Escritura',
          'Documentales',
          'Podcasts',
          'Ciencia',
          'Filosofía',
          'Cultura general',
        ],
      },
    }),
    prisma.taskCategory.upsert({
      where: { id: 'mental' },
      update: {
        name: 'Mental',
        icon: '🧠',
        color: 'bg-purple-500',
        description: 'El Monje - Pienso. Luego respiro. Luego actúo',
        primarySkill: 'mental',
        subcategories: [
          'Meditación',
          'Mindfulness',
          'Ajedrez',
          'Rompecabezas',
          'Lógica',
          'Programación',
          'Journaling',
          'Planeamiento estratégico',
        ],
      },
      create: {
        id: 'mental',
        name: 'Mental',
        icon: '🧠',
        color: 'bg-purple-500',
        description: 'El Monje - Pienso. Luego respiro. Luego actúo',
        primarySkill: 'mental',
        subcategories: [
          'Meditación',
          'Mindfulness',
          'Ajedrez',
          'Rompecabezas',
          'Lógica',
          'Programación',
          'Journaling',
          'Planeamiento estratégico',
        ],
      },
    }),
    prisma.taskCategory.upsert({
      where: { id: 'social' },
      update: {
        name: 'Social',
        icon: '👥',
        color: 'bg-pink-500',
        description: 'La Tejedora - Los demás no son otros: son extensiones de mí',
        primarySkill: 'social',
        subcategories: [
          'Amistad',
          'Pareja',
          'Networking',
          'Ayuda social',
          'Escucha activa',
          'Eventos',
          'Familia',
          'Citas',
        ],
      },
      create: {
        id: 'social',
        name: 'Social',
        icon: '👥',
        color: 'bg-pink-500',
        description: 'La Tejedora - Los demás no son otros: son extensiones de mí',
        primarySkill: 'social',
        subcategories: [
          'Amistad',
          'Pareja',
          'Networking',
          'Ayuda social',
          'Escucha activa',
          'Eventos',
          'Familia',
          'Citas',
        ],
      },
    }),
    prisma.taskCategory.upsert({
      where: { id: 'creativity' },
      update: {
        name: 'Creatividad',
        icon: '🎨',
        color: 'bg-orange-500',
        description: 'La Musa - Todo lo que veo, puede ser otra cosa',
        primarySkill: 'creativity',
        subcategories: [
          'Dibujo',
          'Música',
          'Escritura',
          'Cocina',
          'Diseño',
          'Teatro',
          'Fotografía',
          'Manualidades',
          'UI',
          'Poesía',
        ],
      },
      create: {
        id: 'creativity',
        name: 'Creatividad',
        icon: '🎨',
        color: 'bg-orange-500',
        description: 'La Musa - Todo lo que veo, puede ser otra cosa',
        primarySkill: 'creativity',
        subcategories: [
          'Dibujo',
          'Música',
          'Escritura',
          'Cocina',
          'Diseño',
          'Teatro',
          'Fotografía',
          'Manualidades',
          'UI',
          'Poesía',
        ],
      },
    }),
  ]);

  console.log('✅ Task categories created/updated successfully');

    // Las tareas iniciales se crean solo para usuarios específicos
  // usando el script: npm run setup:user
  console.log('📋 Initial tasks will be created per user using setup:user script');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
