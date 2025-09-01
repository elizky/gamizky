import Link from 'next/link';
import { PrismaUser } from '@/types/prisma';
import { formatXP, formatCoins } from '@/lib/gamification';

const Header = ({ user }: { user: PrismaUser }) => {
  const currentLevelXP = user.totalXP % 200;
  const xpToNextLevel = 200 - currentLevelXP;
  const progressPercentage = (currentLevelXP / 200) * 100;

  return (
    <div className='bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6 mb-6 shadow-lg'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex-1'>
          <h1 className='text-3xl font-bold mb-1'>¡Hola, {user.name}!</h1>
          <p className='text-blue-100 text-lg'>
            Nivel {user.level} • Racha de {user.streak} días 🔥
          </p>
        </div>
        <div className='flex items-center gap-6'>
          {/* Stats rápidos */}
          <div className='text-center'>
            <div className='text-2xl font-bold'>{user.totalXP.toLocaleString()}</div>
            <div className='text-xs text-blue-200'>XP Total</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-yellow-300'>{user.coins.toLocaleString()}</div>
            <div className='text-xs text-blue-200'>Monedas</div>
          </div>
          <div className='text-center'>
            <div className='text-4xl'>{user.avatar}</div>
            <p className='text-xs text-blue-200'>{user.character?.name || 'Sin personaje'}</p>
          </div>
        </div>
      </div>

      {/* Barra de progreso mejorada */}
      <div className='mb-4'>
        <div className='flex justify-between text-sm text-blue-100 mb-2'>
          <span>Nivel {user.level}</span>
          <span className='font-medium'>{currentLevelXP} / 200 XP</span>
          <span>Nivel {user.level + 1}</span>
        </div>
        <div className='w-full bg-blue-500/30 rounded-full h-3 relative overflow-hidden'>
          <div
            className='bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-500 ease-out relative'
            style={{ width: `${progressPercentage}%` }}
          >
            <div className='absolute inset-0 bg-white/20 animate-pulse rounded-full'></div>
          </div>
        </div>
        <div className='text-center text-xs text-blue-200 mt-1'>
          {xpToNextLevel} XP para el siguiente nivel
        </div>
      </div>

      {/* Quick actions */}
      <div className='flex gap-3'>
        <Link 
          href='/tasks'
          className='flex-1 bg-white/20 hover:bg-white/30 transition-colors rounded-lg p-3 text-center text-sm font-medium'
        >
          📝 Tareas
        </Link>
        <Link 
          href='/challenges'
          className='flex-1 bg-white/20 hover:bg-white/30 transition-colors rounded-lg p-3 text-center text-sm font-medium'
        >
          🏆 Challenges
        </Link>
        <Link 
          href='/shop'
          className='flex-1 bg-white/20 hover:bg-white/30 transition-colors rounded-lg p-3 text-center text-sm font-medium'
        >
          🛍️ Tienda
        </Link>
        <Link 
          href='/stats'
          className='flex-1 bg-white/20 hover:bg-white/30 transition-colors rounded-lg p-3 text-center text-sm font-medium'
        >
          📊 Stats
        </Link>
      </div>
    </div>
  );
};

export default Header;
