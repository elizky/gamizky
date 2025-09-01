'use client';

import type { PrismaTask } from "@/lib/types";
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface CompletedTasksCardProps {
  completedTasks: PrismaTask[];
  onEditClick: () => void;
}

export default function CompletedTasksCard({ completedTasks, onEditClick }: CompletedTasksCardProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle>Completadas Hoy</CardTitle>
        {completedTasks.length > 0 && (
          <Button
            variant='ghost'
            size='sm'
            onClick={onEditClick}
            className='text-blue-600 hover:text-blue-700'
          >
            ✏️ Editar
          </Button>
        )}
      </CardHeader>
      <CardContent className='space-y-2'>
        {completedTasks.slice(0, 5).map((task) => (
          <div key={task.id} className='flex items-center p-2 bg-green-50 rounded-lg'>
            <span className='text-green-500 mr-2'>✅</span>
            <span className='text-sm text-gray-700'>{task.title}</span>
          </div>
        ))}
        {completedTasks.length === 0 && (
          <p className='text-muted-foreground text-sm text-center py-4'>
            No hay tareas completadas hoy
          </p>
        )}
      </CardContent>
    </Card>
  );
}
