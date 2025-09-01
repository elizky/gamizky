'use client';

interface StatsCardProps {
  completedTasks: number;
  pendingTasks: number;
  streak: number;
}

export default function StatsCard({ completedTasks, pendingTasks, streak }: StatsCardProps) {
  return (
    <div>
      {/* Título independiente */}
      <div className='mb-4'>
        <h2 className='text-2xl font-display font-black text-gray-800'>Estadísticas</h2>
      </div>

      {/* Grid optimizado de estadísticas neo-brutalist */}
      <div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
        {/* Completadas */}
        <div className='bg-green-400 border-2 border-black p-3 lg:p-4 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all'>
          <div className='text-2xl lg:text-3xl font-number font-black text-white mb-1'>{completedTasks}</div>
          <div className='text-xs lg:text-sm font-display font-bold text-black uppercase tracking-wide'>
            Completadas
          </div>
        </div>

        {/* Pendientes */}
        <div className='bg-orange-400 border-2 border-black p-3 lg:p-4 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all'>
          <div className='text-2xl lg:text-3xl font-number font-black text-white mb-1'>{pendingTasks}</div>
          <div className='text-xs lg:text-sm font-display font-bold text-black uppercase tracking-wide'>
            Pendientes
          </div>
        </div>

        {/* Racha - Full width en mobile, tercera columna en desktop */}
        <div className='bg-red-400 border-2 border-black p-3 lg:p-4 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all col-span-2 lg:col-span-1'>
          <div className='text-2xl lg:text-3xl font-number font-black text-white mb-1'>{streak}</div>
          <div className='text-xs lg:text-sm font-display font-bold text-black uppercase tracking-wide'>
            Racha 🔥
          </div>
        </div>
      </div>
    </div>
  );
}
