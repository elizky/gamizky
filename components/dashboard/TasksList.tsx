'use client';

import type { PrismaTask } from "@/lib/types";
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface TasksListProps {
  pendingTasks: PrismaTask[];
  onAddTaskClick: () => void;
  onTaskClick: (taskId: string) => void;
}

export default function TasksList({ 
  pendingTasks, 
  onAddTaskClick, 
  onTaskClick 
}: TasksListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tareas de Hoy</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Botón para abrir modal */}
        <div className='mb-4'>
          <Button
            onClick={onAddTaskClick}
            className='w-full py-3 px-6 font-medium flex items-center justify-center gap-2'
          >
            <span>➕</span>
            Agregar Nueva Tarea
          </Button>
        </div>

        {/* Lista de tareas */}
        <div className='space-y-3'>
          {pendingTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onTaskClick(task.id)}
              className='flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
            >
              <div className='flex-1'>
                <h4 className='font-medium text-gray-800'>{task.title}</h4>
                <p className='text-sm text-gray-600'>{task.description}</p>
                <div className='flex items-center gap-2 mt-1'>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${task.category.color} text-white`}
                  >
                    {task.category.icon} {task.category.name}
                  </span>
                  <span className='text-xs text-gray-500'>
                    {task.difficulty === 'easy'
                      ? '🟢'
                      : task.difficulty === 'medium'
                      ? '🟡'
                      : '🔴'}{' '}
                    {task.difficulty}
                  </span>
                </div>
              </div>
              <div className='text-right'>
                <div className='text-sm font-medium text-blue-600'>+{task.coinReward} 🪙</div>
                <div className='text-xs text-gray-500'>
                  +{task.skillRewards[task.category.primarySkill]} XP
                </div>
              </div>
            </div>
          ))}
          {pendingTasks.length === 0 && (
            <p className='text-muted-foreground text-center py-8'>
              No hay tareas pendientes. ¡Agrega una nueva tarea!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
