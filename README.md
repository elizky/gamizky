# 🎮 GAMIZKY - Plataforma de Productividad Gamificada

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-blue)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.15.0-blue)](https://www.prisma.io/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-5.0-blue)](https://next-auth.js.org/)

> **GAMIZKY** es una plataforma de productividad gamificada con diseño **neo-brutalist**, enfocada en el tracking eficiente de tareas con elementos de gamificación básicos. Minimalista, funcional y visualmente impactante.

## ✨ **Características Principales**

### 📝 **Sistema de Tareas CRUD Completo**
- **Crear, leer, actualizar y eliminar** tareas
- **Categorización por habilidades** (Físico, Sabiduría, Mental, Social, Creatividad)
- **Sistema de dificultad** (Fácil, Medio, Difícil) con colores semánticos
- **Recompensas automáticas** (XP + Monedas) por completar tareas
- **Tareas recurrentes** (diarias, semanales, mensuales)

### 🎯 **Gamificación Básica Efectiva**
- **Sistema de XP y niveles** progresivo
- **Monedas virtuales** como recompensa
- **Racha de días consecutivos** para mantener consistencia
- **Avatares y personajes** desbloqueables
- **Sistema de habilidades** con progreso individual

### 📊 **Dashboard de Estadísticas**
- **Resumen de actividad** (tareas completadas, pendientes, racha)
- **Progreso por habilidades** con niveles individuales
- **Actividad temporal** con gráficos de los últimos 30 días
- **Métricas visuales** claras y comprensibles

### 🎨 **Diseño Neo-Brutalist**
- **Tipografía impactante** con Syne (títulos/números) e Inter (texto)
- **Colores vibrantes** con máximo contraste
- **Bordes negros gruesos** y sombras 3D
- **Efectos hover** con transformaciones
- **Componentes reutilizables** con variantes específicas

## 🏗️ **Arquitectura Técnica**

### **Frontend Moderno**
- **Next.js 15** con App Router y Server Components
- **React 19** con hooks optimizados
- **TypeScript** con tipado estricto
- **Tailwind CSS** con configuración personalizada
- **Shadcn UI** con variantes neo-brutalist

### **Backend Robusto**
- **Next.js API Routes** para operaciones CRUD
- **Prisma ORM** con modelos optimizados
- **NextAuth.js** para autenticación Google OAuth
- **Server Actions** para mutaciones de datos

### **Base de Datos Simplificada**
```prisma
User {
  // Info básica + gamificación
  level, totalXP, coins, streak, avatar
  characters, skills, tasks
}

Task {
  // CRUD completo
  title, description, completed
  coinReward, skillRewards
  category, difficulty, recurring
}

Character & UserSkill {
  // Sistema de personajes y habilidades
}
```

## 🎨 **Sistema de Diseño Neo-Brutalist**

### **Componentes UI Optimizados**
- **Badge System**: Variantes para recompensas y dificultad
- **Button Variants**: Neo, neo-primary, neo-success, neo-danger
- **Input/Select**: Variantes neo con bordes y sombras
- **Card System**: NeoCard con variantes coloridas
- **Modal System**: NeoDialogContent con máximo contraste

### **Responsive Design**
- **Mobile First**: Grid 1 columna, navegación en dropdown
- **Tablet**: Grid 2 columnas para mejor aprovechamiento
- **Desktop**: Grid 3+ columnas, layout horizontal optimizado
- **Breakpoints**: sm:, md:, lg: para transiciones suaves

### **Tipografía Consistente**
- **Títulos**: `font-display` (Syne) con `font-black`
- **Números**: `font-number` (Syne) con `font-black`
- **Texto**: `font-sans` (Inter) con pesos variables
- **Labels**: `font-display` con `font-bold`

## 🚀 **Instalación y Desarrollo**

### **Instalación Rápida**
```bash
# Clonar repositorio
git clone https://github.com/izky/gamizky.git
cd gamizky

# Instalar dependencias
npm install

# Configurar entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Setup base de datos
npx prisma generate
npx prisma db push
npm run seed

# Ejecutar desarrollo
npm run dev
```

### **Variables de Entorno Requeridas**
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="secret-seguro"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="google-oauth-id"
GOOGLE_CLIENT_SECRET="google-oauth-secret"
```

### **Scripts de Desarrollo**
```bash
npm run dev          # Servidor desarrollo (puerto 3000)
npm run build        # Build producción
npm run start        # Servidor producción
npm run lint         # Verificar código
npm run seed         # Poblar datos iniciales
```

## 📱 **Funcionalidades Implementadas**

### **✅ Core Features**
- [x] **CRUD de Tareas** completo con modal reutilizable
- [x] **Sistema de XP/Niveles** con progreso visual
- [x] **Historial de actividad** con filtros y búsqueda
- [x] **Estadísticas detalladas** con gráficos
- [x] **Autenticación Google** con middleware de protección

### **✅ UI/UX Optimizada**
- [x] **Diseño neo-brutalist** consistente
- [x] **Navegación centralizada** en dropdown hamburger
- [x] **Grid layouts** optimizados para todos los breakpoints
- [x] **Sistema de badges** reutilizable
- [x] **PWA completa** con Service Worker

### **✅ Performance**
- [x] **Server Components** para mejor rendimiento
- [x] **Dynamic rendering** sin cache issues
- [x] **Optimización de imports** y código limpio
- [x] **Build sin errores** listo para producción

## 🔄 **Arquitectura de Componentes**

### **Layout System**
```
DashboardLayout
├── NavBar (hamburger + user dropdown)
└── Main Content (responsive padding)
```

### **Page Components**
```
Home
├── Header (avatar + stats + progress)
├── TasksList (grid 2x2 con badges)
└── StatsCard (grid 2x3 responsive)

Tasks
├── TasksClient (CRUD completo)
├── AddTaskModal (neo-brutalist)
└── Filters + Search
```

### **Reusable UI**
```
Badge Variants:
├── reward-coin (amarillo)
├── reward-xp (azul)
├── difficulty-easy (verde)
├── difficulty-medium (amarillo)
└── difficulty-hard (rojo)
```

## 🚀 **Deploy a Producción**

### **Vercel (Recomendado)**
```bash
# Build local
npm run build

# Deploy a Vercel
npx vercel --prod
```

### **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### **Variables de Entorno Producción**
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Secret seguro para producción
- `NEXTAUTH_URL`: URL de tu dominio
- `GOOGLE_CLIENT_ID`: OAuth ID para tu dominio
- `GOOGLE_CLIENT_SECRET`: OAuth secret

## 📈 **Performance Metrics**

- **First Load JS**: ~101 kB (optimizado)
- **Build Time**: ~3 segundos
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices)
- **Bundle Size**: Optimizado con tree-shaking

## 🛠️ **Desarrollo y Mantenimiento**

### **Estructura del Proyecto**
```
├── app/                    # Next.js App Router
├── components/             # Componentes reutilizables
│   ├── dashboard/          # Componentes del dashboard
│   ├── layout/             # Layout components
│   ├── modals/             # Modales reutilizables
│   ├── pages/              # Page-specific components
│   └── ui/                 # Shadcn UI components
├── lib/                    # Utilidades y tipos
├── prisma/                 # Schema y seeds
├── actions/                # Server Actions
└── public/                 # Assets estáticos
```

### **Convenciones de Código**
- **TypeScript estricto** con interfaces tipadas
- **Componentes funcionales** con hooks
- **Server Components** por defecto, Client Components marcados
- **Tailwind classes** organizadas por función
- **Imports absolutos** con alias @/

## 🎯 **Roadmap v3.0**

### **Próximas Mejoras**
- [ ] **Modo oscuro** con toggle
- [ ] **Notificaciones push** reales
- [ ] **Exportación de datos** 
- [ ] **Sistema de backup**
- [ ] **Métricas avanzadas**

---

<div align="center">

**🎮 GAMIZKY - Productividad Gamificada con Estilo Neo-Brutalist**

*Desarrollado por Nicolás González (Izky)*

**⭐ ¡Dale una estrella si te gusta el proyecto! ⭐**

</div>