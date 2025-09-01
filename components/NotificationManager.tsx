'use client';

import { useEffect, useState } from 'react';

interface NotificationManagerProps {
  userId?: string;
}

export default function NotificationManager({ userId }: NotificationManagerProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    // Verificar soporte para notificaciones
    setIsSupported('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window);
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      alert('Tu navegador no soporta notificaciones push');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission === 'granted') {
        await subscribeUser();
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const subscribeUser = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Generar VAPID key (en producción, esto debería venir del servidor)
      const vapidPublicKey = 'BMxw8s9-M8Y8K5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5';
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      setSubscription(subscription);

      // Enviar suscripción al servidor
      if (userId) {
        await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            subscription
          })
        });
      }

      console.log('Usuario suscrito a notificaciones push');
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
    }
  };

  const unsubscribeUser = async () => {
    try {
      if (subscription) {
        await subscription.unsubscribe();
        setSubscription(null);

        // Notificar al servidor
        if (userId) {
          await fetch('/api/notifications/unsubscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId })
          });
        }

        console.log('Usuario desuscrito de notificaciones push');
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
    }
  };

  // Función para probar notificaciones
  const testNotification = async () => {
    if (permission === 'granted' && userId) {
      try {
        await fetch('/api/notifications/test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId })
        });
      } catch (error) {
        console.error('Error sending test notification:', error);
      }
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="notification-manager">
      {permission === 'default' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔔</span>
              <div>
                <h3 className="font-medium text-blue-800">Activar Notificaciones</h3>
                <p className="text-sm text-blue-600">
                  Recibe recordatorios de tareas y notificaciones de logros
                </p>
              </div>
            </div>
            <button
              onClick={requestPermission}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Activar
            </button>
          </div>
        </div>
      )}

      {permission === 'granted' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <h3 className="font-medium text-green-800">Notificaciones Activas</h3>
                <p className="text-sm text-green-600">
                  Recibirás recordatorios y actualizaciones
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={testNotification}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
              >
                Probar
              </button>
              <button
                onClick={unsubscribeUser}
                className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
              >
                Desactivar
              </button>
            </div>
          </div>
        </div>
      )}

      {permission === 'denied' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚫</span>
            <div>
              <h3 className="font-medium text-red-800">Notificaciones Bloqueadas</h3>
              <p className="text-sm text-red-600">
                Para recibir notificaciones, habilítalas en la configuración de tu navegador
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Función auxiliar para convertir VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
