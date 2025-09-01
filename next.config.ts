import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para PWA
  experimental: {
    // Habilitar optimizaciones para PWA
    optimizePackageImports: ['@next/font'],
  },
  
  // Headers para PWA
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
  
  // Configuración de imágenes
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Configuración de compresión
  compress: true,
  
  // Configuración de seguridad
  poweredByHeader: false,
};

export default nextConfig;
