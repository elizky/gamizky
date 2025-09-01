'use client';

import { useEffect } from 'react';
import ErrorPage from '@/components/ui/error';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error en la aplicación:', error);
  }, [error]);

  return (
    <ErrorPage
      title="¡Algo salió mal!"
      message={error.message || "Ha ocurrido un error inesperado en la aplicación."}
      actionText="🔄 Intentar de nuevo"
      onAction={reset}
    />
  );
}
