'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface StatsCardProps {
  completedTasks: number;
  pendingTasks: number;
  streak: number;
}

export default function StatsCard({ completedTasks, pendingTasks, streak }: StatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas</CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>Tareas Completadas</span>
          <span className='font-medium'>{completedTasks}</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>Tareas Pendientes</span>
          <span className='font-medium'>{pendingTasks}</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>Racha Actual</span>
          <span className='font-medium'>{streak} días 🔥</span>
        </div>
      </CardContent>
    </Card>
  );
}
