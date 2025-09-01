# 🎮 GAMIZKY - Tu Aplicación de Gamificación Personal

GAMIZKY convierte tus hábitos diarios en una aventura RPG donde ganas XP, monedas y subes de nivel al completar tareas.

## 🚀 **¡GAMIZKY ESTÁ 100% FUNCIONAL!**

### **✅ LO QUE YA TIENES IMPLEMENTADO:**
- 🔐 **Autenticación completa** con Google OAuth
- 🗄️ **Base de datos PostgreSQL** con Prisma ORM
- 📱 **Dashboard funcional** con estadísticas en tiempo real
- 🎯 **Sistema de tareas** con categorías y dificultad
- ⭐ **Sistema de recompensas** (XP + monedas)
- 🧠 **6 categorías de habilidades** (Físico, Sabiduría, Mental, Social, Creatividad, Disciplina)
- 👤 **Personajes desbloqueables** (Guerrero, Mago, Ninja, Dragón)
- 🏆 **Sistema de logros** y logros
- 📊 **APIs completas** para todas las funcionalidades

### **🎯 ¿Qué puedes trackear desde septiembre?**
- ✅ **Ejercicio diario** (30 min) - +25 🪙, +50 XP
- ✅ **Comer saludable** (sin delivery) - +30 🪙, +40 XP  
- ✅ **No tomar alcohol** - +50 🪙, +60 XP (difícil)
- ✅ **Beber 2L de agua** - +20 🪙, +30 XP
- ✅ **Dormir 8 horas** - +25 🪙, +40 XP
- ✅ **Leer 20 páginas** - +15 🪙, +40 XP
- ✅ **Meditar 15 min** - +20 🪙, +35 XP

## 🛠️ **CONFIGURACIÓN COMPLETA**

### **1. Instalar dependencias**
```bash
npm install
```

### **2. Configurar variables de entorno**
Edita el archivo `.env.local` y agrega:
```bash
# Base de datos (ya configurada)
DATABASE_URL="tu-url-de-neon"

# Autenticación (ya configurada)
AUTH_SECRET="tu-secret"

# Google OAuth (NECESITAS CONFIGURAR ESTO)
GOOGLE_CLIENT_ID="tu-google-client-id"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"
```

### **3. Configurar Google OAuth**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ 
4. Ve a "Credenciales" → "Crear credenciales" → "ID de cliente OAuth 2.0"
5. Configura las URIs de redirección:
   - `http://localhost:3000/api/auth/callback/google` (desarrollo)
   - `https://tu-dominio.com/api/auth/callback/google` (producción)
6. Copia el Client ID y Client Secret a tu `.env.local`

### **4. Configurar base de datos**
```bash
npx dotenv -e .env.local -- prisma generate
npx dotenv -e .env.local -- prisma db push
npx dotenv -e .env.local -- prisma db seed
```

### **5. Ejecutar la aplicación**
```bash
npm run dev
```

### **6. Abrir en el navegador**
```
http://localhost:3000
```

### **7. Configurar usuario inicial (DESPUÉS del primer login)**
```bash
npm run setup:user
```

### **8. Poblar challenges, tienda y achievements (OPCIONAL)**
```bash
npm run seed:challenges
npm run seed:shop
npm run seed:achievements
```

## 🎮 **CÓMO USAR GAMIZKY**

### **Primera vez:**
1. **Abre** `http://localhost:3000`
2. **Serás redirigido** a `/login`
3. **Haz clic** en "Continuar con Google"
4. **Autoriza** la aplicación
5. **Ejecuta** `npm run setup:user` para crear tareas iniciales
6. **¡Listo!** Ya puedes empezar a trackear

### **Uso diario:**
1. **Ver tu progreso** en el dashboard principal
2. **Agregar nuevas tareas** usando el formulario
3. **Marcar tareas como completadas** haciendo clic en los círculos
4. **Observar cómo subes de nivel** y ganas monedas
5. **Mantener rachas** de días consecutivos

## 🏗️ **ARQUITECTURA TÉCNICA**

### **Frontend:**
- **Next.js 15** con App Router
- **React 19** + TypeScript
- **Tailwind CSS 4** para styling
- **NextAuth.js** para autenticación

