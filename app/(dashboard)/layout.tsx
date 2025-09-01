import { getProfile } from '@/actions';
import DashboardLayout from '@/components/layout/DashboardLayout';
import type { PrismaUser } from '@/types/prisma';

export default async function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  try {
    const profileResult = await getProfile();

    if (!profileResult.success) {
      throw new Error(profileResult.error);
    }

    const user = profileResult.data;

    // Verificar que user no sea undefined
    if (!user) {
      throw new Error('User data not found');
    }

    return <DashboardLayout user={user as PrismaUser}>{children}</DashboardLayout>;
  } catch (error) {
    console.error('Error loading dashboard layout:', error);
    return <div>Error loading dashboard</div>;
  }
}
