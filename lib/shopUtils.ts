// Utilidades para el sistema de tienda mejorado

export interface ShopDiscount {
  id: string;
  type: 'percentage' | 'fixed' | 'bogo'; // Buy One Get One
  value: number;
  description: string;
  validUntil?: Date;
  minPurchase?: number;
  applicableCategories?: string[];
  applicableRarities?: string[];
}

export interface ShopOffer {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'flash_sale' | 'daily_deal' | 'bundle' | 'loyalty';
  discount: ShopDiscount;
  featuredItems?: string[]; // IDs de items destacados
  validUntil: Date;
  isActive: boolean;
}

// Ofertas predefinidas
export const shopOffers: ShopOffer[] = [
  {
    id: 'monday_motivation',
    title: '🌟 Motivación de Lunes',
    description: '20% de descuento en boosters para empezar la semana',
    icon: '💪',
    type: 'daily_deal',
    discount: {
      id: 'monday_boost',
      type: 'percentage',
      value: 20,
      description: '20% de descuento',
      applicableCategories: ['booster']
    },
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
    isActive: true
  },
  {
    id: 'weekend_warrior',
    title: '🎮 Guerrero de Fin de Semana',
    description: 'Compra 2 recompensas externas y llévate 1 gratis',
    icon: '🎁',
    type: 'flash_sale',
    discount: {
      id: 'weekend_bogo',
      type: 'bogo',
      value: 1,
      description: 'Compra 2, llévate 3',
      applicableCategories: ['external']
    },
    validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 horas
    isActive: true
  },
  {
    id: 'loyalty_bundle',
    title: '👑 Pack de Lealtad',
    description: 'Bundle especial: 3 items cosméticos por el precio de 2',
    icon: '📦',
    type: 'bundle',
    discount: {
      id: 'cosmetic_bundle',
      type: 'percentage',
      value: 33,
      description: '33% de descuento en pack',
      applicableCategories: ['cosmetic'],
      minPurchase: 2
    },
    featuredItems: ['cosmetic_1', 'cosmetic_2', 'cosmetic_3'],
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
    isActive: true
  }
];

// Función para calcular descuentos
export function calculateDiscount(
  originalPrice: number,
  discount: ShopDiscount,
  quantity: number = 1
): { finalPrice: number; savedAmount: number; description: string } {
  let finalPrice = originalPrice;
  let savedAmount = 0;

  switch (discount.type) {
    case 'percentage':
      savedAmount = (originalPrice * discount.value) / 100;
      finalPrice = originalPrice - savedAmount;
      break;
    
    case 'fixed':
      savedAmount = Math.min(discount.value, originalPrice);
      finalPrice = Math.max(0, originalPrice - discount.value);
      break;
    
    case 'bogo':
      // Buy One Get One - cada X items, obtén Y gratis
      const freeItems = Math.floor(quantity / (discount.value + 1));
      savedAmount = freeItems * originalPrice;
      finalPrice = (quantity - freeItems) * originalPrice;
      break;
  }

  return {
    finalPrice: Math.round(finalPrice),
    savedAmount: Math.round(savedAmount),
    description: discount.description
  };
}

// Función para verificar si un descuento aplica a un item
export function discountApplies(
  discount: ShopDiscount,
  itemCategory: string,
  itemRarity?: string,
  purchaseAmount?: number
): boolean {
  // Verificar categorías aplicables
  if (discount.applicableCategories && 
      !discount.applicableCategories.includes(itemCategory)) {
    return false;
  }

  // Verificar rareza aplicable
  if (discount.applicableRarities && itemRarity &&
      !discount.applicableRarities.includes(itemRarity)) {
    return false;
  }

  // Verificar compra mínima
  if (discount.minPurchase && purchaseAmount && 
      purchaseAmount < discount.minPurchase) {
    return false;
  }

  return true;
}

// Función para obtener ofertas activas
export function getActiveOffers(): ShopOffer[] {
  const now = new Date();
  return shopOffers.filter(offer => 
    offer.isActive && 
    offer.validUntil > now
  );
}

// Función para obtener la mejor oferta para un item
export function getBestOfferForItem(
  itemCategory: string,
  itemRarity?: string,
  purchaseAmount?: number
): ShopOffer | null {
  const activeOffers = getActiveOffers();
  
  const applicableOffers = activeOffers.filter(offer =>
    discountApplies(offer.discount, itemCategory, itemRarity, purchaseAmount)
  );

  if (applicableOffers.length === 0) return null;

  // Retornar la oferta con mayor descuento
  return applicableOffers.reduce((best, current) => {
    if (current.discount.type === 'percentage' && best.discount.type === 'percentage') {
      return current.discount.value > best.discount.value ? current : best;
    }
    return current; // Simplificado, en producción sería más complejo
  });
}

// Sistema de puntos de lealtad
export interface LoyaltyPoints {
  current: number;
  lifetime: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export function calculateLoyaltyTier(lifetimePoints: number): LoyaltyPoints['tier'] {
  if (lifetimePoints >= 5000) return 'platinum';
  if (lifetimePoints >= 2000) return 'gold';
  if (lifetimePoints >= 500) return 'silver';
  return 'bronze';
}

export function getLoyaltyDiscount(tier: LoyaltyPoints['tier']): number {
  const discounts = {
    bronze: 0,
    silver: 5,
    gold: 10,
    platinum: 15
  };
  return discounts[tier];
}

// Función para generar recomendaciones de compra
export function generateShopRecommendations(
  userLevel: number,
  userCoins: number,
  completedTasks: number,
  currentStreak: number
): string[] {
  const recommendations = [];

  // Recomendaciones basadas en el nivel
  if (userLevel < 5) {
    recommendations.push('booster'); // Para acelerar progreso
  } else if (userLevel >= 10) {
    recommendations.push('cosmetic'); // Para personalización
  }

  // Recomendaciones basadas en monedas
  if (userCoins > 1000) {
    recommendations.push('legendary');
  } else if (userCoins > 300) {
    recommendations.push('epic');
  }

  // Recomendaciones basadas en actividad
  if (completedTasks > 50) {
    recommendations.push('external'); // Recompensas del mundo real
  }

  if (currentStreak > 7) {
    recommendations.push('protection'); // Proteger la racha
  }

  return recommendations;
}
