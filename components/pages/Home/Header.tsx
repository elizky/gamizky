import { PrismaUserWithExtras } from '@/lib/types';
import { NeoCard, NeoCardContent } from '@/components/ui/card';

const Header = ({ user }: { user: PrismaUserWithExtras }) => {
  // Asegurar que los cálculos sean consistentes entre servidor y cliente
  const currentLevelXP = Math.floor(user.totalXP % 200);
  const xpToNextLevel = 200 - currentLevelXP;
  const progressPercentage = Math.floor((currentLevelXP / 200) * 100);

  return (
    <NeoCard className='p-4 mb-4 w-9/10 mx-auto'>
      <NeoCardContent className='p-0'>
        {/* Header Layout - Responsive */}
        <div className='mb-6'>
          {/* Greeting */}
          <div className='text-center mb-6'>
            <h1 className='text-2xl md:text-3xl font-black text-black mb-1 uppercase tracking-wider'>
              ¡Hola, {user.name}!
            </h1>
            <p className='text-sm font-bold text-gray-600 uppercase tracking-wide md:hidden'>
              Racha de {user.streak} días 🔥
            </p>
          </div>

          {/* Avatar + Stats Grid - Responsive */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-6'>
            {/* Avatar - Centrado en mobile, primera columna en desktop */}
            <div className='flex justify-center'>
              <div className='relative'>
                <div className='w-24 h-24 md:w-20 md:h-20 bg-yellow-300 border-4 border-black rounded-none flex items-center justify-center text-4xl md:text-3xl'>
                  {user.avatar}
                </div>
                <div className='absolute -bottom-2 -right-2 w-8 h-8 md:w-7 md:h-7 bg-red-500 border-2 border-black rounded-none flex items-center justify-center text-white text-sm md:text-xs font-black'>
                  {user.level}
                </div>
              </div>
            </div>

            {/* Stats Grid - 3 columnas en mobile, 3 columnas en las últimas 3 cols de desktop */}
            <div className='md:col-span-3 grid grid-cols-3 gap-3 md:gap-4'>
              <div className='bg-blue-400 border-2 border-black p-3 md:p-4 text-center'>
                <div className='text-xl md:text-2xl font-number font-black text-white'>
                  {user.totalXP.toLocaleString()}
                </div>
                <div className='text-xs font-display font-bold text-black uppercase'>XP</div>
              </div>
              <div className='bg-yellow-400 border-2 border-black p-3 md:p-4 text-center'>
                <div className='text-xl md:text-2xl font-number font-black text-black'>
                  {user.coins.toLocaleString()}
                </div>
                <div className='text-xs font-display font-bold text-black uppercase'>Coins</div>
              </div>
              <div className='bg-green-400 border-2 border-black p-3 md:p-4 text-center'>
                <div className='text-xs md:text-sm font-black text-black uppercase leading-tight'>
                  {user.character?.name || 'Sin personaje'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar - Gamified */}
        <div className='mb-6'>
          <div className='flex justify-between text-xs font-display font-bold text-black mb-2 uppercase tracking-wide'>
            <span>
              Nivel <span className='font-number'>{user.level}</span>
            </span>
            <span className='font-number'>{currentLevelXP}/200</span>
            <span>
              Nivel <span className='font-number'>{user.level + 1}</span>
            </span>
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
              <span className='text-xs font-number font-black text-white drop-shadow-lg'>
                {xpToNextLevel} XP para subir
              </span>
            </div>
          </div>
        </div>
      </NeoCardContent>
    </NeoCard>
  );
};

export default Header;
