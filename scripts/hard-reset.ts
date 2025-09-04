import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function hardReset() {
  console.log('🔄 Iniciando Hard Reset del sistema de gamificación...\n');

  try {
    // 1. Eliminar todas las tareas
    console.log('🗑️ Eliminando todas las tareas...');
    const deletedTasks = await prisma.task.deleteMany();
    console.log(`   ✅ ${deletedTasks.count} tareas eliminadas`);

    // 2. Resetear progreso de habilidades de todos los usuarios
    console.log('🎯 Reseteando habilidades de usuarios...');
    const resetSkills = await prisma.userSkill.updateMany({
      data: {
        level: 1,
        currentXP: 0,
        totalXP: 0,
        xpToNextLevel: 200, // Nuevo sistema: 200 * 1^1.4 = 200
      }
    });
    console.log(`   ✅ ${resetSkills.count} habilidades reseteadas`);

    // 3. Resetear progreso general de usuarios
    console.log('👤 Reseteando progreso general de usuarios...');
    const resetUsers = await prisma.user.updateMany({
      data: {
        level: 1,
        totalXP: 0,
        coins: 0,
        streak: 0,
        avatar: '🎮', // Avatar por defecto
      }
    });
    console.log(`   ✅ ${resetUsers.count} usuarios reseteados`);

    // 4. Eliminar completions de tareas (si existe la tabla)
    console.log('📊 Limpiando historial de completions...');
    // Nota: Las completions están en el array de la tarea, así que ya se eliminaron con las tareas

    console.log('\n🎉 Hard Reset completado exitosamente!');
    console.log('📝 Próximo paso: Ejecutar npm run seed para cargar tareas iniciales');

  } catch (error) {
    console.error('❌ Error durante el hard reset:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  hardReset()
    .then(() => {
      console.log('\n✅ Hard reset finalizado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error en hard reset:', error);
      process.exit(1);
    });
}

export { hardReset };
