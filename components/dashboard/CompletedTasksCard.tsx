'use client';

import type { PrismaTask } from "@/lib/types";
import { Button } from '../ui/button';


interface CompletedTasksCardProps {
  completedTasks: PrismaTask[];
  onEditClick: () => void;
}

export default function CompletedTasksCard({ completedTasks, onEditClick }: CompletedTasksCardProps) {
  return (
    <div>
      {/* Título y botón editar */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-display font-black text-gray-800">Completadas Hoy</h2>
        {completedTasks.length > 0 && (
          <Button
            variant='outline'
            size='sm'
            onClick={onEditClick}
            className='text-blue-600 hover:text-blue-700 border-2 border-blue-300 hover:border-blue-400 font-display font-bold'
          >
            ✏️ Editar
          </Button>
        )}
      </div>

      {/* Lista de tareas completadas */}
      <div className='space-y-2'>
        {completedTasks.slice(0, 5).map((task) => (
          <div 
            key={task.id} 
            className='flex items-center p-3 bg-green-100 border-2 border-green-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
          >
            <div className='w-6 h-6 bg-green-500 border-2 border-black flex items-center justify-center mr-3'>
              <span className='text-white font-black text-xs'>✓</span>
            </div>
            <span className='text-sm font-display font-bold text-gray-800 flex-1'>{task.title}</span>
          </div>
        ))}
        {completedTasks.length === 0 && (
          <div className='bg-gray-100 border-2 border-gray-300 p-6 text-center'>
            <p className='font-display font-bold text-gray-600 text-sm'>
              No hay tareas completadas hoy
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
