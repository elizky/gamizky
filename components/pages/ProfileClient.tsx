'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatXP, formatCoins } from '../../lib/gamification';
import { updateProfile } from '../../actions';
import type { PrismaUser } from '../../types/prisma';

interface ProfileClientProps {
  user: PrismaUser;
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    name: user.name || '',
    avatar: user.avatar || '👤',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      const result = await updateProfile(editData);

      if (result.success) {
        setSuccess('Perfil actualizado correctamente');
        setIsEditing(false);
        // Refrescar la página para obtener datos actualizados
        router.refresh();
      } else {
        setError(result.error || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error inesperado al actualizar el perfil');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: user.name || '',
      avatar: user.avatar || '👤',
    });
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='mb-6'>
          <Link
            href='/'
            className='inline-flex items-center text-blue-600 hover:text-blue-700 mb-4'
          >
            ← Volver al inicio
          </Link>
          <h1 className='text-3xl font-bold text-gray-800'>Mi Perfil</h1>
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

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Información del perfil */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-2xl shadow-lg p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold text-gray-800'>Información Personal</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className='px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors'
                  >
                    ✏️ Editar
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Avatar</label>
                    <input
                      type='text'
                      value={editData.avatar}
                      onChange={(e) => setEditData({ ...editData, avatar: e.target.value })}
                      placeholder='👤'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl text-center'
                    />
                    <p className='text-xs text-gray-500 mt-1'>
                      Puedes usar emojis o caracteres especiales
                    </p>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Nombre</label>
                    <input
                      type='text'
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      placeholder='Tu nombre'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      required
                    />
                  </div>

                  <div className='flex gap-3 pt-4'>
                    <button
                      type='button'
                      onClick={handleCancel}
                      className='flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                    >
                      Cancelar
                    </button>
                    <button
                      type='submit'
                      disabled={isSubmitting}
                      className='flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className='space-y-4'>
                  <div className='flex items-center gap-4'>
                    <div className='text-6xl'>{user.avatar}</div>
                    <div>
                      <h3 className='text-2xl font-semibold text-gray-800'>{user.name}</h3>
                      <p className='text-gray-600'>{user.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Estadísticas del usuario */}
          <div className='space-y-6'>
            {/* Stats principales */}
            <div className='bg-white rounded-2xl shadow-lg p-6'>
              <h3 className='font-semibold text-gray-800 mb-4'>Estadísticas</h3>
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Nivel</span>
                  <span className='font-medium'>{user.level}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>XP Total</span>
                  <span className='font-medium'>{formatXP(user.totalXP)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Monedas</span>
                  <span className='font-medium'>{formatCoins(user.coins)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Racha</span>
                  <span className='font-medium'>{user.streak} días 🔥</span>
                </div>
              </div>
            </div>

            {/* Barra de progreso */}
            <div className='bg-white rounded-2xl shadow-lg p-6'>
              <h3 className='font-semibold text-gray-800 mb-4'>Progreso</h3>
              <div className='space-y-3'>
                <div>
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
                  <p className='text-xs text-gray-500 mt-1'>
                    {user.totalXP % 200} / 200 XP para el siguiente nivel
                  </p>
                </div>
              </div>
            </div>

            {/* Personaje activo */}
            {user.character && (
              <div className='bg-white rounded-2xl shadow-lg p-6'>
                <h3 className='font-semibold text-gray-800 mb-4'>Personaje Activo</h3>
                <div className='text-center'>
                  <div className='text-4xl mb-2'>{user.character.avatar}</div>
                  <h4 className='font-medium text-gray-800'>{user.character.name}</h4>
                  <p className='text-sm text-gray-600'>
                    {user.character.unlocked ? 'Desbloqueado' : 'Bloqueado'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Habilidades */}
        <div className='mt-6'>
          <div className='bg-white rounded-2xl shadow-lg p-6'>
            <h2 className='text-xl font-semibold text-gray-800 mb-6'>Mis Habilidades</h2>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
              {Object.entries(user.skills).map(([skillName, skill]) => (
                <div key={skillName} className='bg-gray-50 rounded-lg p-4'>
                  <div className='text-center'>
                    <h4 className='font-medium text-gray-800 capitalize mb-2'>{skillName}</h4>
                    <div className='text-2xl font-bold text-blue-600 mb-2'>Nivel {skill.level}</div>
                    <div className='text-sm text-gray-600'>
                      {skill.currentXP} / {skill.xpToNextLevel} XP
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-2 mt-2'>
                      <div
                        className='bg-blue-500 h-2 rounded-full transition-all duration-300'
                        style={{ width: `${(skill.currentXP / skill.xpToNextLevel) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
