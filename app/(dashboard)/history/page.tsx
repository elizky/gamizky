import { Suspense } from 'react';
import { getTaskHistory } from '@/actions';
import HistoryClient from '@/components/pages/HistoryClient';
import { PrismaTask } from "@/lib/types";

// Forzar renderizado dinámico para evitar errores de prerender
export const dynamic = 'force-dynamic';

// Componente de carga
function LoadingSpinner() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center'>
      <div className='text-center'>
        <div className='w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
        <p className='text-gray-600'>Cargando historial...</p>
      </div>
    </div>
  );
}

// Componente principal del servidor
export default async function HistoryPage() {
  try {
    const historyResult = await getTaskHistory();

    if (!historyResult.success) {
      throw new Error(historyResult.error);
    }

    const completedTasks = historyResult.data as PrismaTask[];

    return (
      <Suspense fallback={<LoadingSpinner />}>
        <HistoryClient completedTasks={completedTasks} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error loading history page:', error);

    // Página de error
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-6xl mb-4'>😞</div>
          <h1 className='text-2xl font-bold text-gray-800 mb-2'>Error al cargar historial</h1>
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
