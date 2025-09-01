import { Suspense } from 'react';
import { getProfile, getTasks, getCategories } from '../../../actions';
import HomeClient from '../../../components/pages/HomeClient';
import { PrismaUserWithExtras, PrismaTask } from '../../../lib/types';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Loading from '@/components/ui/loading';
import ErrorPage from '@/components/ui/error';

// Forzar renderizado dinámico para evitar errores de prerender y hidratación
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Componente de carga
function LoadingSpinner() {
  return <Loading message="Cargando tu dashboard..." />;
}

// Componente principal del servidor
export default async function HomePage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect('/login');
  }
  
  try {
    const [profileResult, tasksResult, categoriesResult] = await Promise.all([
      getProfile(),
      getTasks(),
      getCategories(),
    ]);

    if (!profileResult.success) {
      console.error('Profile error:', profileResult.error);
      redirect('/login');
    }
    if (!tasksResult.success) {
      console.error('Tasks error:', tasksResult.error);
      throw new Error('Error al cargar las tareas');
    }
    if (!categoriesResult.success) {
      console.error('Categories error:', categoriesResult.error);
      throw new Error('Error al cargar las categorías');
    }

    const user = profileResult.data as PrismaUserWithExtras;
    const tasks = tasksResult.data as PrismaTask[];
    const categories = categoriesResult.data;

    // Verificar que los datos no sean undefined
    if (!user) {
      console.error('User data is null');
      redirect('/login');
    }

    return (
      <Suspense fallback={<LoadingSpinner />}>
        <HomeClient 
          user={user} 
          tasks={tasks || []} 
          categories={categories || []} 
        />
      </Suspense>
    );
  } catch (error) {
    console.error('Error loading home page:', error);

    // Página de error
    return (
      <ErrorPage
        title="Error al cargar la página"
        message={error instanceof Error ? error.message : 'Ocurrió un error inesperado'}
        actionText="🔑 Ir a Login"
        actionHref="/login"
      />
    );
  }
}
