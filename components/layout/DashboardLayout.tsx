'use client';

import { PrismaUserWithExtras } from '@/lib/types';
import NavBar from './NavBar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: PrismaUserWithExtras;
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      {/* Navigation Bar */}
      <NavBar user={user} />

      {/* Main Content */}
      <main className='p-4 md:p-6 lg:p-8'>{children}</main>
    </div>
  );
}
