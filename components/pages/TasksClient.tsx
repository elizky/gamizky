'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateTask, deleteTask, completeTask, uncompleteTask } from '../../actions';
import type { PrismaTask, PrismaTaskCategory } from '../../lib/types';
import { getRecurringProgress, getNeglectIndicator } from '../../lib/recurring';
import { AddTaskModal } from '../modals';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface TasksClientProps {
  tasks: PrismaTask[];
  categories: PrismaTaskCategory[];
}

export default function TasksClient({ tasks: initialTasks, categories }: TasksClientProps) {
  const router = useRouter();
  const [tasks, setTasks] = useState<PrismaTask[]>(initialTasks);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<PrismaTask | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar y buscar tareas
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Aplicar filtro de estado
    if (filter === 'pending') {
      filtered = filtered.filter((task) => !task.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter((task) => task.completed);
    }

    // Aplicar búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      // Priorizar tareas pendientes
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // Luego por fecha de creación
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks, filter, searchTerm]);

  const handleTaskCreated = (task: PrismaTask) => {
    setTasks((prev) => [task, ...prev]);
    setSuccess('Tarea creada exitosamente');
    router.refresh();
  };

  const toggleTask = async (taskId: string) => {
    try {
      setError(null);
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      if (task.completed) {
        const result = await uncompleteTask(taskId);
        if (result.success) {
          setTasks((prev) =>
            prev.map((task) => (task.id === taskId ? { ...task, completed: false } : task))
          );
          
          // Mostrar recompensas revertidas
          if (result.rewards) {
            setSuccess(`Tarea desmarcada. ${result.rewards.xp} XP, ${result.rewards.coins} monedas revertidas`);
          } else {
            setSuccess('Tarea marcada como pendiente');
          }
        } else {
          setError(result.error || 'Error al desmarcar la tarea');
        }
      } else {
        const result = await completeTask(taskId);
        if (result.success) {
          setTasks((prev) =>
            prev.map((task) => (task.id === taskId ? { ...task, completed: true } : task))
          );

          // Mostrar recompensas reales obtenidas
          if (result.rewards) {
            setSuccess(
              `¡Tarea completada! +${result.rewards.xp} XP, +${result.rewards.coins} monedas`
            );
          } else {
            setSuccess('¡Tarea completada!');
          }
        } else {
          setError(result.error || 'Error al completar la tarea');
        }
      }

      router.refresh();
    } catch (error) {
      console.error('Error toggling task:', error);
      setError('Error inesperado al cambiar el estado de la tarea');
    }
  };

  const removeTask = async (taskId: string) => {
    try {
      setError(null);
      const result = await deleteTask(taskId);
      if (result.success) {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
        setSuccess('Tarea eliminada exitosamente');
        router.refresh();
      } else {
        setError(result.error || 'Error al eliminar la tarea');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Error inesperado al eliminar la tarea');
    }
  };

  const openEditModal = (task: PrismaTask) => {
    setEditingTask(task);
    setShowEditTaskModal(true);
  };

  const updateExistingTask = async () => {
    if (!editingTask) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const result = await updateTask(editingTask.id, {
        title: editingTask.title,
        description: editingTask.description,
        categoryId: editingTask.categoryId,
        difficulty: editingTask.difficulty,
        estimatedDuration: editingTask.estimatedDuration || undefined,
        recurringType: editingTask.recurringType || undefined,
        recurringTarget: editingTask.recurringTarget || undefined,
      });

      if (result.success && result.data) {
        setTasks((prev) =>
          prev.map((task) => (task.id === editingTask.id ? (result.data as PrismaTask) : task))
        );
        setShowEditTaskModal(false);
        setEditingTask(null);
        setSuccess('Tarea actualizada exitosamente');
        router.refresh();
      } else {
        setError(result.error || 'Error al actualizar la tarea');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Error inesperado al actualizar la tarea');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  };

  const stats = getTaskStats();

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='mb-6'>
          <Link
            href='/home'
            className='inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 font-medium'
          >
            ← Volver al inicio
          </Link>
          <h1 className='text-4xl font-display font-bold text-gray-800'>Mis Tareas</h1>
          <p className='text-gray-600 mt-2 font-sans'>Gestiona y completa tus tareas diarias</p>
        </div>

        {/* Mostrar errores y éxitos */}
        {error && (
          <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg'>
            <div className='flex items-center justify-between'>
              <p className='text-red-800'>{error}</p>
              <button
                onClick={() => setError(null)}
                className='text-red-600 hover:text-red-800 text-xl'
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className='mb-4 p-4 bg-green-50 border border-green-200 rounded-lg'>
            <div className='flex items-center justify-between'>
              <p className='text-green-800'>{success}</p>
              <button
                onClick={() => setSuccess(null)}
                className='text-green-600 hover:text-green-800 text-xl'
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Stats y controles */}
        <div className='bg-white rounded-2xl shadow-lg p-6 mb-6'>
          <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
            <div className='grid grid-cols-3 gap-6'>
              <div className='text-center'>
                <div className='text-4xl font-number font-black text-blue-600'>{stats.total}</div>
                <Badge variant='outline' className='mt-1 font-display'>
                  Total
                </Badge>
              </div>
              <div className='text-center'>
                <div className='text-4xl font-number font-black text-green-600'>
                  {stats.completed}
                </div>
                <Badge variant='outline' className='mt-1 font-display'>
                  Completadas
                </Badge>
              </div>
              <div className='text-center'>
                <div className='text-4xl font-number font-black text-orange-600'>
                  {stats.pending}
                </div>
                <Badge variant='outline' className='mt-1 font-display'>
                  Pendientes
                </Badge>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <Progress
                value={stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}
                className='w-32'
              />
              <Button
                variant='neo-primary'
                onClick={() => setShowAddTaskModal(true)}
                className='font-display'
              >
                ➕ Nueva Tarea
              </Button>
            </div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className='bg-white rounded-2xl shadow-lg p-6 mb-6'>
          <div className='flex flex-col lg:flex-row gap-4'>
            <div className='flex-1'>
              <Input
                variant='neo'
                type='text'
                placeholder='Buscar tareas...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full'
              />
            </div>
            <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
              <TabsList className='grid w-full grid-cols-3'>
                <TabsTrigger value='all'>Todas</TabsTrigger>
                <TabsTrigger value='pending'>Pendientes</TabsTrigger>
                <TabsTrigger value='completed'>Completadas</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Lista de tareas */}
        <div className='bg-white rounded-2xl shadow-lg p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-display font-bold text-gray-800'>
              {filter === 'all'
                ? 'Todas las Tareas'
                : filter === 'pending'
                ? 'Tareas Pendientes'
                : 'Tareas Completadas'}
            </h2>
            <Badge variant='secondary' className='text-lg px-3 py-1 font-number font-black'>
              {filteredTasks.length}
            </Badge>
          </div>

          <TooltipProvider>
            <div className='space-y-3'>
              {filteredTasks.map((task) => {
                // Check if task is neglected
                const neglectIndicator = getNeglectIndicator({
                  completions: task.completions,
                  recurring: task.recurring,
                  recurringType: task.recurringType,
                  recurringTarget: task.recurringTarget,
                });

                return (
                  <div
                    key={task.id}
                    className={`flex items-center p-4 rounded-lg transition-all hover:scale-[1.01] ${
                      task.completed
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                <div className='flex-1'>
                  <div className='flex items-center gap-3'>
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        task.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      {task.completed && '✓'}
                    </button>
                    <div>
                      <div className='flex items-center gap-2'>
                        <h4
                          className={`font-medium ${
                            task.completed ? 'line-through text-gray-600' : 'text-gray-800'
                          }`}
                        >
                          {task.title}
                        </h4>
                        
                        {/* Indicador de tarea neglectada */}
                        {neglectIndicator && (
                          <Tooltip>
                            <TooltipTrigger>
                              <span 
                                className={`text-lg ${
                                  neglectIndicator.severity === 'severe' ? 'animate-pulse' : ''
                                }`}
                              >
                                {neglectIndicator.emoji}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className='text-sm'>{neglectIndicator.message}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <p
                        className={`text-sm ${task.completed ? 'text-gray-500' : 'text-gray-600'}`}
                      >
                        {task.description}
                      </p>

                      {/* Progreso para tareas recurrentes avanzadas */}
                      {task.recurring &&
                        (task.recurringType === 'x_per_week' ||
                          task.recurringType === 'x_per_month') &&
                        (() => {
                          const progress = getRecurringProgress({
                            completions: task.completions,
                            recurring: task.recurring,
                            recurringType: task.recurringType,
                            recurringTarget: task.recurringTarget,
                          });

                          if (progress) {
                            return (
                              <div className='mt-2'>
                                <div className='flex justify-between items-center text-xs text-gray-600 mb-1'>
                                  <span>
                                    {progress.current}/{progress.target} esta {progress.period}
                                  </span>
                                  <span>{Math.round(progress.percentage)}%</span>
                                </div>
                                <Progress value={progress.percentage} className='h-2' />
                              </div>
                            );
                          }
                          return null;
                        })()}
                    </div>
                  </div>
                  <div className='flex items-center gap-2 mt-3'>
                    <Badge variant='outline' className='gap-1'>
                      {task.category.icon}
                      {' - '}
                      {task.category.name}
                    </Badge>
                    <Badge
                      variant={
                        task.difficulty === 'easy'
                          ? 'secondary'
                          : task.difficulty === 'medium'
                          ? 'default'
                          : 'destructive'
                      }
                    >
                      {task.difficulty === 'easy'
                        ? '🟢'
                        : task.difficulty === 'medium'
                        ? '🟡'
                        : '🔴'}
                      {' - '}
                      {task.difficulty}
                    </Badge>
                    <Badge variant='outline'>
                      📅 -{' '}
                      {task.recurringType === 'daily'
                        ? 'Diaria'
                        : task.recurringType === 'weekly'
                        ? 'Semanal'
                        : task.recurringType === 'monthly'
                        ? 'Mensual'
                        : task.recurringType === 'x_per_week'
                        ? `${task.recurringTarget}/semana`
                        : task.recurringType === 'x_per_month'
                        ? `${task.recurringTarget}/mes`
                        : task.recurringType}
                    </Badge>
                  </div>
                </div>
                <div className='flex flex-col gap-1'>
                  <Badge variant='reward-coin'>+{task.coinReward} 🪙</Badge>
                  <Badge variant='reward-xp'>
                    +{Object.values(task.skillRewards as Record<string, number>).reduce((sum, xp) => sum + xp, 0)} XP
                  </Badge>
                  <div className='flex gap-1 mt-3'>
                    <Button
                      variant='neo-outline'
                      size='sm'
                      onClick={() => openEditModal(task)}
                      className='h-8 w-8 p-0'
                    >
                      ✏️
                    </Button>
                    <Button
                      variant='neo-danger'
                      size='sm'
                      onClick={() => removeTask(task.id)}
                      className='h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50'
                    >
                      🗑️
                    </Button>
                  </div>
                </div>
              </div>
                );
              })}
            {filteredTasks.length === 0 && (
              <div className='text-center py-12'>
                <div className='text-6xl mb-4'>📝</div>
                <p className='text-gray-500 text-lg'>
                  {filter === 'all'
                    ? 'No hay tareas creadas'
                    : filter === 'pending'
                    ? 'No hay tareas pendientes'
                    : 'No hay tareas completadas'}
                </p>
                {filter !== 'all' && (
                  <button
                    onClick={() => setFilter('all')}
                    className='mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium'
                  >
                    Ver todas las tareas
                  </button>
                )}
              </div>
            )}
            </div>
          </TooltipProvider>
        </div>
      </div>

      {/* Modal reutilizable para agregar tarea */}
      <AddTaskModal
        open={showAddTaskModal}
        onOpenChange={setShowAddTaskModal}
        categories={categories}
        onTaskCreated={handleTaskCreated}
      />

      {/* Modal para editar tarea */}
      {showEditTaskModal && editingTask && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-gray-800'>Editar Tarea</h2>
                <button
                  onClick={() => {
                    setShowEditTaskModal(false);
                    setEditingTask(null);
                  }}
                  className='text-gray-400 hover:text-gray-600 text-2xl'
                >
                  ✕
                </button>
              </div>

              <div className='space-y-4'>
                {/* Título */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Título *</label>
                  <input
                    type='text'
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Descripción
                  </label>
                  <input
                    type='text'
                    value={editingTask.description}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, description: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>

                {/* Categoría */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Categoría *
                  </label>
                  <select
                    value={editingTask.categoryId}
                    onChange={(e) => setEditingTask({ ...editingTask, categoryId: e.target.value })}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dificultad */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Dificultad</label>
                  <select
                    value={editingTask.difficulty}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        difficulty: e.target.value as 'easy' | 'medium' | 'hard',
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  >
                    <option value='easy'>🟢 Fácil</option>
                    <option value='medium'>🟡 Medio</option>
                    <option value='hard'>🔴 Difícil</option>
                  </select>
                </div>

                {/* Recurrencia y Duración */}
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Recurrencia
                    </label>
                    <select
                      value={editingTask.recurringType || 'daily'}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          recurringType: e.target.value as
                            | 'daily'
                            | 'weekly'
                            | 'monthly'
                            | 'x_per_week'
                            | 'x_per_month',
                        })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    >
                      <option value='daily'>📅 Diaria</option>
                      <option value='weekly'>📆 Semanal</option>
                      <option value='monthly'>🗓️ Mensual</option>
                      <option value='x_per_week'>💪 X veces por semana</option>
                      <option value='x_per_month'>🎯 X veces por mes</option>
                    </select>
                  </div>

                  {/* Campo condicional para target de recurrencia */}
                  {(editingTask.recurringType === 'x_per_week' ||
                    editingTask.recurringType === 'x_per_month') && (
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        🎯 ¿Cuántas veces?
                      </label>
                      <input
                        type='number'
                        min='1'
                        max='30'
                        value={editingTask.recurringTarget || 1}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            recurringTarget: parseInt(e.target.value) || 1,
                          })
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      />
                    </div>
                  )}

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Duración</label>
                    <input
                      type='number'
                      min='0'
                      value={editingTask.estimatedDuration || 0}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          estimatedDuration: parseInt(e.target.value) || 0,
                        })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  </div>
                </div>

                {/* Botones de acción */}
                <div className='flex gap-3 pt-4 border-t'>
                  <button
                    onClick={() => {
                      setShowEditTaskModal(false);
                      setEditingTask(null);
                    }}
                    className='flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={updateExistingTask}
                    disabled={!editingTask.title.trim() || isSubmitting}
                    className='flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {isSubmitting ? 'Actualizando...' : 'Actualizar Tarea'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
