const CACHE_NAME = 'gamizky-v2'; // Incrementar versión para limpiar cache
const urlsToCache = [
  '/',
  '/landing',
  '/login',
  '/home',
  '/tasks',
  '/stats',
  '/history',
  '/manifest.json',
  '/gamizkyIcon.png',
  '/gamizky.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Claim control of all clients
  self.clients.claim();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip durante desarrollo para evitar problemas
  if (event.request.url.includes('localhost') && event.request.url.includes('_next')) {
    return;
  }
  
  // Solo cachear requests GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        return fetch(event.request).catch((error) => {
          console.warn('Fetch failed for:', event.request.url, error);
          // Return a basic response for failed requests
          if (event.request.destination === 'document') {
            return new Response('Service Worker: Resource not available offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          }
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Implement background sync logic here
  console.log('Background sync triggered');
  return Promise.resolve();
}

// Push notification handling
self.addEventListener('push', (event) => {
  let notificationData = {
    title: '🎮 Gamizky',
    body: 'Nueva notificación de Gamizky',
    type: 'general',
    url: '/home'
  };

  if (event.data) {
    try {
      notificationData = JSON.parse(event.data.text());
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  // Personalizar notificación según el tipo
  let icon = '/gamizkyIcon.png';
  let actions = [];

  switch (notificationData.type) {
    case 'task_reminder':
      icon = '📝';
      actions = [
        { action: 'view_tasks', title: '📝 Ver Tareas' },
        { action: 'dismiss', title: '✕ Cerrar' }
      ];
      break;
    case 'achievement_unlocked':
      icon = '🏅';
      actions = [
        { action: 'view_achievements', title: '🏅 Ver Logros' },
        { action: 'dismiss', title: '✕ Cerrar' }
      ];
      break;
    case 'challenge_available':
      icon = '🏆';
      actions = [
        { action: 'view_challenges', title: '🏆 Ver Challenges' },
        { action: 'dismiss', title: '✕ Cerrar' }
      ];
      break;
    case 'streak_reminder':
      icon = '🔥';
      actions = [
        { action: 'view_tasks', title: '🔥 Mantener Racha' },
        { action: 'dismiss', title: '✕ Cerrar' }
      ];
      break;
    default:
      actions = [
        { action: 'open_app', title: '🎮 Abrir App' },
        { action: 'dismiss', title: '✕ Cerrar' }
      ];
  }

  const options = {
    body: notificationData.body,
    icon: '/gamizkyIcon.png',
    badge: '/gamizkyIcon.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      url: notificationData.url || '/home',
      type: notificationData.type
    },
    actions: actions,
    requireInteraction: true,
    tag: notificationData.type || 'general'
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  let urlToOpen = '/home';

  // Determinar URL según la acción
  switch (event.action) {
    case 'view_tasks':
      urlToOpen = '/tasks';
      break;
    case 'view_achievements':
      urlToOpen = '/profile'; // O donde muestres achievements
      break;
    case 'view_challenges':
      urlToOpen = '/challenges';
      break;
    case 'open_app':
      urlToOpen = event.notification.data.url || '/home';
      break;
    case 'dismiss':
      return; // No hacer nada, solo cerrar
    default:
      // Click en el cuerpo de la notificación
      urlToOpen = event.notification.data.url || '/home';
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Si ya hay una ventana abierta, enfocarla y navegar
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes(self.location.origin)) {
            client.focus();
            return client.navigate(urlToOpen);
          }
        }
        // Si no hay ventana abierta, abrir una nueva
        return clients.openWindow(urlToOpen);
      })
  );
});
