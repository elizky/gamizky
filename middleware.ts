import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/', '/login', '/api/auth'];
  const isPublicRoute = publicRoutes.some(
    (route) => nextUrl.pathname === route || nextUrl.pathname.startsWith('/api/auth')
  );

  // Rutas protegidas que requieren autenticación
  const protectedRoutes = ['/home', '/tasks', '/history', '/stats'];
  const isProtectedRoute = protectedRoutes.some((route) => nextUrl.pathname.startsWith(route));

  // Si no está logueado y trata de acceder a ruta protegida
  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  // Si está logueado y trata de acceder a login
  if (isLoggedIn && nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/home', nextUrl));
  }

  const response = NextResponse.next();

  // Agregar headers para PWA
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  // Cache para assets estáticos
  if (
    nextUrl.pathname.startsWith('/_next/') ||
    nextUrl.pathname.startsWith('/api/') ||
    nextUrl.pathname.includes('.')
  ) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Cache para páginas del dashboard
  if (isProtectedRoute) {
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  }

  return response;
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
