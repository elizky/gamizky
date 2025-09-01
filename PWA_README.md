# 🚀 Gamizky PWA - Progressive Web App

## Características PWA Implementadas

### ✅ Archivos de Loading y Error
- **Loading Global**: `app/loading.tsx` - Skeleton global para toda la aplicación
- **Error Global**: `app/error.tsx` - Manejo de errores con opciones de recuperación
- **Not Found**: `app/not-found.tsx` - Página 404 personalizada con navegación
- **Loading por Ruta**: Archivos de loading específicos para cada sección del dashboard

### ✅ Funcionalidad PWA
- **Service Worker**: `public/sw.js` - Cache offline y funcionalidades PWA
- **Manifest**: `public/manifest.json` - Configuración completa de la aplicación
- **Registro SW**: `components/ServiceWorkerRegistration.tsx` - Registro automático del SW
- **Middleware**: `middleware.ts` - Headers de seguridad y cache para PWA

### ✅ SEO y Metadatos
- **Sitemap**: `app/sitemap.ts` - Generación dinámica del sitemap
- **Robots**: `app/robots.ts` - Control de indexación y crawling
- **Metadatos**: Configuración completa en `app/layout.tsx` para Open Graph y Twitter

### ✅ Configuración de Build
- **Next.js Config**: `next.config.ts` - Headers y optimizaciones para PWA
- **Tailwind**: `tailwind.config.ts` - Animaciones adicionales para loading states
- **PostCSS**: `postcss.config.mjs` - Plugins para optimización CSS
- **ESLint**: `eslint.config.mjs` - Reglas específicas para PWA

## 🎯 Funcionalidades PWA

### 📱 Instalación como App
- La aplicación se puede instalar en dispositivos móviles y de escritorio
- Iconos adaptativos para diferentes tamaños de pantalla
- Tema personalizado y colores de marca

### 🔄 Funcionamiento Offline
- Cache de recursos estáticos y páginas principales
- Service Worker para manejo offline
- Sincronización en segundo plano cuando se recupera la conexión

### 🔔 Notificaciones Push
- Sistema de notificaciones push configurado
- Acciones rápidas desde las notificaciones
- Vibración y sonidos personalizados

### ⚡ Performance
- Loading states optimizados con skeletons
- Cache inteligente para diferentes tipos de contenido
- Compresión y optimización automática

## 🚀 Comandos de Desarrollo

```bash
# Desarrollo normal
npm run dev

# Build para producción con PWA
npm run build

# Build específico para PWA
npm run pwa:build

# Análisis del bundle
npm run pwa:analyze
```

## 📁 Estructura de Archivos PWA

```
app/
├── loading.tsx              # Loading global
├── error.tsx                # Error global
├── not-found.tsx            # 404 personalizado
├── sitemap.ts               # Sitemap dinámico
├── robots.ts                # Robots dinámico
├── (dashboard)/
│   ├── loading.tsx          # Loading del dashboard
│   ├── template.tsx         # Template del dashboard
│   ├── home/loading.tsx     # Loading de home
│   ├── tasks/loading.tsx    # Loading de tareas
│   ├── history/loading.tsx  # Loading de historial
│   └── profile/loading.tsx  # Loading de perfil
├── landing/loading.tsx      # Loading de landing
└── login/loading.tsx        # Loading de login

public/
├── manifest.json            # Configuración PWA
├── sw.js                    # Service Worker
├── robots.txt               # Robots estático
├── gamizkyIcon.png          # Icono principal PWA
└── gamizky.png              # Imagen apaisada para screenshots

components/
└── ServiceWorkerRegistration.tsx  # Registro del SW

middleware.ts                # Middleware para PWA
next.config.ts               # Configuración Next.js
tailwind.config.ts           # Configuración Tailwind
```

## 🔧 Configuración del Entorno

### Variables de Entorno Requeridas

```bash
# Base URL para PWA
NEXT_PUBLIC_BASE_URL="https://tu-dominio.com"

# Configuración de la aplicación
NEXT_PUBLIC_APP_NAME="Gamizky"
NEXT_PUBLIC_APP_DESCRIPTION="Tu Aventura de Gamificación Personal"
```

### Variables Opcionales

```bash
# Notificaciones Push
NEXT_PUBLIC_VAPID_PUBLIC_KEY="tu-vapid-public-key"
VAPID_PRIVATE_KEY="tu-vapid-private-key"

# Feature Flags
NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS="true"
NEXT_PUBLIC_ENABLE_OFFLINE_MODE="true"
NEXT_PUBLIC_ENABLE_BACKGROUND_SYNC="true"
```

## 📱 Testing PWA

### Chrome DevTools
1. Abre DevTools (F12)
2. Ve a la pestaña "Application"
3. Verifica "Service Workers" y "Manifest"
4. Prueba "Offline" en Network

### Lighthouse
1. Ejecuta Lighthouse en Chrome DevTools
2. Verifica la puntuación PWA
3. Revisa las recomendaciones

### Instalación
1. En Chrome, busca el icono de instalación en la barra de direcciones
2. En móviles, usa "Agregar a pantalla de inicio"
3. Verifica que funcione offline
4. El icono de la app será tu `gamizkyIcon.png`

## 🎨 Personalización

### Colores y Tema
- Modifica `manifest.json` para cambiar colores
- Actualiza `tailwind.config.ts` para nuevas animaciones
- Personaliza los skeletons en los archivos de loading

### Iconos
- **gamizkyIcon.png**: Icono principal usado para favicon y PWA
- **gamizky.png**: Imagen apaisada para screenshots del manifest
- Los iconos se escalan automáticamente a diferentes tamaños
- Actualiza las referencias en `manifest.json` si cambias los nombres

### Service Worker
- Modifica `public/sw.js` para lógica personalizada
- Agrega nuevas funcionalidades offline
- Implementa sincronización personalizada

## 🚨 Solución de Problemas

### Service Worker no se registra
- Verifica que el archivo `sw.js` esté en `public/`
- Revisa la consola del navegador
- Asegúrate de que HTTPS esté habilitado en producción

### Cache no funciona
- Verifica la configuración en `next.config.ts`
- Revisa los headers en `middleware.ts`
- Limpia el cache del navegador

### PWA no se instala
- Verifica que `manifest.json` sea válido
- Asegúrate de que HTTPS esté habilitado
- Revisa que `gamizkyIcon.png` esté disponible en `public/`
- Verifica que la imagen tenga un tamaño mínimo de 192x192px

## 📚 Recursos Adicionales

- [Next.js App Router](https://nextjs.org/docs/app)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

---

**Gamizky PWA** - Transformando tareas en aventuras gamificadas 🎮✨
