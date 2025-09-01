'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { joinChallenge } from '@/actions';
import type { PrismaUser } from '@/types/prisma';

interface ChallengeWithProgress {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: string;
  difficulty: string;
  xpReward: number;
  coinReward: number;
  requirements: Record<string, unknown>;
  startDate?: Date | null;
  endDate?: Date | null;
  active: boolean;
  featured: boolean;
  rarity?: string | null;
  category?: string | null;
  userProgress?: {
    progress: number;
    target: number;
    completed: boolean;
    completedAt?: Date | null;
    progressData: Record<string, unknown>;
  } | null;
}

interface ChallengesClientProps {
  user: PrismaUser;
  challenges: ChallengeWithProgress[];
}

export default function ChallengesClient({ user, challenges }: ChallengesClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      setIsSubmitting(challengeId);
      setError(null);

      const result = await joinChallenge(challengeId);
      
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || 'Error al unirse al challenge');
      }
    } catch (error) {
      console.error('Error joining challenge:', error);
      setError('Error inesperado al unirse al challenge');
    } finally {
      setIsSubmitting(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'hard': return 'bg-red-500 text-white';
      case 'epic': return 'bg-purple-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getRarityColor = (rarity?: string | null) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-blue-400';
      case 'epic': return 'border-purple-400';
      case 'legendary': return 'border-yellow-400';
      default: return 'border-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'daily': return '📅';
      case 'weekly': return '📆';
      case 'skill': return '🎯';
      case 'diversity': return '🌈';
      case 'temporal': return '⏰';
      default: return '🏆';
    }
  };

  const getProgressPercentage = (progress: number, target: number) => {
    return Math.min(100, (progress / target) * 100);
  };

  const activeUserChallenges = challenges.filter(c => c.userProgress && !c.userProgress.completed);
  const completedUserChallenges = challenges.filter(c => c.userProgress?.completed);
  const availableChallenges = challenges.filter(c => !c.userProgress);
  const featuredChallenges = availableChallenges.filter(c => c.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🏆 Challenges</h1>
          <p className="text-gray-600">
            ¡Acepta desafíos épicos y gana recompensas increíbles!
          </p>
        </div>

        {/* Mostrar errores */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-red-800">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 text-xl"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Challenges Activos */}
          <div className="lg:col-span-2 space-y-6">
            {/* Challenges en Progreso */}
            {activeUserChallenges.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  🎮 En Progreso ({activeUserChallenges.length})
                </h2>
                <div className="space-y-4">
                  {activeUserChallenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className={`p-4 rounded-lg border-2 ${getRarityColor(challenge.rarity)} bg-gradient-to-r from-white to-gray-50`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{challenge.icon}</span>
                          <div>
                            <h3 className="font-semibold text-gray-800">{challenge.title}</h3>
                            <p className="text-sm text-gray-600">{challenge.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{getTypeIcon(challenge.type)}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </span>
                        </div>
                      </div>

                      {/* Barra de progreso */}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progreso: {challenge.userProgress?.progress}/{challenge.userProgress?.target}</span>
                          <span>{Math.round(getProgressPercentage(challenge.userProgress?.progress || 0, challenge.userProgress?.target || 1))}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${getProgressPercentage(challenge.userProgress?.progress || 0, challenge.userProgress?.target || 1)}%` 
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Recompensas */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-blue-600 font-medium">+{challenge.xpReward} XP</span>
                          <span className="text-sm text-yellow-600 font-medium">+{challenge.coinReward} 🪙</span>
                        </div>
                        {challenge.userProgress?.progress === challenge.userProgress?.target && (
                          <span className="text-green-600 font-medium text-sm">✅ ¡Completado!</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Challenges Destacados */}
            {featuredChallenges.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  ⭐ Destacados
                </h2>
                <div className="grid gap-4">
                  {featuredChallenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className={`p-4 rounded-lg border-2 ${getRarityColor(challenge.rarity)} bg-gradient-to-r from-white to-yellow-50`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{challenge.icon}</span>
                          <div>
                            <h3 className="font-semibold text-gray-800">{challenge.title}</h3>
                            <p className="text-sm text-gray-600">{challenge.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{getTypeIcon(challenge.type)}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-blue-600 font-medium">+{challenge.xpReward} XP</span>
                          <span className="text-sm text-yellow-600 font-medium">+{challenge.coinReward} 🪙</span>
                        </div>
                        <button
                          onClick={() => handleJoinChallenge(challenge.id)}
                          disabled={isSubmitting === challenge.id}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting === challenge.id ? 'Uniéndose...' : '🚀 Aceptar'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Todos los Challenges Disponibles */}
            {availableChallenges.filter(c => !c.featured).length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  🎯 Challenges Disponibles
                </h2>
                <div className="grid gap-4">
                  {availableChallenges.filter(c => !c.featured).map((challenge) => (
                    <div
                      key={challenge.id}
                      className={`p-4 rounded-lg border ${getRarityColor(challenge.rarity)} bg-gray-50`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{challenge.icon}</span>
                          <div>
                            <h3 className="font-medium text-gray-800">{challenge.title}</h3>
                            <p className="text-sm text-gray-600">{challenge.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{getTypeIcon(challenge.type)}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-blue-600 font-medium">+{challenge.xpReward} XP</span>
                          <span className="text-sm text-yellow-600 font-medium">+{challenge.coinReward} 🪙</span>
                        </div>
                        <button
                          onClick={() => handleJoinChallenge(challenge.id)}
                          disabled={isSubmitting === challenge.id}
                          className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting === challenge.id ? 'Uniéndose...' : 'Aceptar'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            {/* Stats del usuario */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4">📊 Tus Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nivel</span>
                  <span className="font-medium">{user.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Challenges Activos</span>
                  <span className="font-medium">{activeUserChallenges.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Challenges Completados</span>
                  <span className="font-medium">{completedUserChallenges.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monedas</span>
                  <span className="font-medium">{user.coins} 🪙</span>
                </div>
              </div>
            </div>

            {/* Challenges Completados */}
            {completedUserChallenges.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">✅ Completados</h3>
                <div className="space-y-2">
                  {completedUserChallenges.slice(0, 5).map((challenge) => (
                    <div key={challenge.id} className="flex items-center p-2 bg-green-50 rounded-lg">
                      <span className="text-green-500 mr-2">✅</span>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700">{challenge.title}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-blue-600">+{challenge.xpReward} XP</span>
                          <span className="text-xs text-yellow-600">+{challenge.coinReward} 🪙</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Próximamente */}
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">🔮 Próximamente</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>🏆 Torneos semanales</p>
                <p>👥 Challenges en equipo</p>
                <p>🎁 Recompensas especiales</p>
                <p>📈 Rankings globales</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
