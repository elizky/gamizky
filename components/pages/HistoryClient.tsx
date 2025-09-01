'use client';

import { useState } from 'react';
import { deleteTask } from '../../actions';
import type { PrismaTask } from '../../types/prisma';

interface HistoryClientProps {
  completedTasks: PrismaTask[];
}

export default function HistoryClient({ completedTasks: initialTasks }: HistoryClientProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'recent' | 'old'>('all');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Filtrar tareas por búsqueda y filtro
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'recent') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(task.updatedAt) > oneWeekAgo;
    } else if (filter === 'old') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(task.updatedAt) <= oneWeekAgo;
    }

    return true;
  });

  // Eliminar tarea del historial
  const removeFromHistory = async (taskId: string) => {
    try {
      const result = await deleteTask(taskId);
      if (result.success) {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
        setSuccess('Tarea eliminada del historial');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Error al eliminar la tarea');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
      setError('Error al eliminar la tarea');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Formatear fecha
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Obtener estadísticas
  const getStats = () => {
    const total = tasks.length;
    const thisWeek = tasks.filter((task) => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(task.updatedAt) > oneWeekAgo;
    }).length;
    const thisMonth = tasks.filter((task) => {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return new Date(task.updatedAt) > oneMonthAgo;
    }).length;

    return { total, thisWeek, thisMonth };
  };

  const stats = getStats();

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>📚 Historial de Tareas</h1>
        <p className='text-gray-600'>Revisa todas las tareas que has completado</p>
      </div>

      {/* Estadísticas */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-white rounded-xl p-6 text-center shadow-soft'>
          <div className='text-3xl font-bold text-blue-600'>{stats.total}</div>
          <div className='text-gray-600'>Total Completadas</div>
        </div>
        <div className='bg-white rounded-xl p-6 text-center shadow-soft'>
          <div className='text-3xl font-bold text-green-600'>{stats.thisWeek}</div>
          <div className='text-gray-600'>Esta Semana</div>
        </div>
        <div className='bg-white rounded-xl p-6 text-center shadow-soft'>
          <div className='text-3xl font-bold text-purple-600'>{stats.thisMonth}</div>
          <div className='text-gray-600'>Este Mes</div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className='bg-white rounded-xl p-6 shadow-soft'>
        <div className='flex flex-col md:flex-row gap-4'>
          {/* Búsqueda */}
          <div className='flex-1'>
            <input
              type='text'
              placeholder='Buscar en tareas completadas...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>

          {/* Filtros */}
          <div className='flex gap-2'>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('recent')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'recent'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Recientes
            </button>
            <button
              onClick={() => setFilter('old')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'old'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Antiguas
            </button>
          </div>
        </div>
      </div>

      {/* Mensajes de éxito/error */}
      {success && (
        <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg'>
          {success}
        </div>
      )}
      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg'>
          {error}
        </div>
      )}

      {/* Lista de tareas */}
      <div className='bg-white rounded-xl shadow-soft overflow-hidden'>
        <div className='p-6 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-800'>
            Tareas Completadas
            <span className='text-gray-500 text-lg ml-2'>({filteredTasks.length})</span>
          </h2>
        </div>

        {filteredTasks.length === 0 ? (
          <div className='p-12 text-center'>
            <div className='text-6xl mb-4'>📝</div>
            <p className='text-gray-500 text-lg'>
              {searchTerm
                ? 'No se encontraron tareas que coincidan con la búsqueda'
                : filter === 'recent'
                ? 'No hay tareas completadas recientemente'
                : filter === 'old'
                ? 'No hay tareas completadas antiguas'
                : 'No hay tareas completadas en tu historial'}
            </p>
          </div>
        ) : (
          <div className='divide-y divide-gray-200'>
            {filteredTasks.map((task) => (
              <div key={task.id} className='p-6 hover:bg-gray-50 transition-colors'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <h4 className='font-semibold text-gray-800 text-lg'>{task.title}</h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.difficulty === 'easy'
                            ? 'bg-green-100 text-green-800'
                            : task.difficulty === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {task.difficulty}
                      </span>
                      <span className='text-xs text-gray-500'>📅 {task.recurringType}</span>
                    </div>

                    {task.description && <p className='text-gray-600 mb-3'>{task.description}</p>}

                    <div className='flex items-center gap-4 text-sm text-gray-500'>
                      <span>🏷️ {task.category?.name}</span>
                      <span>🪙 +{task.coinReward}</span>
                      <span>⏱️ {task.estimatedDuration} min</span>
                      <span>✅ Completada: {formatDate(task.updatedAt)}</span>
                    </div>
                  </div>

                  <div className='flex gap-2 ml-4'>
                    <button
                      onClick={() => removeFromHistory(task.id)}
                      className='px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm'
                      title='Eliminar del historial'
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
