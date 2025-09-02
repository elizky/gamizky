'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // TEMPORALMENTE DESHABILITADO: Service Worker causando errores 404 con chunks de Next.js
    // TODO: Reactivar una vez solucionados los problemas de cache
    
    // Desregistrar cualquier SW existente para limpiar problemas de cache
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
          console.log('SW unregistered - temporarily disabled');
        });
      });
    }
    return; // Early return - no registrar SW por ahora
    
    // Código original comentado temporalmente:
    /*
    // Deshabilitar Service Worker durante desarrollo
    if (process.env.NODE_ENV === 'development') {
      // Desregistrar cualquier SW existente durante desarrollo
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            registration.unregister();
            console.log('SW unregistered during development');
          });
        });
      }
      return;
    }
    */
    
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.workbox === undefined
    ) {
      // Register service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  if (confirm('Nueva versión disponible. ¿Recargar la página?')) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });

      // Request notification permission
      if ('Notification' in window) {
        Notification.requestPermission();
      }
    }
  }, []);

  return null; // This component doesn't render anything
}
