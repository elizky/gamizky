'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ErrorPageProps {
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export default function ErrorPage({
  title = "¡Oops! Algo salió mal",
  message = "Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.",
  actionText = "Reintentar",
  onAction,
  actionHref,
  className
}: ErrorPageProps) {
  const { data: session, status } = useSession();
  const [defaultRedirect, setDefaultRedirect] = useState('/');

  useEffect(() => {
    if (status !== 'loading') {
      setDefaultRedirect(session ? '/home' : '/');
    }
  }, [session, status]);

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionHref) {
      window.location.href = actionHref;
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = defaultRedirect;
  };

  return (
    <div className={cn(
      'min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4',
      className
    )}>
      <div className='text-center max-w-md'>
        {/* Error Avatar Neo-Brutalist */}
        <div className='w-24 h-24 bg-red-400 border-4 border-black mx-auto mb-6 flex items-center justify-center relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'>
          <span className='text-4xl'>😞</span>
          <div className='absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 border-2 border-black flex items-center justify-center'>
            <span className='text-black font-black text-xs'>!</span>
          </div>
        </div>

        {/* Error Title */}
        <h1 className='text-2xl md:text-3xl font-display font-black text-gray-800 mb-4'>
          {title}
        </h1>
        
        {/* Error Message */}
        <p className='text-gray-600 mb-8 font-sans leading-relaxed'>
          {message}
        </p>

        {/* Action Buttons */}
        <div className='space-y-3'>
          <Button 
            variant='neo-primary'
            onClick={handleAction}
            className='w-full font-display'
          >
            {actionText}
          </Button>
          
          <Button 
            variant='neo-outline'
            onClick={handleGoHome}
            className='w-full font-display'
          >
            🏠 Ir al {session ? 'Dashboard' : 'Inicio'}
          </Button>
        </div>

        {/* Help Text */}
        <p className='text-xs text-gray-500 mt-6 font-sans'>
          Si el problema persiste, intenta refrescar la página o contacta soporte.
        </p>
      </div>
    </div>
  );
}

// Variante compacta para usar dentro de componentes
export function ErrorMessage({ 
  message = "Error al cargar", 
  onRetry,
  className 
}: { 
  message?: string; 
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={cn('bg-red-50 border-2 border-red-400 p-4 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]', className)}>
      <div className='flex items-center justify-center space-x-2 mb-2'>
        <span className='text-red-500 text-lg'>⚠️</span>
        <span className='font-display font-bold text-red-700'>{message}</span>
      </div>
      {onRetry && (
        <Button 
          variant='neo-danger'
          size='sm'
          onClick={onRetry}
          className='mt-2'
        >
          Reintentar
        </Button>
      )}
    </div>
  );
}
