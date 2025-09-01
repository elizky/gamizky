# 🎮 GAMIZKY - Plataforma de Gamificación Completa

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-blue)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.15.0-blue)](https://www.prisma.io/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-5.0-blue)](https://next-auth.js.org/)

> **GAMIZKY** es una plataforma de gamificación moderna y completa que transforma tareas cotidianas en experiencias divertidas y motivadoras. Con un sistema robusto de XP, monedas, niveles, challenges, logros y recompensas, los usuarios pueden mantener su motivación y productividad de manera sostenible.

## ✨ **Características Principales**

### 🎯 **Sistema de Tareas Inteligente**
- **Categorización por habilidades** (Físico, Sabiduría, Mental, Social, Creatividad, Disciplina)
- **Sistema de puntos dinámico** basado en dificultad y categoría
- **Tareas recurrentes** (diarias, semanales, mensuales)
- **Progreso visual** con barras de completado
- **Historial completo** de actividades

### 🏆 **Sistema de Challenges Avanzado**
- **5 tipos de challenges:**
  - 📅 **Daily** - Desafíos diarios con objetivos específicos
  - 📆 **Weekly** - Retos semanales más complejos
  - 🎯 **Skill** - Enfoque en habilidades específicas
  - 🌈 **Diversity** - Variedad de categorías de tareas
  - ⏰ **Temporal** - Desafíos con límites de tiempo
- **Dificultades:** Easy, Medium, Hard, Epic
- **Rarezas:** Common, Rare, Epic, Legendary
- **Progreso automático** basado en completación de tareas
- **Recompensas personalizadas** (XP + Monedas)

### 🛍️ **Tienda de Recompensas Mejorada**
- **4 categorías principales:**
  - 🎁 **Internas** - Boosters, protecciones, personalizaciones
  - 🌍 **Externas** - Recompensas del mundo real
  - 🎨 **Cosméticas** - Temas, marcos, insignias
  - 👤 **Personajes** - Avatares desbloqueables
- **Sistema de ofertas especiales:**
  - ⚡ **Flash Sales** - Descuentos por tiempo limitado
  - 🎯 **Daily Deals** - Ofertas diarias especiales
  - 📦 **Bundles** - Packs con descuentos especiales
  - 👑 **Loyalty Rewards** - Beneficios por fidelidad
- **Sistema de lealtad** con 4 tiers (Bronze, Silver, Gold, Platinum)
- **Descuentos automáticos** hasta 15% por lealtad
- **Recomendaciones personalizadas** basadas en nivel y actividad

### 🏅 **Sistema de Achievements Automático**
- **20+ logros predefinidos** con detección automática
- **Categorías de logros:**
  - 🎯 **Nivel** - Alcanzar niveles específicos
  - 🔥 **Racha** - Mantener consistencia
  - 📊 **Estadísticas** - Completar metas numéricas
  - 🌟 **Especiales** - Logros únicos y raros
- **Desbloqueo automático** basado en acciones del usuario
- **Recompensas especiales** por logros desbloqueados

### 🔔 **Sistema de Notificaciones Push**
- **4 tipos de notificaciones:**
  - 📝 **Recordatorios de tareas** - "¡Hora de ser productivo!"
  - 🏅 **Logros desbloqueados** - "¡Nuevo achievement!"
  - 🏆 **Challenges disponibles** - "¡Nuevo desafío te espera!"
  - 🔥 **Recordatorios de racha** - "¡Mantén tu racha!"
- **Acciones inteligentes** en notificaciones
- **Navegación directa** a secciones relevantes
- **Permisos inteligentes** con UI intuitiva

### 📊 **Dashboard de Estadísticas Avanzado**
- **3 pestañas principales:**
  - 📈 **Overview** - Resumen general del progreso
  - 🎯 **Skills** - Niveles y progreso por habilidad
  - 📅 **Activity** - Actividad diaria y tendencias
- **Gráficos visuales:**
  - 🟢 **Circular** - Progreso de nivel y XP
  - 📊 **Barras** - Comparación de habilidades
  - 📈 **Líneas** - Actividad temporal
- **Métricas detalladas:**
  - XP total y por habilidad
  - Monedas ganadas y gastadas
  - Racha actual y máxima
  - Tareas completadas por período

### 🎨 **Interfaz de Usuario Moderna**
- **Header mejorado** con gradientes y estadísticas prominentes
- **Diseño responsive** optimizado para móvil y desktop
- **Navegación intuitiva** con acceso rápido a funciones
- **PWA completa** instalable y funcional offline
- **Service Worker** con caché inteligente

## 🚀 **Tecnologías Utilizadas**

### **Frontend**
- **Next.js 15** - Framework React con App Router
- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript 5** - Tipado estático y autocompletado
- **Tailwind CSS 4** - Framework CSS utility-first
- **Chart.js** - Gráficos interactivos y responsivos

### **Backend & Base de Datos**
- **Next.js API Routes** - APIs RESTful integradas
- **Prisma ORM 6** - Cliente de base de datos type-safe
- **PostgreSQL (Neon)** - Base de datos relacional en la nube
- **NextAuth.js 5** - Autenticación con Google OAuth

### **Características Avanzadas**
- **PWA (Progressive Web App)** - Instalable y offline
- **Service Worker** - Caché y notificaciones push
- **Server Actions** - Mutaciones de datos del lado del servidor
- **Middleware** - Autenticación y protección de rutas

## 📋 **Instalación y Configuración**

### **Prerrequisitos**
- Node.js 18+ 
- PostgreSQL (recomendado Neon para desarrollo)
- Cuenta de Google para OAuth

### **1. Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/gamizky.git
cd gamizky
```

### **2. Instalar dependencias**
```bash
npm install
```

### **3. Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Editar `.env.local` con tus credenciales:
```env
# Base de datos
DATABASE_URL="postgresql://usuario:password@host:puerto/database"

# NextAuth.js
NEXTAUTH_SECRET="tu-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="tu-google-client-id"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"
```

### **4. Configurar base de datos**
```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma db push

# Poblar con datos iniciales
npm run seed:challenges
npm run seed:shop
npm run seed:achievements
```

### **5. Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🎯 **Scripts Disponibles**

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Verificar linting

# Base de datos
npm run db:push      # Sincronizar schema
npm run db:studio    # Abrir Prisma Studio
npm run db:seed      # Poblar base de datos

# Datos específicos
npm run seed:challenges    # Poblar challenges
npm run seed:shop          # Poblar tienda
npm run seed:achievements  # Poblar achievements

# Utilidades
npm run type-check   # Verificar tipos TypeScript
npm run clean        # Limpiar build y cache
```

## 📱 **Uso de la Aplicación**

### **1. Autenticación**
- Iniciar sesión con Google OAuth
- Perfil automáticamente configurado
- Nivel inicial: 1, XP: 0, Monedas: 100

### **2. Crear y Completar Tareas**
- Agregar tareas con categorías y puntos
- Completar tareas para ganar XP y monedas
- Ver progreso en tiempo real

### **3. Participar en Challenges**
- Explorar challenges disponibles
- Unirse a desafíos interesantes
- Completar objetivos para recompensas

### **4. Comprar en la Tienda**
- Explorar recompensas por categoría
- Aprovechar ofertas especiales
- Desbloquear personajes y cosméticos

### **5. Activar Notificaciones**
- Permitir notificaciones push
- Recibir recordatorios automáticos
- Mantener motivación constante

## 🔄 **Changelog Detallado**

### **v2.0.0 - Sistema Completo de Gamificación** *(Actual)*
#### ✨ **Nuevas Funcionalidades**
- 🏆 **Sistema de Challenges** completamente implementado
- 🛍️ **Tienda de recompensas** con ofertas y lealtad
- 🔔 **Notificaciones push** inteligentes
- 🏅 **Sistema de achievements** automático
- 📊 **Dashboard de estadísticas** con gráficos visuales
- 🎨 **Header mejorado** con gradientes y acceso rápido

#### 🔧 **Mejoras Técnicas**
- **Service Worker** actualizado con nuevas funcionalidades
- **APIs robustas** para todas las nuevas características
- **Tipos TypeScript** completamente definidos
- **Base de datos** poblada con +25 recompensas
- **Build optimizado** sin errores de linting

#### 📱 **Experiencia de Usuario**
- **Navegación mejorada** entre secciones
- **Interfaz responsive** optimizada
- **PWA completa** instalable
- **Caché inteligente** para mejor rendimiento

### **v1.0.0 - Base del Sistema**
#### ✨ **Funcionalidades Base**
- 🔐 **Autenticación** con Google OAuth
- 📝 **Sistema de tareas** básico
- 🎯 **Categorización** por habilidades
- 📊 **Estadísticas** básicas del usuario
- 👤 **Perfil de usuario** con progreso

## 📋 **TODO List - Próximas Funcionalidades**

### **🚀 Alta Prioridad**
- [ ] **Sistema de notificaciones push real** con web-push
- [ ] **Mejoras en el sistema de recompensas** con más variedad
- [ ] **Sistema de amigos** y competencia social
- [ ] **Challenges en tiempo real** con otros usuarios

### **🎨 Intermedia Prioridad**
- [ ] **Modo oscuro** para la aplicación
- [ ] **Temas personalizables** por usuario
- [ ] **Animaciones** y transiciones mejoradas
- [ ] **Sonidos** y efectos de audio

### **🔮 Baja Prioridad**
- [ ] **Sistema de clanes** y grupos
- [ ] **Eventos especiales** y temporadas
- [ **Integración con APIs externas** (calendario, fitness)
- [ ] **Sistema de rankings** globales
- [ ] **Exportación de datos** y reportes

### **🛠️ Mejoras Técnicas**
- [ ] **Tests unitarios** y de integración
- [ ] **CI/CD pipeline** automatizado
- [ ] **Monitoreo** y analytics
- [ ] **Optimización de rendimiento** avanzada
- [ ] **Internacionalización** (i18n)

## 🤝 **Contribuir**

### **Reportar Bugs**
1. Crear un issue con descripción detallada
2. Incluir pasos para reproducir
3. Especificar entorno y versión

### **Solicitar Funcionalidades**
1. Crear un issue con etiqueta "enhancement"
2. Describir la funcionalidad deseada
3. Explicar el caso de uso

### **Contribuir Código**
1. Fork del repositorio
2. Crear rama para tu feature
3. Commit con mensajes descriptivos
4. Pull request con descripción detallada

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🙏 **Agradecimientos**

- **Next.js Team** por el increíble framework
- **Prisma Team** por el ORM type-safe
- **Tailwind CSS** por el sistema de utilidades
- **Comunidad React** por el ecosistema robusto

## 📞 **Contacto**

- **Desarrollador:** [Tu Nombre]
- **Email:** [tu-email@ejemplo.com]
- **GitHub:** [@tu-usuario]
- **Proyecto:** [https://github.com/tu-usuario/gamizky]

---

<div align="center">

**⭐ ¡Dale una estrella al proyecto si te gusta! ⭐**

*Transformando la productividad en diversión desde 2024*

</div>
