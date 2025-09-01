'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { LogOut, Home, CheckSquare, BarChart3, History, ChevronDown, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { PrismaUserWithExtras } from '@/lib/types';

interface NavBarProps {
  user: PrismaUserWithExtras;
}

export default function NavBar({ user }: NavBarProps) {
  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  const navigation = [
    { name: 'Inicio', href: '/home', icon: Home },
    { name: 'Tareas', href: '/tasks', icon: CheckSquare },
    { name: 'Estadísticas', href: '/stats', icon: BarChart3 },
    { name: 'Historial', href: '/history', icon: History },
  ];

  return (
    <nav className='bg-white border-b-2 border-black shadow-[0_2px_0px_0px_rgba(0,0,0,1)] sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link href='/home' className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-orange-500 border-2 border-black flex items-center justify-center'>
                <span className='text-white font-black text-sm'>G</span>
              </div>
              <h1 className='text-xl font-display font-black text-gray-800 hidden sm:block'>
                GAMIZKY
              </h1>
            </Link>
          </div>

          {/* User Menu */}
          <div className='flex items-center space-x-4'>
            {/* Menu Dropdown - Neo Brutalist */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  className='flex items-center space-x-2 p-3 bg-white border-2 border-black font-display font-bold text-gray-800 hover:bg-orange-100 hover:border-orange-500 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5'
                >
                  <Menu className='h-5 w-5 text-gray-800' />
                  <ChevronDown className='h-4 w-4 text-gray-800' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-56 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-2'
                align='end'
              >
                {/* User Info Header */}
                <div className='mb-3 p-3 bg-gray-50 border-2 border-gray-300 flex items-center space-x-3'>
                  <div className='w-10 h-10 bg-orange-500 border-2 border-black flex items-center justify-center relative'>
                    <span className='text-white font-black text-lg'>{user.avatar}</span>
                    <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 border-2 border-black flex items-center justify-center'>
                      <span className='text-white font-black text-xs'>{user.level}</span>
                    </div>
                  </div>
                  <div>
                    <div className='font-display font-black text-gray-800 text-sm'>{user.name}</div>
                    <div className='font-number font-bold text-orange-600 text-xs'>
                      NIVEL {user.level}
                    </div>
                  </div>
                </div>

                {/* Navigation - Always Visible */}
                <div className='space-y-1 mb-3'>
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link
                          href={item.href}
                          className='flex items-center space-x-3 w-full p-3 bg-gray-50 border-2 border-gray-300 font-display font-bold text-gray-800 hover:bg-orange-100 hover:border-orange-400 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5'
                        >
                          <div className='w-6 h-6 bg-white border border-black flex items-center justify-center'>
                            <Icon className='h-3 w-3' />
                          </div>
                          <span className='text-sm uppercase tracking-wide'>{item.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </div>

                <DropdownMenuSeparator className='border-t-2 border-black my-2' />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className='flex items-center space-x-3 w-full p-3 bg-red-500 border-2 border-black font-display font-bold text-white hover:bg-red-600 cursor-pointer transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5'
                >
                  <div className='w-6 h-6 bg-white border border-black flex items-center justify-center'>
                    <LogOut className='h-3 w-3 text-black' />
                  </div>
                  <span className='text-sm uppercase tracking-wide'>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
