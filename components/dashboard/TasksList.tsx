'use client';

import type { PrismaTask } from '@/lib/types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface TasksListProps {
  pendingTasks: PrismaTask[];
  onAddTaskClick: () => void;
  onTaskClick: (taskId: string) => void;
}

export default function TasksList({ pendingTasks, onAddTaskClick, onTaskClick }: TasksListProps) {
  return (
    <div>
      {/* Título independiente */}
      <div className='mb-4'>
        <h2 className='text-2xl font-display font-black text-gray-800'>Tareas de Hoy</h2>
      </div>

      {/* Botón Add Tarea - Independiente y arriba */}
      <div className='mb-6'>
        <Button
          onClick={onAddTaskClick}
          className='w-full py-4 px-6 bg-orange-500 hover:bg-orange-600 text-white font-display font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all'
        >
          <span className='text-lg mr-2'>➕</span>
          AGREGAR NUEVA TAREA
        </Button>
      </div>

      {/* Grid de tareas - Responsive */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4'>
        {pendingTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onTaskClick(task.id)}
            className='bg-white border-2 border-black p-4 cursor-pointer transition-all hover:bg-orange-50 hover:border-orange-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5'
          >
            <div className='mb-3'>
              <h3 className='font-display font-bold text-gray-800 text-sm mb-1'>{task.title}</h3>
              {task.description && (
                <p className='text-xs text-gray-600 line-clamp-2'>{task.description}</p>
              )}
            </div>

            <div className='flex items-center justify-between'>
              {/* Badge unificado: dificultad + categoría */}
              <Badge 
                variant={
                  task.difficulty === 'easy' 
                    ? 'difficulty-easy' 
                    : task.difficulty === 'medium' 
                    ? 'difficulty-medium' 
                    : 'difficulty-hard'
                }
              >
                {task.category.icon} - {task.category.name}
              </Badge>

              {/* Recompensas con Badge components */}
              <div className='flex gap-1'>
                <Badge variant="reward-coin">
                  +{task.coinReward} 🪙
                </Badge>
                <Badge variant="reward-xp">
                  +{task.skillRewards[task.category.primarySkill]} XP
                </Badge>
              </div>
            </div>
          </div>
        ))}

        {pendingTasks.length === 0 && (
          <div className='col-span-full'>
            <div className='bg-gray-100 border-2 border-gray-300 p-8 text-center'>
              <p className='font-display font-bold text-gray-600'>
                No hay tareas pendientes. ¡Agrega una nueva tarea!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
