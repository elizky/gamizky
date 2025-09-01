import { redirect } from 'next/navigation';
import { auth } from '../auth';

export default async function RootPage() {
  const session = await auth();
  
  // Si el usuario está autenticado, redirigir al dashboard
  if (session?.user) {
    redirect('/home');
  }
  
  // Si no está autenticado, redirigir a la landing page
  redirect('/landing');
}
