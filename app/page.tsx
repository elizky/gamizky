import { redirect } from 'next/navigation';
import { auth } from '../auth';
import LandingPage from '@/components/pages/LandingPage';

export default async function RootPage() {
  const session = await auth();

  if (session) {
    redirect('/home');
  }

  return <LandingPage />;
}
