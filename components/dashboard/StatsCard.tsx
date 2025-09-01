'use client';

import { Card } from '@/components/ui/card';

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

      {/* Grid optimizado de estadísticas neo-brutalist usando Card variants */}
      <div className='grid grid-cols-2 gap-4'>
        {/* Completadas */}
        <Card variant='neo-stat-green' className='p-3 lg:p-4'>
          <div className='text-2xl lg:text-3xl font-number font-black text-white mb-1'>
            {completedTasks}
          </div>
          <div className='text-xs lg:text-sm font-display font-bold text-black uppercase tracking-wide'>
            Completadas
          </div>
        </Card>

        {/* Pendientes */}
        <Card variant='neo-stat-orange' className='p-3 lg:p-4'>
          <div className='text-2xl lg:text-3xl font-number font-black text-white mb-1'>
            {pendingTasks}
          </div>
          <div className='text-xs lg:text-sm font-display font-bold text-black uppercase tracking-wide'>
            Pendientes
          </div>
        </Card>

        {/* Racha - Full width en mobile, tercera columna en desktop */}
        <Card variant='neo-stat-red' className='p-3 lg:p-4 col-span-2'>
          <div className='text-2xl lg:text-3xl font-number font-black text-white mb-1'>
            {streak}
          </div>
          <div className='text-xs lg:text-sm font-display font-bold text-black uppercase tracking-wide'>
            Racha 🔥
          </div>
        </Card>
      </div>
    </div>
  );
}
