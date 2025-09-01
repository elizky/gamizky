'use client';

import { useEffect } from 'react';

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Aquí puedes agregar lógica que se ejecute en cada navegación del dashboard
    // Por ejemplo, verificar el estado de autenticación, actualizar notificaciones, etc.
    
    // Ejemplo: Verificar si el usuario está activo
    const checkUserActivity = () => {
      // Lógica para verificar actividad del usuario
      console.log('Verificando actividad del usuario...');
    };

    checkUserActivity();
  }, []);

  return <>{children}</>;
}
