import { db } from '../server/db/prisma';

async function seedShop() {
  console.log('🛍️ Seeding shop items...');

  // Recompensas para la tienda
  const rewards = [
    {
      title: 'Café Premium',
      description: 'Disfruta de tu café favorito sin culpa',
      cost: 100,
      type: 'external',
      category: 'food',
      icon: '☕',
      available: true,
      rarity: 'common',
    },
    {
      title: 'Día de Descanso',
      description: 'Un día libre de tareas opcionales',
      cost: 200,
      type: 'internal',
      category: 'break',
      icon: '🛋️',
      available: true,
      rarity: 'common',
    },
    {
      title: 'Corona Dorada',
      description: 'Accesorio épico para tu avatar',
      cost: 300,
      type: 'cosmetic',
      category: 'accessory',
      icon: '👑',
      available: true,
      rarity: 'epic',
    },
    {
      title: 'Helado Artesanal',
      description: 'Recompénsate con tu sabor favorito',
      cost: 150,
      type: 'external',
      category: 'food',
      icon: '🍦',
      available: true,
      rarity: 'common',
    },
    {
      title: 'Sesión de Spa',
      description: 'Relájate con un masaje profesional',
      cost: 800,
      type: 'external',
      category: 'wellness',
      icon: '💆‍♀️',
      available: true,
      rarity: 'legendary',
    },
    {
      title: 'Libro Nuevo',
      description: 'Ese libro que tanto querías leer',
      cost: 250,
      type: 'external',
      category: 'education',
      icon: '📖',
      available: true,
      rarity: 'common',
    },
    {
      title: 'Videojuego Nuevo',
      description: 'Ese juego que tanto querías',
      cost: 1000,
      type: 'external',
      category: 'entertainment',
      icon: '🎮',
      available: true,
      rarity: 'legendary',
    },
    {
      title: 'Auriculares Premium',
      description: 'Mejora tu experiencia musical',
      cost: 1200,
      type: 'external',
      category: 'technology',
      icon: '🎧',
      available: true,
      rarity: 'legendary',
    },
    {
      title: 'Clase de Cocina Online',
      description: 'Aprende nuevas recetas y técnicas',
      cost: 400,
      type: 'external',
      category: 'education',
      icon: '👨‍🍳',
      available: true,
      rarity: 'rare',
    },
    {
      title: 'Kit de Arte',
      description: 'Materiales para explorar tu creatividad',
      cost: 350,
      type: 'external',
      category: 'creativity',
      icon: '🎨',
      available: true,
      rarity: 'rare',
    },
    {
      title: 'Suscripción Streaming',
      description: '1 mes de tu plataforma favorita',
      cost: 300,
      type: 'external',
      category: 'entertainment',
      icon: '📺',
      available: true,
      rarity: 'common',
    },
    {
      title: 'Cena en Restaurante',
      description: 'Una cena especial que has estado postergando',
      cost: 600,
      type: 'external',
      category: 'food',
      icon: '🍽️',
      available: true,
      rarity: 'rare',
    },
    {
      title: 'Curso Online',
      description: 'Invierte en tu desarrollo personal',
      cost: 500,
      type: 'external',
      category: 'education',
      icon: '💻',
      available: true,
      rarity: 'rare',
    },
    {
      title: 'Outfit Nuevo',
      description: 'Renueva tu guardarropa',
      cost: 700,
      type: 'external',
      category: 'fashion',
      icon: '👗',
      available: true,
      rarity: 'epic',
    },
    {
      title: 'Equipamiento Deportivo',
      description: 'Mejora tu rendimiento físico',
      cost: 450,
      type: 'external',
      category: 'fitness',
      icon: '🏋️‍♂️',
      available: true,
      rarity: 'rare',
    },
    {
      title: 'Plantas para Casa',
      description: 'Añade vida verde a tu espacio',
      cost: 200,
      type: 'external',
      category: 'home',
      icon: '🪴',
      available: true,
      rarity: 'common',
    },
    {
      title: 'Experiencia de Viaje',
      description: 'Una excursión o actividad turística',
      cost: 1500,
      type: 'external',
      category: 'travel',
      icon: '✈️',
      available: true,
      rarity: 'legendary',
    },
    {
      title: 'Kit de Té Premium',
      description: 'Variedad de tés exóticos',
      cost: 180,
      type: 'external',
      category: 'food',
      icon: '🍵',
      available: true,
      rarity: 'common',
    },
    {
      title: 'Accesorios Tecnológicos',
      description: 'Gadgets útiles para tu día a día',
      cost: 400,
      type: 'external',
      category: 'technology',
      icon: '📱',
      available: true,
      rarity: 'rare',
    },
    {
      title: 'Multiplier 2x XP',
      description: 'Duplica tu XP por 1 día',
      cost: 150,
      type: 'internal',
      category: 'booster',
      icon: '⚡',
      available: true,
      rarity: 'rare',
    },
    {
      title: 'Boost de Monedas',
      description: 'Duplica las monedas ganadas por 3 días',
      cost: 200,
      type: 'internal',
      category: 'booster',
      icon: '💰',
      available: true,
      rarity: 'rare',
    },
    {
      title: 'Protector de Racha',
      description: 'Protege tu racha por 1 día si no completas tareas',
      cost: 100,
      type: 'internal',
      category: 'protection',
      icon: '🛡️',
      available: true,
      rarity: 'common',
    },
    {
      title: 'Recarga de Energía',
      description: 'Obtén +50 XP instantáneo para todas las habilidades',
      cost: 75,
      type: 'internal',
      category: 'booster',
      icon: '⚡',
      available: true,
      rarity: 'common',
    },
    {
      title: 'Tema Personalizado',
      description: 'Desbloquea temas de colores exclusivos',
      cost: 250,
      type: 'cosmetic',
      category: 'theme',
      icon: '🎨',
      available: true,
      rarity: 'epic',
    },
    {
      title: 'Insignia de Honor',
      description: 'Muestra tu dedicación con esta insignia especial',
      cost: 300,
      type: 'cosmetic',
      category: 'badge',
      icon: '🏅',
      available: true,
      rarity: 'epic',
    },
    {
      title: 'Desafío Personalizado',
      description: 'Crea tu propio challenge con recompensas personalizadas',
      cost: 500,
      type: 'internal',
      category: 'custom',
      icon: '🎯',
      available: true,
      rarity: 'legendary',
    },
    {
      title: 'Avatar Frames',
      description: 'Marcos decorativos para tu avatar',
      cost: 150,
      type: 'cosmetic',
      category: 'avatar',
      icon: '🖼️',
      available: true,
      rarity: 'rare',
    },
  ];

  // Crear recompensas una por una
  for (const reward of rewards) {
    try {
      const existing = await db.reward.findFirst({
        where: { title: reward.title }
      });

      if (!existing) {
        await db.reward.create({
          data: reward
        });
        console.log(`✅ Created reward: ${reward.title}`);
      } else {
        console.log(`⏭️  Reward already exists: ${reward.title}`);
      }
    } catch (error) {
      console.error(`❌ Error creating reward ${reward.title}:`, error);
    }
  }

  console.log('🎉 Shop seeding completed!');
}

// Ejecutar el script si se llama directamente
if (require.main === module) {
  seedShop()
    .then(() => {
      console.log('Shop seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Shop seeding failed:', error);
      process.exit(1);
    });
}

export default seedShop;
