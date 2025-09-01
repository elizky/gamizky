import { Suspense } from 'react';
import { getTasks, getCategories } from '@/actions';
import TasksClient from '@/components/pages/TasksClient';
import { PrismaTask, PrismaTaskCategory } from "@/lib/types";

// Forzar renderizado dinámico para evitar errores de prerender y hidratación
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Componente de carga
function LoadingSpinner() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center'>
      <div className='text-center'>
        <div className='w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
        <p className='text-gray-600'>Cargando tareas...</p>
      </div>
    </div>
  );
}

// Componente principal del servidor
export default async function TasksPage() {
  try {
    const [tasksResult, categoriesResult] = await Promise.all([getTasks(), getCategories()]);

    if (!tasksResult.success) {
      throw new Error(tasksResult.error);
    }

    if (!categoriesResult.success) {
      throw new Error(categoriesResult.error);
    }

    const tasks = tasksResult.data as PrismaTask[];
    const categories = categoriesResult.data as PrismaTaskCategory[];

    // Verificar que los datos no sean undefined
    if (!tasks) {
      throw new Error('Tasks data not found');
    }

    if (!categories) {
      throw new Error('Categories data not found');
    }

    return (
      <Suspense fallback={<LoadingSpinner />}>
        <TasksClient tasks={tasks} categories={categories} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error loading tasks page:', error);

    // Página de error
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-6xl mb-4'>😞</div>
          <h1 className='text-2xl font-bold text-gray-800 mb-2'>Error al cargar tareas</h1>
          <p className='text-gray-600 mb-4'>
            {error instanceof Error ? error.message : 'Ocurrió un error inesperado'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }
}
