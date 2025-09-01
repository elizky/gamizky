'use client';

import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Loading({ message = 'Cargando...', className, size = 'md' }: LoadingProps) {
  const { data: session, status } = useSession();

  const sizeClasses = {
    sm: 'w-8 h-8 text-2xl',
    md: 'w-16 h-16 text-4xl',
    lg: 'w-24 h-24 text-6xl',
  };

  return (
    <div
      className={cn(
        'min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4',
        className
      )}
    >
      <div className='text-center'>
        {/* Loading Cubes Neo-Brutalist */}
        <div className='mb-8 flex justify-center space-x-2'>
          <div className='w-6 h-6 bg-orange-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-bounce'></div>
          <div
            className='w-6 h-6 bg-blue-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-bounce'
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div
            className='w-6 h-6 bg-green-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-bounce'
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className='w-6 h-6 bg-red-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-bounce'
            style={{ animationDelay: '0.3s' }}
          ></div>
        </div>

        {/* Main Loading Square */}
        <div
          className={cn(
            'bg-yellow-400 border-4 border-black mx-auto mb-6 flex items-center justify-center relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
            sizeClasses[size]
          )}
        >
          <span className='animate-pulse'>🎮</span>
          <div className='absolute -bottom-2 -right-2 w-6 h-6 bg-orange-500 border-2 border-black flex items-center justify-center'>
            <div className='w-2 h-2 bg-white animate-ping'></div>
          </div>
        </div>

        {/* Loading Text */}
        <h1 className='text-2xl md:text-3xl font-display font-black text-gray-800 mb-4'>
          {message}
        </h1>

        {/* Progress Bar Neo-Brutalist */}
        <div className='w-48 mx-auto mb-4'>
          <div className='w-full h-4 bg-gray-200 border-2 border-black relative overflow-hidden'>
            <div
              className='h-full bg-gradient-to-r from-orange-500 to-red-500 border-r-2 border-black animate-pulse'
              style={{ width: '60%' }}
            ></div>
          </div>
        </div>

        {/* Auto redirect hint */}
        {status !== 'loading' && (
          <p className='text-xs text-gray-500 mt-2 font-sans'>
            Redirigiendo a {session ? 'dashboard' : 'inicio'}...
          </p>
        )}
      </div>
    </div>
  );
}

// Variante compacta para usar dentro de componentes
export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center p-4', className)}>
      <div className='flex space-x-1'>
        <div className='w-4 h-4 bg-orange-500 border border-black animate-bounce shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'></div>
        <div
          className='w-4 h-4 bg-blue-500 border border-black animate-bounce shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
          style={{ animationDelay: '0.1s' }}
        ></div>
        <div
          className='w-4 h-4 bg-green-500 border border-black animate-bounce shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
          style={{ animationDelay: '0.2s' }}
        ></div>
      </div>
    </div>
  );
}
