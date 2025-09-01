'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { formatXP, formatCoins } from '../../lib/gamification';
import ResetLevelsButton from './ResetLevelsButton';
import type { PrismaUser } from '../../types/prisma';

interface DashboardLayoutProps {
  user: PrismaUser;
  children: React.ReactNode;
}

export default function DashboardLayout({ user, children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Inicio', href: '/home', icon: '🏠' },
    { name: 'Tareas', href: '/tasks', icon: '📝' },
    { name: 'Challenges', href: '/challenges', icon: '🏆' },
    { name: 'Tienda', href: '/shop', icon: '🛍️' },
    { name: 'Estadísticas', href: '/stats', icon: '📊' },
    { name: 'Historial', href: '/history', icon: '📚' },
    { name: 'Perfil', href: '/profile', icon: '👤' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      {/* Header móvil */}
      <div className='lg:hidden bg-white shadow-sm border-b'>
        <div className='flex items-center justify-between p-4'>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className='text-gray-600 hover:text-gray-800'
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 6h16M4 12h16M4 18h16'
              />
            </svg>
          </button>
          <div className='flex items-center gap-3'>
            <div className='text-2xl'>{user.avatar}</div>
            <div className='text-right'>
              <div className='font-medium text-gray-800'>{user.name}</div>
              <div className='text-sm text-gray-500'>Nivel {user.level}</div>
            </div>
          </div>
        </div>
      </div>

      <div className='flex'>
        {/* Sidebar */}
        <div
          className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        >
          <div className='flex flex-col h-full'>
            {/* Logo y usuario */}
            <div className='p-6 border-b'>
              <div className='flex items-center gap-3'>
                <div className='text-3xl'>🎮</div>
                <div>
                  <h1 className='text-xl font-bold text-gray-800'>GAMIZKY</h1>
                  <p className='text-sm text-gray-500'>Gamificación Personal</p>
                </div>
              </div>
            </div>

            {/* Stats del usuario */}
            <div className='p-4 border-b bg-gray-50'>
              <div className='text-center'>
                <div className='text-4xl mb-2'>{user.avatar}</div>
                <h3 className='font-semibold text-gray-800'>{user.name}</h3>
                <p className='text-sm text-gray-600 mb-2'>Nivel {user.level}</p>
                <div className='space-y-1 text-xs text-gray-500'>
                  <div>{formatXP(user.totalXP)} XP</div>
                  <div>{formatCoins(user.coins)} 🪙</div>
                  <div>{user.streak} días 🔥</div>
                </div>
              </div>
            </div>

            {/* Navegación */}
            <nav className='flex-1 p-4'>
              <ul className='space-y-2'>
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                        ${
                          isActive(item.href)
                            ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                        }
                      `}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <span className='text-xl'>{item.icon}</span>
                      <span className='font-medium'>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Botón de reset y cerrar sesión */}
            <div className='p-4 border-t'>
              <ResetLevelsButton />

              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className='w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors'
              >
                <span>🚪</span>
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className='flex-1 lg:ml-0'>
          {/* Overlay para móvil */}
          {isSidebarOpen && (
            <div
              className='fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden'
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Contenido de la página */}
          <main className='p-4'>{children}</main>
        </div>
      </div>
    </div>
  );
}
