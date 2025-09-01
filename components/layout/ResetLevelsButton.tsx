'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { resetLevels } from '../../actions';

export default function ResetLevelsButton() {
  const router = useRouter();
  const [isResetting, setIsResetting] = useState(false);

  const handleResetLevels = async () => {
    if (confirm('¿Estás seguro de que quieres resetear todos tus niveles? Esta acción no se puede deshacer.')) {
      try {
        setIsResetting(true);
        const result = await resetLevels();
        
        if (result.success) {
          alert('¡Niveles reseteados exitosamente!');
          router.refresh(); // Refrescar la página para mostrar los nuevos datos
        } else {
          alert(`Error al resetear niveles: ${result.error}`);
        }
      } catch (error) {
        alert('Error al resetear niveles');
        console.error('Error resetting levels:', error);
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <button
      onClick={handleResetLevels}
      disabled={isResetting}
      className='w-full flex items-center gap-3 px-4 py-3 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3'
      title='Resetear niveles y XP'
    >
      <span>{isResetting ? '⏳' : '🔄'}</span>
      <span>{isResetting ? 'Reseteando...' : 'Resetear Niveles'}</span>
    </button>
  );
}