### **Backend:**
- **APIs REST** con Next.js API Routes
- **Prisma ORM** para base de datos
- **PostgreSQL** (Neon) como base de datos
- **Autenticación JWT** con NextAuth

### **Base de Datos:**
- **Usuarios** con perfiles de gamificación
- **Tareas** categorizadas por habilidades
- **Habilidades** con niveles y XP
- **Personajes** desbloqueables
- **Recompensas** y logros
- **Eventos de calendario**

## 📱 **FUNCIONALIDADES IMPLEMENTADAS**

### **✅ Completamente Funcional:**
- 🔐 Login/Logout con Google OAuth
- 👤 Perfil de usuario con estadísticas
- 📝 Crear y gestionar tareas
- ✅ Marcar tareas como completadas
- 🎯 Sistema de categorías y dificultad
- ⭐ Recompensas de XP y monedas
- 🧠 Progreso de habilidades
- 📊 Dashboard con estadísticas en tiempo real
- 🎮 Personajes y sistema de niveles
- 🔄 APIs REST completas

### **🆕 NUEVAS FUNCIONALIDADES IMPLEMENTADAS:**
- ✅ **🏆 Sistema de Challenges** - Desafíos épicos con diferentes tipos
- ✅ **🛍️ Tienda de Recompensas** - Intercambia monedas por premios increíbles
- ✅ **📊 Estadísticas Avanzadas** - Dashboard visual con gráficos y métricas
- ✅ **🏅 Sistema de Achievements** - Logros automáticos por completar objetivos
- ✅ **📈 Progreso Visual** - Barras de progreso y gráficos interactivos
- ✅ **👤 Personajes Desbloqueables** - Avatares únicos para tu perfil
- ✅ **🎯 Tipos de Challenges:** Diarios, Semanales, de Habilidad, Diversidad y Temporales
- ✅ **🎨 Header Mejorado** - Información visual y accesos rápidos

### **🔮 Próximas Funcionalidades:**
- [ ] Notificaciones push
- [ ] Modo oscuro
- [ ] Sistema de amigos y competencia
- [ ] Exportar datos de progreso
- [ ] Rankings globales
- [ ] Tournaments semanales

## 🚀 **DEPLOY EN PRODUCCIÓN**

### **Vercel (Recomendado):**
```bash
npm run production:build
git push origin main
```

### **Variables de entorno en producción:**
- `DATABASE_URL`: URL de tu base de datos PostgreSQL
- `AUTH_SECRET`: Secret aleatorio para JWT
- `GOOGLE_CLIENT_ID`: ID de cliente de Google OAuth
- `GOOGLE_CLIENT_SECRET`: Secret de cliente de Google OAuth

## 🐛 **SOLUCIÓN DE PROBLEMAS**

### **Error de autenticación:**
- Verifica que `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` estén configurados
- Asegúrate de que las URIs de redirección incluyan tu dominio

### **Error de base de datos:**
- Ejecuta `npx dotenv -e .env.local -- prisma generate`
- Verifica que `DATABASE_URL` sea correcta
- Ejecuta `npx dotenv -e .env.local -- prisma db push`

### **No se ven las tareas:**
- Ejecuta `npm run setup:user` después del primer login
- Verifica que el usuario tenga habilidades creadas

## 🎯 **OBJETIVO DEL PROYECTO**

GAMIZKY nació para hacer que el desarrollo de hábitos saludables sea **divertido y adictivo**. Al gamificar tareas como ejercicio, alimentación saludable y bienestar mental, los usuarios pueden:

- **Mantener motivación** a largo plazo
- **Ver progreso visual** de sus esfuerzos
- **Competir consigo mismos** para mejorar
- **Construir rutinas** sostenibles
- **Transformar hábitos aburridos** en una aventura épica

---

## 🚀 **¡EMPIEZA TU VIAJE DE GAMIFICACIÓN HOY MISMO!**

**GAMIZKY está 100% funcional y listo para transformar tus hábitos en una aventura épica.** 

¿Qué hábito quieres gamificar primero? 🎮✨
