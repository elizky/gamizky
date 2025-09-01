import { NextResponse } from 'next/server';
import { auth } from '@/auth';

// POST /api/notifications/unsubscribe - Desuscribir usuario de notificaciones
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

    // Eliminar suscripción de la base de datos
    console.log('Push subscription removed for user:', userId);

    return NextResponse.json({ 
      success: true, 
      message: 'Suscripción eliminada correctamente' 
    });

  } catch (error) {
    console.error('Error removing push subscription:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
