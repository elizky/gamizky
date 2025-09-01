'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { formatXP, formatCoins } from '@/lib/gamification';
import type { Task, TaskCategory } from '@/lib/types';

interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  totalXP: number;
  coins: number;
  streak: number;
  avatar: string;
  character: {
    id: string;
    name: string;
    avatar: string;
    unlocked: boolean;
    cost?: number;
  } | null;
  skills: {
    physical: { level: number; currentXP: number; totalXP: number; xpToNextLevel: number };
    wisdom: { level: number; currentXP: number; totalXP: number; xpToNextLevel: number };
    mental: { level: number; currentXP: number; totalXP: number; xpToNextLevel: number };
    social: { level: number; currentXP: number; totalXP: number; xpToNextLevel: number };
    creativity: { level: number; currentXP: number; totalXP: number; xpToNextLevel: number };
    discipline: { level: number; currentXP: number; totalXP: number; xpToNextLevel: number };
  };
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTasksModal, setShowEditTasksModal] = useState(false);
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

  // Redirigir si no está autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Cargar datos solo una vez cuando se autentica
  useEffect(() => {
    if (status === 'authenticated' && session?.user && !user) {
      loadData();
    }
  }, [status, session, user]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Cargar categorías
      const categoriesRes = await fetch('/api/task-categories');
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData);

      // Cargar perfil del usuario
      const profileRes = await fetch('/api/user/profile');
      const profileData = await profileRes.json();
      setUser(profileData);

      // Cargar tareas
      const tasksRes = await fetch('/api/tasks');
      const tasksData = await tasksRes.json();
      setTasks(tasksData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(async () => {
    if (!newTask.title.trim() || !newTask.categories.some((cat) => cat.categoryId)) return;

    try {
      const skillRewards: Record<string, number> = {};
      const coinReward = 25; // Moneda base por tarea

      // Construir skillRewards basado en todas las categorías seleccionadas
      newTask.categories.forEach((cat) => {
        if (cat.categoryId) {
          const category = categories.find((c) => c.id === cat.categoryId);
          if (category) {
            // Si ya existe la habilidad, sumar los puntos
            if (skillRewards[category.primarySkill]) {
              skillRewards[category.primarySkill] += cat.points;
            } else {
              skillRewards[category.primarySkill] = cat.points;
            }
          }
        }
      });

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTask,
          skillRewards,
          coinReward,
        }),
      });

      if (response.ok) {
        const task = await response.json();
        setTasks((prev) => [task, ...prev]);
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

        // Actualizar solo las estadísticas del usuario sin recargar todo
        if (user) {
          setUser((prev) =>
            prev
              ? {
                  ...prev,
                  totalXP: prev.totalXP + 50, // XP base por nueva tarea
                  coins: prev.coins + coinReward, // Monedas por nueva tarea
                }
              : null
          );
        }
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }, [newTask, categories, user]);

  const toggleTask = useCallback(
    async (taskId: string) => {
      try {
        // Determinar si la tarea está completada o no
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;

        if (task.completed) {
          // Descompletar tarea usando PATCH
          const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: false }),
          });

          if (response.ok) {
            const updatedTask = await response.json();
            setTasks((prev) => prev.map((task) => (task.id === taskId ? updatedTask : task)));
          }
        } else {
          // Completar tarea usando POST
          const response = await fetch(`/api/tasks/${taskId}/complete`, {
            method: 'POST',
          });

          if (response.ok) {
            const updatedTask = await response.json();
            setTasks((prev) => prev.map((task) => (task.id === taskId ? updatedTask : task)));
          }
        }

        // Recargar el perfil del usuario para obtener estadísticas actualizadas
        try {
          const profileRes = await fetch('/api/user/profile');
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            setUser(profileData);
          }
        } catch (error) {
          console.error('Error updating user profile:', error);
        }
      } catch (error) {
        console.error('Error toggling task:', error);
      }
    },
    [tasks]
  );

  // Memoizar las funciones computadas para evitar recálculos
  const completedTasks = useMemo(() => tasks.filter((task) => task.completed), [tasks]);
  const pendingTasks = useMemo(() => tasks.filter((task) => !task.completed), [tasks]);

  if (status === 'loading' || loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600'>Cargando GAMIZKY...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
      <div className='max-w-6xl mx-auto'>
        {/* Header con stats del usuario */}
        <div className='bg-white rounded-2xl shadow-lg p-6 mb-6'>
          <div className='flex items-center justify-between'>
            <div className='flex-1'>
              <h1 className='text-3xl font-bold text-gray-800'>¡Hola, {user.name}! 👋</h1>
              <p className='text-gray-600'>
                Nivel {user.level} • {formatXP(user.totalXP)} • {formatCoins(user.coins)}
              </p>
            </div>
            <div className='flex items-center gap-4'>
              <div className='text-right'>
                <div className='text-2xl'>{user.avatar}</div>
                <p className='text-sm text-gray-500'>{user.character?.name || 'Sin personaje'}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className='px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors'
              >
                Cerrar sesión
              </button>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className='mt-4'>
            <div className='flex justify-between text-sm text-gray-600 mb-1'>
              <span>Nivel {user.level}</span>
              <span>Nivel {user.level + 1}</span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2'>
              <div
                className='bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300'
                style={{ width: `${(user.totalXP % 200) / 2}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Panel de tareas pendientes */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-2xl shadow-lg p-6'>
              <h2 className='text-xl font-semibold text-gray-800 mb-4'>Tareas de Hoy</h2>

              {/* Botón para abrir modal */}
              <div className='mb-4'>
                <button
                  onClick={() => setShowAddTaskModal(true)}
                  className='w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2'
                >
                  <span>➕</span>
                  Agregar Nueva Tarea
                </button>
              </div>

              {/* Lista de tareas */}
              <div className='space-y-3'>
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
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
                  <p className='text-gray-500 text-center py-8'>
                    No hay tareas pendientes. ¡Agrega una nueva tarea!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Panel lateral con stats y tareas completadas */}
          <div className='space-y-6'>
            {/* Stats rápidas */}
            <div className='bg-white rounded-2xl shadow-lg p-6'>
              <h3 className='font-semibold text-gray-800 mb-4'>Estadísticas</h3>
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Tareas Completadas</span>
                  <span className='font-medium'>{completedTasks.length}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Tareas Pendientes</span>
                  <span className='font-medium'>{pendingTasks.length}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Racha Actual</span>
                  <span className='font-medium'>{user.streak} días 🔥</span>
                </div>
              </div>
            </div>

            {/* Tareas completadas recientes */}
            <div className='bg-white rounded-2xl shadow-lg p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='font-semibold text-gray-800'>Completadas Hoy</h3>
                {completedTasks.length > 0 && (
                  <button
                    onClick={() => setShowEditTasksModal(true)}
                    className='text-blue-600 hover:text-blue-700 text-sm font-medium'
                  >
                    ✏️ Editar
                  </button>
                )}
              </div>
              <div className='space-y-2'>
                {completedTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className='flex items-center p-2 bg-green-50 rounded-lg'>
                    <span className='text-green-500 mr-2'>✅</span>
                    <span className='text-sm text-gray-700'>{task.title}</span>
                  </div>
                ))}
                {completedTasks.length === 0 && (
                  <p className='text-gray-500 text-sm text-center py-4'>
                    No hay tareas completadas hoy
                  </p>
                )}
              </div>
            </div>
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

                        {/* Botón para remover categoría (solo si hay más de una) */}
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

                {/* Botón para agregar más categorías */}
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
                    onClick={() => {
                      addTask();
                      setShowAddTaskModal(false);
                    }}
                    disabled={
                      !newTask.title.trim() || !newTask.categories.some((cat) => cat.categoryId)
                    }
                    className='flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    Crear Tarea
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar tareas completadas */}
      {showEditTasksModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-gray-900'>Editar Tareas Completadas</h2>
                <button
                  onClick={() => setShowEditTasksModal(false)}
                  className='text-gray-400 hover:text-gray-600 text-2xl'
                >
                  ✕
                </button>
              </div>

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
                      <button
                        onClick={() => toggleTask(task.id)}
                        className='px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors'
                        title='Desmarcar como completada'
                      >
                        🔄 Desmarcar
                      </button>
                      <button
                        onClick={() => {
                          // TODO: Implementar eliminación de tarea
                          console.log('Eliminar tarea:', task.id);
                        }}
                        className='px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors'
                        title='Eliminar tarea'
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className='flex justify-end pt-6 border-t mt-6'>
                <button
                  onClick={() => setShowEditTasksModal(false)}
                  className='px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
