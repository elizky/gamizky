import type { Metadata } from 'next';
import { Syne } from 'next/font/google';
import './globals.css';
import { NextAuthProvider } from '@/components/NextAuthProvider';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';

const syne = Syne({
  variable: '--font-oxanium',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'GAMIZKY - Tu Aventura de Gamificación Personal',
  description:
    'Convierte tus hábitos diarios en una aventura RPG. Gana XP, monedas y sube de nivel al completar tareas como ejercicio, alimentación saludable y meditación.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Gamizky',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/gamizkyIcon.png', sizes: '32x32', type: 'image/png' },
      { url: '/gamizkyIcon.png', sizes: '192x192', type: 'image/png' },
      { url: '/gamizkyIcon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/gamizkyIcon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://gamizky.com',
    title: 'GAMIZKY - Tu Aventura de Gamificación Personal',
    description:
      'Convierte tus hábitos diarios en una aventura RPG. Gana XP, monedas y sube de nivel al completar tareas como ejercicio, alimentación saludable y meditación.',
    siteName: 'Gamizky',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GAMIZKY - Tu Aventura de Gamificación Personal',
    description:
      'Convierte tus hábitos diarios en una aventura RPG. Gana XP, monedas y sube de nivel al completar tareas como ejercicio, alimentación saludable y meditación.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es'>
      <body className={`${syne.variable} antialiased`}>
        <NextAuthProvider>
          {children}
          <ServiceWorkerRegistration />
        </NextAuthProvider>
      </body>
    </html>
  );
}
