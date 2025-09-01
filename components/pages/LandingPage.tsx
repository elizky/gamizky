'use client';

import Link from 'next/link';
import { Button } from '../ui/button';

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      {/* Header Simple */}
      <header className='bg-white border-b-2 border-black shadow-[0_2px_0px_0px_rgba(0,0,0,1)] sticky top-0 z-50'>
        <nav className='max-w-6xl mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='w-8 h-8 bg-orange-500 border-2 border-black flex items-center justify-center'>
                <span className='text-white font-black text-sm'>G</span>
              </div>
              <h1 className='text-xl font-display font-black text-gray-800'>GAMIZKY</h1>
            </div>
            <Link href='/login'>
              <Button variant='neo-primary' className='font-display'>
                ENTRAR
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className='max-w-4xl mx-auto px-4 py-8 md:py-16'>
        {/* Hero Section - Mobile First */}
        <div className='text-center mb-16'>
          {/* Avatar Hero */}
          <div className='mb-8'>
            <div className='w-32 h-32 md:w-40 md:h-40 bg-yellow-400 border-4 border-black mx-auto flex items-center justify-center relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'>
              <span className='text-6xl md:text-7xl'>🎮</span>
              <div className='absolute -bottom-2 -right-2 w-8 h-8 md:w-10 md:h-10 bg-red-500 border-2 border-black flex items-center justify-center'>
                <span className='text-white font-black text-sm md:text-base'>1</span>
              </div>
            </div>
          </div>

          {/* Hero Title */}
          <h1 className='text-4xl md:text-6xl lg:text-7xl font-display font-black text-gray-800 mb-6 leading-tight'>
            GAMIFICA
            <br />
            TU <span className='text-orange-500'>VIDA</span>
          </h1>

          {/* Hero Description - Minimalista */}
          <p className='text-lg md:text-xl text-gray-600 mb-8 font-sans'>
            Convierte tareas en XP. Simple y efectivo.
          </p>

          {/* CTA Principal */}
          <Link href='/login'>
            <Button 
              variant='neo'
              className='text-lg md:text-xl px-8 md:px-12 py-4 md:py-6 font-display mb-4'
            >
              🚀 EMPEZAR GRATIS
            </Button>
          </Link>
          <p className='text-sm text-gray-500 font-sans'>
            Solo necesitas una cuenta de Google
          </p>
        </div>

        {/* Details Section - Bullets */}
        <div className='mb-16'>
          <div className='bg-white border-2 border-black p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-2xl mx-auto'>
            <h2 className='text-2xl font-display font-black text-gray-800 mb-6 text-center'>
              ¿Qué Puedes Hacer?
            </h2>
            
            <div className='space-y-4 text-left'>
              <div className='flex items-start gap-3'>
                <div className='w-6 h-6 bg-orange-500 border-2 border-black flex items-center justify-center flex-shrink-0 mt-0.5'>
                  <span className='text-white font-black text-xs'>✓</span>
                </div>
                <p className='text-gray-700 font-sans'>
                  <strong>Crear tareas</strong> de cualquier tipo: ejercicio, trabajo, hobbies
                </p>
              </div>
              
              <div className='flex items-start gap-3'>
                <div className='w-6 h-6 bg-green-500 border-2 border-black flex items-center justify-center flex-shrink-0 mt-0.5'>
                  <span className='text-white font-black text-xs'>✓</span>
                </div>
                <p className='text-gray-700 font-sans'>
                  <strong>Ganar XP</strong> al completar tareas y subir de nivel automáticamente
                </p>
              </div>
              
              <div className='flex items-start gap-3'>
                <div className='w-6 h-6 bg-blue-500 border-2 border-black flex items-center justify-center flex-shrink-0 mt-0.5'>
                  <span className='text-white font-black text-xs'>✓</span>
                </div>
                <p className='text-gray-700 font-sans'>
                  <strong>Mantener rachas</strong> completando tareas consistentemente
                </p>
              </div>
              
              <div className='flex items-start gap-3'>
                <div className='w-6 h-6 bg-purple-500 border-2 border-black flex items-center justify-center flex-shrink-0 mt-0.5'>
                  <span className='text-white font-black text-xs'>✓</span>
                </div>
                <p className='text-gray-700 font-sans'>
                  <strong>Ver estadísticas</strong> de tu progreso y productividad
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works - Simplified */}
        <div className='mb-16'>
          <h2 className='text-2xl md:text-3xl font-display font-black text-gray-800 text-center mb-8'>
            ¿Cómo Funciona?
          </h2>
          
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Step 1 */}
            <div className='bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center'>
              <div className='w-12 h-12 bg-orange-500 border-2 border-black mx-auto mb-4 flex items-center justify-center'>
                <span className='text-white font-black'>1</span>
              </div>
              <h3 className='font-display font-bold text-gray-800 mb-2'>Crea Tareas</h3>
              <p className='text-sm text-gray-600 font-sans'>
                Ejercicio, lectura, trabajo...
              </p>
            </div>

            {/* Step 2 */}
            <div className='bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center'>
              <div className='w-12 h-12 bg-green-500 border-2 border-black mx-auto mb-4 flex items-center justify-center'>
                <span className='text-white font-black'>2</span>
              </div>
              <h3 className='font-display font-bold text-gray-800 mb-2'>Complétalas</h3>
              <p className='text-sm text-gray-600 font-sans'>
                Marca como terminadas
              </p>
            </div>

            {/* Step 3 */}
            <div className='bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center'>
              <div className='w-12 h-12 bg-blue-500 border-2 border-black mx-auto mb-4 flex items-center justify-center'>
                <span className='text-white font-black'>3</span>
              </div>
              <h3 className='font-display font-bold text-gray-800 mb-2'>Gana XP</h3>
              <p className='text-sm text-gray-600 font-sans'>
                Sube de nivel automáticamente
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className='mb-16'>
          <h2 className='text-2xl md:text-3xl font-display font-black text-gray-800 text-center mb-8'>
            Características
          </h2>
          
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='bg-blue-400 border-2 border-black p-4 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'>
              <div className='text-2xl mb-2'>📝</div>
              <div className='text-sm font-display font-bold text-white'>TAREAS</div>
            </div>
            <div className='bg-green-400 border-2 border-black p-4 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'>
              <div className='text-2xl mb-2'>⭐</div>
              <div className='text-sm font-display font-bold text-white'>NIVELES</div>
            </div>
            <div className='bg-purple-400 border-2 border-black p-4 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'>
              <div className='text-2xl mb-2'>🔥</div>
              <div className='text-sm font-display font-bold text-white'>RACHAS</div>
            </div>
            <div className='bg-red-400 border-2 border-black p-4 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'>
              <div className='text-2xl mb-2'>📊</div>
              <div className='text-sm font-display font-bold text-white'>STATS</div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className='text-center'>
          <div className='bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'>
            <h2 className='text-2xl md:text-3xl font-display font-black text-gray-800 mb-4'>
              ¿Listo para Empezar?
            </h2>
            <p className='text-gray-600 mb-6 font-sans'>
              Únete y transforma tu productividad en una aventura
            </p>
            <Link href='/login'>
              <Button 
                variant='neo-success'
                className='text-lg px-8 py-4 font-display'
              >
                ✨ CREAR CUENTA GRATIS
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Minimalista */}
      <footer className='pt-16 flex items-center justify-center p-4'>
        <p className='font-mono text-xs text-gray-500'>
          creado por{' '}
          <Link href='https://www.izky.dev/' target='_blank' className='hover:underline text-gray-700'>
            Izky
          </Link>
        </p>
      </footer>
    </div>
  );
}