import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
      {/* Header */}
      <header className='relative z-10'>
        <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='text-3xl'>🎮</div>
              <h1 className='text-2xl font-bold text-gray-800'>GAMIZKY</h1>
            </div>
            <div className='flex items-center gap-4'>
              <Link
                href='/login'
                className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className='relative z-10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
          <div className='text-center'>
            {/* Hero Icon */}
            <div className='mb-8'>
              <div className='text-8xl mb-6'>🚀</div>
              <h1 className='text-5xl md:text-6xl font-bold text-gray-800 mb-6'>
                Transforma tu vida con
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'>
                  {' '}Gamificación
                </span>
              </h1>
            </div>

            {/* Hero Description */}
            <p className='text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed'>
              Convierte tus tareas diarias en una aventura épica. Gana XP, sube de nivel, 
              desbloquea logros y construye hábitos duraderos de la manera más divertida.
            </p>

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-16'>
              <Link
                href='/login'
                className='px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1'
              >
                🎯 Comenzar Aventura
              </Link>
              <Link
                href='/what-is'
                className='px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-semibold text-lg'
              >
                📖 ¿Qué es GAMIZKY?
              </Link>
            </div>

            {/* Features Grid */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
              <div className='text-center p-6'>
                <div className='text-4xl mb-4'>⚡</div>
                <h3 className='text-xl font-semibold text-gray-800 mb-2'>Sistema de XP</h3>
                <p className='text-gray-600'>
                  Gana experiencia por cada tarea completada y sube de nivel constantemente
                </p>
              </div>
              <div className='text-center p-6'>
                <div className='text-4xl mb-4'>🏆</div>
                <h3 className='text-xl font-semibold text-gray-800 mb-2'>Logros y Recompensas</h3>
                <p className='text-gray-600'>
                  Desbloquea logros especiales y gana monedas para personalizar tu experiencia
                </p>
              </div>
              <div className='text-center p-6'>
                <div className='text-4xl mb-4'>📊</div>
                <h3 className='text-xl font-semibold text-gray-800 mb-2'>Seguimiento Visual</h3>
                <p className='text-gray-600'>
                  Visualiza tu progreso con gráficos y estadísticas detalladas
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Elements */}
      <div className='absolute top-20 left-10 text-6xl opacity-20 animate-bounce'>
        🎮
      </div>
      <div className='absolute top-40 right-20 text-4xl opacity-20 animate-pulse'>
        ⭐
      </div>
      <div className='absolute bottom-40 left-20 text-5xl opacity-20 animate-bounce'>
        🚀
      </div>
      <div className='absolute bottom-20 right-10 text-6xl opacity-20 animate-pulse'>
        🎯
      </div>

      {/* Footer */}
      <footer className='relative z-10 mt-20 py-8 border-t border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <p className='text-gray-500'>
            © 2024 GAMIZKY. Transforma tu vida, una tarea a la vez.
          </p>
        </div>
      </footer>
    </div>
  );
}
