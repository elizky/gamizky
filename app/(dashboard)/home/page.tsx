import { Suspense } from 'react';
import { getProfile, getTasks, getCategories } from '../../../actions';
import HomeClient from '../../../components/pages/HomeClient';
import { PrismaUserWithExtras, PrismaTask } from '../../../lib/types';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

// Forzar renderizado dinámico para evitar errores de prerender
export const dynamic = 'force-dynamic';

// Componente de carga
function LoadingSpinner() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center'>
      <div className='text-center'>
        <div className='w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
        <p className='text-gray-600'>Cargando...</p>
      </div>
    </div>
  );
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
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-6xl mb-4'>😞</div>
          <h1 className='text-2xl font-bold text-gray-800 mb-2'>Error al cargar la página</h1>
          <p className='text-gray-600 mb-4'>
            {error instanceof Error ? error.message : 'Ocurrió un error inesperado'}
          </p>
          <a
            href='/login'
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block'
          >
            Ir a login
          </a>
        </div>
      </div>
    );
  }
}
