import { db } from '../server/db/prisma';
import { calculateTaskRewards } from '../lib/gamification';

// 🎯 TAREAS INICIALES PERSONALIZADAS PARA TONGA
// Basadas en tus preferencias específicas
const MY_INITIAL_TASKS = [
  // 💪 FÍSICO - Ejercicio y salud
  {
    title: 'Hacer 30 minutos de ejercicio',
    description: 'Cualquier actividad física: caminar, correr, gym, yoga',
    categoryName: 'Físico',
    subcategory: 'Cardio',
    difficulty: 'medium' as const,
    duration: 30,
    recurring: true,
    recurringType: 'daily' as const,
  },
  {
    title: 'Beber 2L de agua',
    description: 'Mantener hidratación durante el día',
    categoryName: 'Físico',
    subcategory: 'Salud',
    difficulty: 'easy' as const,
    duration: 0, // No toma tiempo específico
    recurring: true,
    recurringType: 'daily' as const,
  },
  {
    title: 'Dormir 8 horas',
    description: 'Descanso completo para recuperación',
    categoryName: 'Físico',
    subcategory: 'Descanso',
    difficulty: 'medium' as const,
    duration: 480, // 8 horas = 480 minutos
    recurring: true,
    recurringType: 'daily' as const,
  },
  {
    title: 'No tomar alcohol',
    description: 'Mantener sobriedad por un día más',
    categoryName: 'Físico',
    subcategory: 'Autocontrol',
    difficulty: 'hard' as const,
    duration: 0, // Es un hábito de todo el día
    recurring: true,
    recurringType: 'daily' as const,
  },
  {
    title: 'No pedir delivery',
    description: 'Preparar y comer en casa sin pedir comida afuera',
    categoryName: 'Físico',
    subcategory: 'Alimentación',
    difficulty: 'medium' as const,
    duration: 60, // Tiempo de cocinar
    recurring: true,
    recurringType: 'daily' as const,
  },
  {
    title: 'No comer pan',
    description: 'Evitar pan durante el día como reto nutricional',
    categoryName: 'Físico',
    subcategory: 'Alimentación',
    difficulty: 'medium' as const,
    duration: 0, // Es un hábito de todo el día
    recurring: true,
    recurringType: 'daily' as const,
  },
  {
    title: 'Ir al gimnasio o jugar tenis / salir a caminar o correr',
    description: 'Elegir alguna actividad física de mayor intensidad',
    categoryName: 'Físico',
    subcategory: 'Cardio / Deporte',
    difficulty: 'medium' as const,
    duration: 60,
    recurring: true,
    recurringType: 'daily' as const,
  },

  // 📚 SABIDURÍA - Lectura y conocimiento
  {
    title: 'Leer 20 páginas',
    description: 'Continuar con el libro actual',
    categoryName: 'Sabiduría',
    subcategory: 'Lectura',
    difficulty: 'easy' as const,
    duration: 25,
    recurring: true,
    recurringType: 'daily' as const,
  },

  // 🧠 MENTAL - Mindfulness y planeamiento
  {
    title: 'Meditar 15 minutos',
    description: 'Práctica de mindfulness y relajación',
    categoryName: 'Mental',
    subcategory: 'Mindfulness',
    difficulty: 'easy' as const,
    duration: 15,
    recurring: true,
    recurringType: 'daily' as const,
  },
  {
    title: 'Planificar mi semana',
    description: 'Organizar tareas personales y laborales',
    categoryName: 'Mental',
    subcategory: 'Planeamiento',
    difficulty: 'medium' as const,
    duration: 30,
    recurring: true,
    recurringType: 'weekly' as const,
  },

  // 🎨 CREATIVIDAD - Música y escritura
  {
    title: 'Dedicar 30 minutos a mi proyecto de música',
    description: 'Componer, grabar, practicar o producir',
    categoryName: 'Creatividad',
    subcategory: 'Música',
    difficulty: 'medium' as const,
    duration: 30,
    recurring: true,
    recurringType: 'daily' as const,
  },
  {
    title: 'Escribir un párrafo creativo',
    description: 'Poema, cuento corto, reflexión personal',
    categoryName: 'Creatividad',
    subcategory: 'Escritura',
    difficulty: 'medium' as const,
    duration: 20,
    recurring: true,
    recurringType: 'x_per_week' as const,
    recurringTarget: 3, // 3 veces por semana
  },
];

async function loadMyInitialTasks() {
  try {
    console.log('🌱 Cargando tus tareas iniciales personalizadas...');

    // Obtener categorías y usuario específico
    const categories = await db.taskCategory.findMany();
    const user = await db.user.findUnique({
      where: { id: 'cmf0gl7k6000016tocb9fy2k4' }
    });

    if (!user) {
      console.log('❌ No se encontró usuario');
      return;
    }

    let createdCount = 0;

    for (const taskData of MY_INITIAL_TASKS) {
      // Buscar la categoría
      const category = categories.find((c) => c.name === taskData.categoryName);
      if (!category) {
        console.log(`⚠️  Categoría no encontrada: ${taskData.categoryName}`);
        continue;
      }

      // Calcular recompensas automáticamente
      const rewards = calculateTaskRewards(
        taskData.difficulty,
        taskData.duration,
        category.primarySkill
      );

      // Crear la tarea
      await db.task.create({
        data: {
          title: taskData.title,
          description: taskData.description,
          subcategory:
            'subcategory' in taskData ? (taskData as { subcategory: string }).subcategory : null,
          difficulty: taskData.difficulty,
          estimatedDuration: taskData.duration,
          coinReward: rewards.coinReward,
          skillRewards: rewards.skillRewards,
          recurring: taskData.recurring,
          recurringType: taskData.recurringType,
          recurringTarget: taskData.recurringTarget,
          completions: [],
          categoryId: category.id,
          userId: user.id,
        },
      });

      console.log(`✅ ${taskData.title} - ${rewards.totalXP} XP, ${rewards.coinReward} monedas`);
      createdCount++;
    }

    console.log('');
    console.log(`🎉 ¡Listas! ${createdCount} tareas personalizadas creadas`);
    console.log('¡Ya puedes empezar a usar tu app de gamificación! 🚀');
  } catch (error) {
    console.error('❌ Error cargando tareas:', error);
  } finally {
    await db.$disconnect();
  }
}

// Exportar para uso externo
export { MY_INITIAL_TASKS, loadMyInitialTasks as createInitialTasks };

// Ejecutar si se llama directamente
if (require.main === module) {
  loadMyInitialTasks();
}
