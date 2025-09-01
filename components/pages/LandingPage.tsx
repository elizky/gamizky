import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-white'>
      {/* Header */}
      <header className='relative z-10 border-b-4 border-black'>
        <nav className='max-w-7xl mx-auto px-6 py-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-orange-500 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'></div>
              <h1 className='text-3xl font-black text-black tracking-tight'>GAMIZKY</h1>
            </div>
            <div className='flex items-center gap-4'>
              <Link
                href='/login'
                className='px-8 py-3 bg-black text-white font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200'
              >
                INICIAR
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className='relative z-10'>
        <div className='max-w-7xl mx-auto px-6 py-20'>
          <div className='text-center'>
            {/* Hero Title */}
            <h1 className='text-7xl md:text-8xl font-black text-black mb-8 leading-none tracking-tight'>
              TRANSFORMA
              <br />
              <span className='text-orange-500'>TU VIDA</span>
              <br />
              CON XP
            </h1>

            {/* Hero Description */}
            <p className='text-2xl md:text-3xl text-gray-700 mb-12 max-w-4xl mx-auto leading-tight font-medium'>
              Convierte tareas aburridas en una aventura épica.
              <br />
              <span className='font-bold'>Gana XP • Sube de Nivel • Desbloquea Logros</span>
            </p>

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row gap-6 justify-center items-center mb-20'>
              <Link
                href='/login'
                className='px-12 py-6 bg-orange-500 text-black font-black text-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-2 hover:-translate-y-2 transition-all duration-200'
              >
                🎯 COMENZAR AVENTURA
              </Link>
              <Link
                href='/what-is'
                className='px-12 py-6 bg-white text-black font-black text-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-2 hover:-translate-y-2 transition-all duration-200'
              >
                📖 ¿QUÉ ES GAMIZKY?
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className='py-20 bg-gray-50 border-t-4 border-black'>
        <div className='max-w-7xl mx-auto px-6'>
          <h2 className='text-5xl font-black text-black text-center mb-16 tracking-tight'>
            CARACTERÍSTICAS ÉPICAS
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {/* Feature 1: XP System */}
            <div className='bg-blue-500 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8'>
              <div className='w-20 h-20 bg-yellow-400 border-4 border-black mb-6 mx-auto'></div>
              <h3 className='text-2xl font-black text-white mb-4'>SISTEMA XP</h3>
              <p className='text-white text-lg leading-relaxed'>
                Gana experiencia por cada tarea completada.
                <span className='font-bold'>¡Sube de nivel constantemente!</span>
              </p>
            </div>

            {/* Feature 2: Achievements */}
            <div className='bg-green-500 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8'>
              <div className='w-20 h-20 bg-yellow-400 border-4 border-black mb-6 mx-auto'></div>
              <h3 className='text-2xl font-black text-white mb-4'>LOGROS</h3>
              <p className='text-white text-lg leading-relaxed'>
                Desbloquea logros especiales y gana monedas para
                <span className='font-bold'>personalizar tu experiencia</span>
              </p>
            </div>

            {/* Feature 3: Progress Tracking */}
            <div className='bg-purple-500 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8'>
              <div className='w-20 h-20 bg-yellow-400 border-4 border-black mb-6 mx-auto'></div>
              <h3 className='text-2xl font-black text-white mb-4'>PROGRESO</h3>
              <p className='text-white text-lg leading-relaxed'>
                Visualiza tu progreso con gráficos y estadísticas
                <span className='font-bold'>detalladas</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-6'>
          <h2 className='text-5xl font-black text-black text-center mb-16 tracking-tight'>
            ¿CÓMO FUNCIONA?
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            {/* Step 1 */}
            <div className='text-center'>
              <div className='w-16 h-16 bg-red-500 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto mb-4 flex items-center justify-center'>
                <span className='text-2xl font-black text-white'>1</span>
              </div>
              <h3 className='text-xl font-bold text-black mb-2'>CREA TAREAS</h3>
              <p className='text-gray-700'>Define tus objetivos diarios</p>
            </div>

            {/* Step 2 */}
            <div className='text-center'>
              <div className='w-16 h-16 bg-blue-500 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto mb-4 flex items-center justify-center'>
                <span className='text-2xl font-black text-white'>2</span>
              </div>
              <h3 className='text-xl font-bold text-black mb-2'>COMPLÉTALAS</h3>
              <p className='text-gray-700'>Marca como terminadas</p>
            </div>

            {/* Step 3 */}
            <div className='text-center'>
              <div className='w-16 h-16 bg-green-500 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto mb-4 flex items-center justify-center'>
                <span className='text-2xl font-black text-white'>3</span>
              </div>
              <h3 className='text-xl font-bold text-black mb-2'>GANA XP</h3>
              <p className='text-gray-700'>Acumula experiencia</p>
            </div>

            {/* Step 4 */}
            <div className='text-center'>
              <div className='w-16 h-16 bg-purple-500 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto mb-4 flex items-center justify-center'>
                <span className='text-2xl font-black text-white'>4</span>
              </div>
              <h3 className='text-xl font-bold text-black mb-2'>SUBE DE NIVEL</h3>
              <p className='text-gray-700'>¡Desbloquea nuevas habilidades!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-20 bg-yellow-400 border-t-4 border-black'>
        <div className='max-w-7xl mx-auto px-6'>
          <h2 className='text-5xl font-black text-black text-center mb-16 tracking-tight'>
            ESTADÍSTICAS IMPRESIONANTES
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='text-6xl font-black text-black mb-4'>10K+</div>
              <p className='text-xl font-bold text-black'>TAREAS COMPLETADAS</p>
            </div>
            <div className='text-center'>
              <div className='text-6xl font-black text-black mb-4'>500+</div>
              <p className='text-xl font-bold text-black'>USUARIOS ACTIVOS</p>
            </div>
            <div className='text-center'>
              <div className='text-6xl font-black text-black mb-4'>50+</div>
              <p className='text-xl font-bold text-black'>LOGROS DESBLOQUEADOS</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className='py-20 bg-black'>
        <div className='max-w-4xl mx-auto px-6 text-center'>
          <h2 className='text-5xl font-black text-white mb-8 tracking-tight'>
            ¿LISTO PARA LA AVENTURA?
          </h2>
          <p className='text-2xl text-gray-300 mb-12 leading-relaxed'>
            Únete a miles de personas que ya están transformando
            <br />
            <span className='font-bold text-white'>sus vidas con gamificación</span>
          </p>
          <Link
            href='/login'
            className='inline-block px-16 py-8 bg-orange-500 text-black font-black text-2xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] hover:shadow-[16px_16px_0px_0px_rgba(255,255,255,1)] hover:-translate-x-2 hover:-translate-y-2 transition-all duration-200'
          >
            🚀 COMENZAR AHORA
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className='py-12 bg-white border-t-4 border-black'>
        <div className='max-w-7xl mx-auto px-6 text-center'>
          <div className='w-16 h-16 bg-orange-500 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto mb-6'></div>
          <p className='text-xl font-bold text-black'>
            © 2024 GAMIZKY. Transforma tu vida, una tarea a la vez.
          </p>
        </div>
      </footer>
    </div>
  );
}
