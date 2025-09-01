'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createTask, updateTask, deleteTask, completeTask } from '../../actions';
import type { PrismaTask, PrismaTaskCategory } from '../../types/prisma';

interface TasksClientProps {
  tasks: PrismaTask[];
  categories: PrismaTaskCategory[];
}

export default function TasksClient({ tasks: initialTasks, categories }: TasksClientProps) {
  const router = useRouter();
  const [tasks, setTasks] = useState<PrismaTask[]>(initialTasks);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    categories: [{ categoryId: '', points: 50 }] as Array<{ categoryId: string; points: number }>,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    skillRewards: {} as Record<string, number>,
    estimatedDuration: 0,
    recurring: true,
    recurringType: 'daily' as 'daily' | 'weekly' | 'monthly',
  });

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

  const addTask = async () => {
    if (!newTask.title.trim() || !newTask.categories.some((cat) => cat.categoryId)) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const skillRewards: Record<string, number> = {};
      const coinReward = 25;

      newTask.categories.forEach((cat) => {
        if (cat.categoryId) {
          const category = categories.find((c) => c.id === cat.categoryId);
          if (category) {
            if (skillRewards[category.primarySkill]) {
              skillRewards[category.primarySkill] += cat.points;
            } else {
              skillRewards[category.primarySkill] = cat.points;
            }
          }
        }
      });

      const result = await createTask({
        ...newTask,
        skillRewards,
        coinReward,
      });

      if (result.success) {
        const task = result.data;
        if (task) {
          setTasks((prev) => [task as PrismaTask, ...prev]);
        }
        setNewTask({
          title: '',
          description: '',
          categories: [{ categoryId: '', points: 50 }],
          difficulty: 'medium',
          skillRewards: {},
          estimatedDuration: 0,
          recurring: true,
          recurringType: 'daily',
        });
        setShowAddTaskModal(false);
        setSuccess('Tarea creada exitosamente');
        router.refresh();
      } else {
        setError(result.error || 'Error al crear la tarea');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Error inesperado al crear la tarea');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTask = async (taskId: string) => {
    try {
      setError(null);
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      if (task.completed) {
        const result = await updateTask(taskId, { completed: false });
        if (result.success) {
          setTasks((prev) =>
            prev.map((task) => (task.id === taskId ? { ...task, completed: false } : task))
          );
          setSuccess('Tarea marcada como pendiente');
        } else {
          setError(result.error || 'Error al desmarcar la tarea');
        }
      } else {
        const result = await completeTask(taskId);
        if (result.success) {
          setTasks((prev) =>
            prev.map((task) => (task.id === taskId ? { ...task, completed: true } : task))
          );
          setSuccess('¡Tarea completada! +25 monedas');
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
            href='/'
            className='inline-flex items-center text-blue-600 hover:text-blue-700 mb-4'
          >
            ← Volver al inicio
          </Link>
          <h1 className='text-3xl font-bold text-gray-800'>Mis Tareas</h1>
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
            <div className='flex gap-6'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-blue-600'>{stats.total}</div>
                <div className='text-sm text-gray-600'>Total</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-green-600'>{stats.completed}</div>
                <div className='text-sm text-gray-600'>Completadas</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-orange-600'>{stats.pending}</div>
                <div className='text-sm text-gray-600'>Pendientes</div>
              </div>
            </div>
            <button
              onClick={() => setShowAddTaskModal(true)}
              className='bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium'
            >
              ➕ Nueva Tarea
            </button>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className='bg-white rounded-2xl shadow-lg p-6 mb-6'>
          <div className='flex flex-col lg:flex-row gap-4'>
            <div className='flex-1'>
              <input
                type='text'
                placeholder='Buscar tareas...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
            <div className='flex gap-2'>
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'pending'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pendientes
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'completed'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completadas
              </button>
            </div>
          </div>
        </div>

        {/* Lista de tareas */}
        <div className='bg-white rounded-2xl shadow-lg p-6'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            {filter === 'all'
              ? 'Todas las Tareas'
              : filter === 'pending'
              ? 'Tareas Pendientes'
              : 'Tareas Completadas'}
            <span className='text-gray-500 text-lg ml-2'>({filteredTasks.length})</span>
          </h2>

          <div className='space-y-3'>
            {filteredTasks.map((task) => (
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
                      <h4
                        className={`font-medium ${
                          task.completed ? 'line-through text-gray-600' : 'text-gray-800'
                        }`}
                      >
                        {task.title}
                      </h4>
                      <p
                        className={`text-sm ${task.completed ? 'text-gray-500' : 'text-gray-600'}`}
                      >
                        {task.description}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 mt-2'>
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
                    <span className='text-xs text-gray-500'>📅 {task.recurringType}</span>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-sm font-medium text-blue-600'>+{task.coinReward} 🪙</div>
                  <div className='text-xs text-gray-500'>
                    +{task.skillRewards[task.category.primarySkill]} XP
                  </div>
                  <button
                    onClick={() => removeTask(task.id)}
                    className='mt-2 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors'
                    title='Eliminar tarea'
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
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
        </div>
      </div>

      {/* Modal para agregar tarea */}
      {showAddTaskModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-gray-800'>Agregar Nueva Tarea</h2>
                <button
                  onClick={() => setShowAddTaskModal(false)}
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
                    placeholder='Ej: Hacer ejercicio 30 minutos'
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
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
                    placeholder='Descripción opcional de la tarea'
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>

                {/* Categorías y Puntos */}
                <div className='space-y-3'>
                  {newTask.categories.map((cat, index) => (
                    <div key={index} className='grid grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Categoría {index + 1} *
                        </label>
                        <select
                          value={cat.categoryId}
                          onChange={(e) => {
                            const categoryId = e.target.value;
                            setNewTask((prev) => ({
                              ...prev,
                              categories: prev.categories.map((c, i) =>
                                i === index ? { ...c, categoryId } : c
                              ),
                            }));
                          }}
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        >
                          <option value=''>Seleccionar categoría</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.icon} {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className='flex gap-2'>
                        <div className='flex-1'>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Puntos
                          </label>
                          <input
                            type='number'
                            min='0'
                            placeholder='50'
                            value={cat.points}
                            onChange={(e) => {
                              setNewTask((prev) => ({
                                ...prev,
                                categories: prev.categories.map((c, i) =>
                                  i === index ? { ...c, points: parseInt(e.target.value) || 0 } : c
                                ),
                              }));
                            }}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                          />
                        </div>

                        {newTask.categories.length > 1 && (
                          <button
                            onClick={() => {
                              setNewTask((prev) => ({
                                ...prev,
                                categories: prev.categories.filter((_, i) => i !== index),
                              }));
                            }}
                            className='mt-6 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors'
                            title='Remover categoría'
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className='text-center'>
                  <button
                    onClick={() => {
                      setNewTask((prev) => ({
                        ...prev,
                        categories: [...prev.categories, { categoryId: '', points: 50 }],
                      }));
                    }}
                    className='text-blue-600 hover:text-blue-700 text-sm font-medium'
                  >
                    + agregar categoría
                  </button>
                </div>

                {/* Dificultad */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Dificultad</label>
                  <select
                    value={newTask.difficulty}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
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
                      value={newTask.recurringType}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          recurringType: e.target.value as 'daily' | 'weekly' | 'monthly',
                        })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    >
                      <option value='daily'>📅 Diaria</option>
                      <option value='weekly'>📆 Semanal</option>
                      <option value='monthly'>🗓️ Mensual</option>
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Duración</label>
                    <input
                      type='number'
                      min='0'
                      placeholder='30'
                      value={newTask.estimatedDuration}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
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
                    onClick={() => setShowAddTaskModal(false)}
                    className='flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={addTask}
                    disabled={
                      !newTask.title.trim() ||
                      !newTask.categories.some((cat) => cat.categoryId) ||
                      isSubmitting
                    }
                    className='flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {isSubmitting ? 'Creando...' : 'Crear Tarea'}
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
