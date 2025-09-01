import Link from 'next/link';
import { PrismaUserWithExtras } from '@/lib/types';
import { NeoCard, NeoCardContent } from '@/components/ui/card';

const Header = ({ user }: { user: PrismaUserWithExtras }) => {
  const currentLevelXP = user.totalXP % 200;
  const xpToNextLevel = 200 - currentLevelXP;
  const progressPercentage = (currentLevelXP / 200) * 100;

  return (
    <NeoCard className='p-4 mb-4'>
      <NeoCardContent className='p-0'>
        {/* Avatar Section - Centered */}
        <div className='flex justify-center mb-6'>
          <div className='relative'>
            <div className='w-24 h-24 bg-yellow-300 border-4 border-black rounded-none flex items-center justify-center text-4xl'>
              {user.avatar}
            </div>
            <div className='absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 border-2 border-black rounded-none flex items-center justify-center text-white text-sm font-black'>
              {user.level}
            </div>
          </div>
        </div>

        {/* Greeting - Bold Typography */}
        <div className='text-center mb-6'>
          <h1 className='text-2xl font-black text-black mb-1 uppercase tracking-wider'>
            ¡Hola, {user.name}!
          </h1>
          <p className='text-sm font-bold text-gray-600 uppercase tracking-wide'>
            Racha de {user.streak} días 🔥
          </p>
        </div>

        {/* Stats Grid - Asymmetric Layout */}
        <div className='grid grid-cols-3 gap-3 mb-6'>
          <div className='bg-blue-400 border-2 border-black p-3 text-center'>
            <div className='text-xl font-black text-white'>{user.totalXP.toLocaleString()}</div>
            <div className='text-xs font-bold text-black uppercase'>XP</div>
          </div>
          <div className='bg-yellow-400 border-2 border-black p-3 text-center'>
            <div className='text-xl font-black text-black'>{user.coins.toLocaleString()}</div>
            <div className='text-xs font-bold text-black uppercase'>Coins</div>
          </div>
          <div className='bg-green-400 border-2 border-black p-3 text-center'>
            <div className='text-xs font-black text-black uppercase leading-tight'>
              {user.character?.name || 'Sin personaje'}
            </div>
          </div>
        </div>

        {/* Progress Bar - Gamified */}
        <div className='mb-6'>
          <div className='flex justify-between text-xs font-bold text-black mb-2 uppercase tracking-wide'>
            <span>Nivel {user.level}</span>
            <span>{currentLevelXP}/200</span>
            <span>Nivel {user.level + 1}</span>
          </div>
          <div className='w-full bg-gray-200 border-2 border-black h-4 relative'>
            <div
              className='bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-700 ease-out relative'
              style={{ width: `${progressPercentage}%` }}
            >
              <div className='absolute inset-0 bg-white/30 animate-pulse'></div>
            </div>
            {/* XP Text Overlay */}
            <div className='absolute inset-0 flex items-center justify-center'>
              <span className='text-xs font-black text-white drop-shadow-lg'>
                {xpToNextLevel} XP para subir
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions - Clean Grid */}
        <div className='grid grid-cols-2 gap-3'>
          <Link
            href='/tasks'
            className='bg-orange-400 border-2 border-black p-3 text-center font-black text-black uppercase tracking-wide hover:bg-orange-500 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1'
          >
            📝 Tareas
          </Link>
          <Link
            href='/history'
            className='bg-purple-400 border-2 border-black p-3 text-center font-black text-black uppercase tracking-wide hover:bg-purple-500 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1'
          >
            📚 Historial
          </Link>
          <Link
            href='/stats'
            className='bg-red-400 border-2 border-black p-3 text-center font-black text-black uppercase tracking-wide hover:bg-red-500 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1'
          >
            📊 Stats
          </Link>
        </div>
      </NeoCardContent>
    </NeoCard>
  );
};

export default Header;
