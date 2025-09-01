import { getProfile } from '@/actions';
import DashboardLayout from '@/components/layout/DashboardLayout';
import type { PrismaUserWithExtras } from '@/lib/types';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }
  const profileResult = await getProfile();

  if (!profileResult.success) {
    throw new Error(profileResult.error);
  }

  const user = profileResult.data;

  if (!user) {
    throw new Error('User data not found');
  }

  return <DashboardLayout user={user as PrismaUserWithExtras}>{children}</DashboardLayout>;
}
