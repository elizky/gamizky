'use client';

import type { PrismaTask } from "@/lib/types";
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface EditCompletedTasksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  completedTasks: PrismaTask[];
  onToggleTask: (taskId: string) => void;
  onRemoveTask: (taskId: string) => void;
}

export default function EditCompletedTasksModal({
  open,
  onOpenChange,
  completedTasks,
  onToggleTask,
  onRemoveTask,
}: EditCompletedTasksModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Editar Tareas Completadas</DialogTitle>
        </DialogHeader>

        <div className='space-y-3'>
          {completedTasks.map((task) => (
            <div
              key={task.id}
              className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'
            >
              <div className='flex items-center gap-3'>
                <span className='text-green-500 text-xl'>✅</span>
                <div>
                  <h4 className='font-medium text-gray-800'>{task.title}</h4>
                  <p className='text-sm text-gray-600'>{task.description}</p>
                </div>
              </div>
              <div className='flex gap-2'>
                <Button
                  variant="neo-primary"
                  size="sm"
                  onClick={() => onToggleTask(task.id)}
                  title='Desmarcar como completada'
                >
                  🔄 Desmarcar
                </Button>
                <Button
                  variant="neo-danger"
                  size="sm"
                  onClick={() => onRemoveTask(task.id)}
                  title='Eliminar tarea'
                >
                  🗑️ Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className='flex justify-end pt-6 border-t mt-6'>
          <Button
            variant="neo-outline"
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
