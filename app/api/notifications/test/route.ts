import { NextResponse } from 'next/server';
import { auth } from '@/auth';

// POST /api/notifications/test - Enviar notificación de prueba
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'UserID requerido' },
        { status: 400 }
      );
    }

    // Simular envío de notificación de prueba
    const testNotifications = [
      {
        title: '📝 ¡Hora de ser productivo!',
        body: 'Tienes tareas pendientes esperándote. ¡No pierdas tu racha!',
        type: 'task_reminder',
        url: '/tasks'
      },
      {
        title: '🏅 ¡Logro desbloqueado!',
        body: 'Has completado 10 tareas. ¡Eres increíble!',
        type: 'achievement_unlocked',
        url: '/profile'
      },
      {
        title: '🏆 ¡Nuevo challenge disponible!',
        body: 'El "Desafío Semanal" te está esperando. ¿Te atreves?',
        type: 'challenge_available',
        url: '/challenges'
      },
      {
        title: '🔥 ¡Mantén tu racha!',
        body: 'Llevas 5 días consecutivos. ¡No te detengas ahora!',
        type: 'streak_reminder',
        url: '/tasks'
      }
    ];

    // Seleccionar notificación aleatoria
    const randomNotification = testNotifications[Math.floor(Math.random() * testNotifications.length)];

    console.log('Sending test notification:', randomNotification);

    // En producción, aquí enviarías la notificación real usando web-push
    // Por ahora, simulamos que se envió correctamente

    return NextResponse.json({ 
      success: true, 
      message: 'Notificación de prueba enviada',
      notification: randomNotification
    });

  } catch (error) {
    console.error('Error sending test notification:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
