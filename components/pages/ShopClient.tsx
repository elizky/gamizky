'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { purchaseItem } from '@/actions';
import type { PrismaUser } from '@/types/prisma';
import { 
  getActiveOffers, 
  getBestOfferForItem, 
  calculateDiscount,
  generateShopRecommendations,
  calculateLoyaltyTier,
  getLoyaltyDiscount 
} from '@/lib/shopUtils';

interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  type: string;
  category: string;
  icon: string;
  available: boolean;
  rarity?: string | null;
}

interface Character {
  id: string;
  name: string;
  avatar: string;
  unlocked: boolean;
  cost?: number | null;
}

interface ShopClientProps {
  user: PrismaUser;
  rewards: Reward[];
  characters: Character[];
}

export default function ShopClient({ user, rewards, characters }: ShopClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'rewards' | 'characters' | 'offers'>('offers');
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Calcular datos del usuario para recomendaciones
  const completedTasksCount = 25; // En producción, esto vendría de props o API
  const loyaltyTier = calculateLoyaltyTier(user.coins * 2); // Simplificado
  const loyaltyDiscount = getLoyaltyDiscount(loyaltyTier);

  // Obtener ofertas activas y recomendaciones
  const activeOffers = useMemo(() => getActiveOffers(), []);
  const recommendations = useMemo(() => 
    generateShopRecommendations(user.level, user.coins, completedTasksCount, user.streak),
    [user.level, user.coins, user.streak]
  );

  const handlePurchase = async (itemId: string, type: 'reward' | 'character') => {
    try {
      setIsSubmitting(itemId);
      setError(null);
      setSuccessMessage(null);

      const result = await purchaseItem(itemId, type);
      
      if (result.success) {
        setSuccessMessage(result.message || '¡Compra exitosa!');
        router.refresh();
      } else {
        setError(result.error || 'Error al realizar la compra');
      }
    } catch (error) {
      console.error('Error purchasing item:', error);
      setError('Error inesperado al realizar la compra');
    } finally {
      setIsSubmitting(null);
    }
  };

  const getRarityColor = (rarity?: string | null) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getRarityLabel = (rarity?: string | null) => {
    switch (rarity) {
      case 'common': return { label: 'Común', color: 'text-gray-600' };
      case 'rare': return { label: 'Raro', color: 'text-blue-600' };
      case 'epic': return { label: 'Épico', color: 'text-purple-600' };
      case 'legendary': return { label: 'Legendario', color: 'text-yellow-600' };
      default: return { label: 'Común', color: 'text-gray-600' };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'internal': return '🎁';
      case 'external': return '🛍️';
      case 'cosmetic': return '👑';
      case 'character': return '👤';
      default: return '🎁';
    }
  };

  const canAfford = (cost: number) => user.coins >= cost;

  // Filtrar elementos ya comprados/desbloqueados
  const userRewardIds = user.rewards?.map(ur => ur.rewardId) || [];
  const userCharacterIds = user.characters?.map(uc => uc.characterId) || [];

  const availableRewards = rewards.filter(r => !userRewardIds.includes(r.id));
  const availableCharacters = characters.filter(c => !userCharacterIds.includes(c.id) && !c.unlocked);

  // Agrupar recompensas por categoría
  const rewardsByCategory = availableRewards.reduce((acc, reward) => {
    if (!acc[reward.category]) {
      acc[reward.category] = [];
    }
    acc[reward.category].push(reward);
    return acc;
  }, {} as Record<string, Reward[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🛍️ Tienda de Recompensas</h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              ¡Intercambia tus monedas por increíbles recompensas!
            </p>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-2xl">🪙</span>
              <span className="font-bold text-yellow-600">{user.coins.toLocaleString()}</span>
              <span className="text-gray-500">monedas</span>
            </div>
          </div>
        </div>

        {/* Mensajes */}
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

        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-green-800">{successMessage}</p>
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-green-600 hover:text-green-800 text-xl"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex mb-6 bg-white rounded-lg p-1 shadow">
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex-1 py-3 px-6 rounded-md font-medium transition-colors ${
              activeTab === 'offers'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            ⚡ Ofertas ({activeOffers.length})
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 py-3 px-6 rounded-md font-medium transition-colors ${
              activeTab === 'rewards'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            🎁 Recompensas ({availableRewards.length})
          </button>
          <button
            onClick={() => setActiveTab('characters')}
            className={`flex-1 py-3 px-6 rounded-md font-medium transition-colors ${
              activeTab === 'characters'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            👤 Personajes ({availableCharacters.length})
          </button>
        </div>

        {/* Contenido de las tabs */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            {/* Banner de lealtad */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">👑 Tier {loyaltyTier.charAt(0).toUpperCase() + loyaltyTier.slice(1)}</h2>
                  <p className="text-purple-100">
                    Descuento de lealtad: {loyaltyDiscount}% en todas las compras
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{user.coins.toLocaleString()}</div>
                  <div className="text-purple-200 text-sm">Monedas disponibles</div>
                </div>
              </div>
            </div>

            {/* Ofertas activas */}
            {activeOffers.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">⚡ Ofertas Especiales</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeOffers.map((offer) => (
                    <div key={offer.id} className="border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{offer.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-800">{offer.title}</h3>
                          <p className="text-sm text-gray-600">{offer.description}</p>
                        </div>
                      </div>
                      
                      <div className="bg-orange-100 rounded-lg p-3 mb-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-700">
                            {offer.discount.description}
                          </div>
                          <div className="text-xs text-orange-600">
                            Válido hasta: {offer.validUntil.toLocaleDateString('es-ES')}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          offer.type === 'flash_sale' ? 'bg-red-100 text-red-700' :
                          offer.type === 'daily_deal' ? 'bg-blue-100 text-blue-700' :
                          offer.type === 'bundle' ? 'bg-purple-100 text-purple-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {offer.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                          Ver productos →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recomendaciones personalizadas */}
            {recommendations.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">🎯 Recomendado para ti</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recommendations.map((category, index) => {
                    const categoryRewards = availableRewards.filter(r => r.category === category).slice(0, 2);
                    return (
                      <div key={index} className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                        <h3 className="font-medium text-blue-800 mb-3 capitalize">{category}</h3>
                        <div className="space-y-2">
                          {categoryRewards.map((reward) => (
                            <div key={reward.id} className="text-center">
                              <div className="text-2xl mb-1">{reward.icon}</div>
                              <div className="text-xs text-blue-700">{reward.title}</div>
                              <div className="text-xs font-medium text-blue-800">{reward.cost} 🪙</div>
                            </div>
                          ))}
                        </div>
                        <button 
                          onClick={() => setActiveTab('rewards')}
                          className="w-full mt-3 bg-blue-600 text-white py-1 px-2 rounded text-xs hover:bg-blue-700 transition-colors"
                        >
                          Ver más
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stats de compras */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">📊 Tus Estadísticas de Compra</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{user.rewards?.length || 0}</div>
                  <div className="text-sm text-green-700">Compras realizadas</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{(user.coins * 0.1).toFixed(0)}</div>
                  <div className="text-sm text-purple-700">Monedas gastadas</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{loyaltyDiscount}%</div>
                  <div className="text-sm text-yellow-700">Descuento actual</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{availableRewards.length}</div>
                  <div className="text-sm text-blue-700">Items disponibles</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-8">
            {Object.keys(rewardsByCategory).length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <span className="text-6xl">🎉</span>
                <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
                  ¡Has comprado todas las recompensas!
                </h3>
                <p className="text-gray-600">
                  Sigue completando tareas para ganar más monedas y espera nuevas recompensas.
                </p>
              </div>
            ) : (
              Object.entries(rewardsByCategory).map(([category, categoryRewards]) => (
                <div key={category} className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 capitalize">
                    {getTypeIcon(category)} {category}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryRewards.map((reward) => {
                      const rarity = getRarityLabel(reward.rarity);
                      const affordable = canAfford(reward.cost);
                      
                      return (
                        <div
                          key={reward.id}
                          className={`p-4 rounded-lg border-2 ${getRarityColor(reward.rarity)} ${
                            !affordable ? 'opacity-60' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{reward.icon}</span>
                              <div>
                                <h3 className="font-semibold text-gray-800">{reward.title}</h3>
                                <p className="text-sm text-gray-600">{reward.description}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-3">
                            <span className={`text-xs font-medium ${rarity.color}`}>
                              {rarity.label}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-lg">🪙</span>
                              <span className="font-bold text-gray-800">{reward.cost.toLocaleString()}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handlePurchase(reward.id, 'reward')}
                            disabled={!affordable || isSubmitting === reward.id}
                            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                              affordable
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {isSubmitting === reward.id ? (
                              'Comprando...'
                            ) : affordable ? (
                              '🛒 Comprar'
                            ) : (
                              '💰 Monedas insuficientes'
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'characters' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              👤 Personajes Disponibles
            </h2>
            {availableCharacters.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl">🎭</span>
                <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
                  ¡Has desbloqueado todos los personajes!
                </h3>
                <p className="text-gray-600">
                  Tienes acceso a todos los personajes disponibles en el juego.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {availableCharacters.map((character) => {
                  const affordable = canAfford(character.cost || 0);
                  
                  return (
                    <div
                      key={character.id}
                      className={`p-4 rounded-lg border-2 border-purple-300 bg-purple-50 ${
                        !affordable ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="text-center mb-4">
                        <div className="text-6xl mb-2">{character.avatar}</div>
                        <h3 className="font-semibold text-gray-800">{character.name}</h3>
                      </div>

                      <div className="flex items-center justify-center mb-4">
                        <div className="flex items-center gap-1">
                          <span className="text-lg">🪙</span>
                          <span className="font-bold text-gray-800">
                            {(character.cost || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePurchase(character.id, 'character')}
                        disabled={!affordable || isSubmitting === character.id}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          affordable
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isSubmitting === character.id ? (
                          'Desbloqueando...'
                        ) : affordable ? (
                          '🔓 Desbloquear'
                        ) : (
                          '💰 Insuficientes'
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-800 mb-3">💡 ¿Cómo ganar más monedas?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• ✅ Completa tareas diarias</li>
              <li>• 🏆 Acepta y completa challenges</li>
              <li>• 🔥 Mantén rachas consecutivas</li>
              <li>• 📈 Aumenta la dificultad de tus tareas</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-800 mb-3">🎁 Tipos de Recompensas</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>🎁</span>
                <span><strong>Internas:</strong> Beneficios dentro del juego</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🛍️</span>
                <span><strong>Externas:</strong> Recompensas del mundo real</span>
              </div>
              <div className="flex items-center gap-2">
                <span>👑</span>
                <span><strong>Cosméticas:</strong> Mejoras visuales</span>
              </div>
              <div className="flex items-center gap-2">
                <span>👤</span>
                <span><strong>Personajes:</strong> Avatares únicos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
