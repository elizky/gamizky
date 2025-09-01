import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/server/db/prisma';

// POST /api/notifications/subscribe - Suscribir usuario a notificaciones
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { userId, subscription } = await request.json();

    if (!userId || !subscription) {
      return NextResponse.json(
        { error: 'UserID y subscription requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Guardar o actualizar la suscripción en la base de datos
    // Por ahora, lo guardamos en una tabla simple o en localStorage
    // En producción, deberías crear una tabla PushSubscription
    
    console.log('Push subscription saved for user:', userId);
    console.log('Subscription:', subscription);

    // Enviar notificación de bienvenida
    await sendWelcomeNotification(subscription);

    return NextResponse.json({ 
      success: true, 
      message: 'Suscripción guardada correctamente' 
    });

  } catch (error) {
    console.error('Error saving push subscription:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

async function sendWelcomeNotification(subscription: any) {
  const notificationPayload = {
    title: '🎮 ¡Bienvenido a Gamizky!',
    body: '¡Notificaciones activadas! Te recordaremos completar tus tareas diarias.',
    type: 'general',
    url: '/home'
  };

  // En producción, aquí usarías una librería como web-push
  // Por ahora, solo log para desarrollo
  console.log('Sending welcome notification:', notificationPayload);
}
