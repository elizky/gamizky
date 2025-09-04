// Constantes de la aplicación GAMIZKY

// Configuración de XP
export const XP_CONFIG = {
  BASE_XP_PER_LEVEL: 200,
  XP_MULTIPLIER: 1.5,
  MIN_XP_FOR_LEVEL: 100,
} as const;

// Configuración de monedas
export const COIN_CONFIG = {
  BASE_COIN_REWARD: 25,
  BONUS_COIN_MULTIPLIER: 1.2,
  DAILY_STREAK_BONUS: 5,
} as const;

// Configuración de dificultad
export const DIFFICULTY_CONFIG = {
  EASY: { multiplier: 1.0, color: 'bg-green-500' },
  MEDIUM: { multiplier: 1.5, color: 'bg-yellow-500' },
  HARD: { multiplier: 2.0, color: 'bg-red-500' },
} as const;

// Configuración de habilidades - Framework de Crecimiento Personal
export const SKILLS = {
  PHYSICAL: 'physical',
  WISDOM: 'wisdom',
  MENTAL: 'mental',
  SOCIAL: 'social',
  CREATIVITY: 'creativity',
} as const;

// Definiciones detalladas de habilidades con arquetipos y motivaciones
export const SKILL_DEFINITIONS = {
  [SKILLS.PHYSICAL]: {
    name: 'Físico',
    icon: '💪',
    color: 'bg-blue-500',
    archetype: 'El Guerrero / La Guardiana del Cuerpo',
    tagline: 'Mi cuerpo es mi primera herramienta de batalla',
    description: 'El desarrollo del cuerpo, la salud, el movimiento y la energía vital.',
    motivations: [
      'Energía corporal: Sentirse con vitalidad para actuar',
      'Bienestar emocional: El cuerpo regula el humor, el estrés, el sueño',
      'Interdependencia mente-cuerpo: Mejorar el cuerpo mejora la mente',
      'Sensación de control: Te ves y sentís mejor, rápido',
    ],
    subcategories: [
      'Cardio',
      'Fuerza',
      'Flexibilidad',
      'Deportes',
      'Baile',
      'Caminata',
      'Descanso',
      'Hábitos saludables',
    ],
    psychological: 'Refuerza la motivación intrínseca y autoestima. Reduce ansiedad.',
    sociological: 'Contrarresta el sedentarismo social, fomenta conexión comunitaria.',
    gameDesign: 'Feedback inmediato, progresión tangible, ideal para logros de consistencia.',
    transformation: 'De sedentario a protector del templo corporal',
  },
  [SKILLS.WISDOM]: {
    name: 'Sabiduría',
    icon: '📚',
    color: 'bg-green-500',
    archetype: 'El Sabio / La Hechicera del Conocimiento',
    tagline: 'El conocimiento no me da poder. Me da libertad',
    description: 'La búsqueda activa de conocimiento, profundidad y entendimiento del mundo.',
    motivations: [
      'Curiosidad existencial: ¿Quién soy? ¿Cómo funciona esto?',
      'Necesidad de sentido: Buscar patrones, narrativas, verdades',
      'Mejorar decisiones: Saber más, decidir mejor',
      'Sentido de competencia: Dominar algo y explicarlo a otros',
    ],
    subcategories: [
      'Lectura',
      'Cursos',
      'Idiomas',
      'Investigación',
      'Escritura',
      'Documentales',
      'Podcasts',
      'Ciencia',
      'Filosofía',
      'Cultura general',
    ],
    psychological: 'Refuerza el locus de control interno, activa neuroplasticidad.',
    sociological: 'Promueve el pensamiento crítico, mejora el diálogo social.',
    gameDesign: 'Ideal para árboles de habilidades, retos de largo plazo.',
    transformation: 'De la ignorancia a la lucidez estratégica',
  },
  [SKILLS.MENTAL]: {
    name: 'Mental',
    icon: '🧠',
    color: 'bg-purple-500',
    archetype: 'El Monje / La Mente Silenciosa',
    tagline: 'Pienso. Luego respiro. Luego actúo',
    description: 'El entrenamiento de la mente: atención, concentración, reflexión, claridad.',
    motivations: [
      'Reducir ruido mental: Lograr foco y calma interior',
      'Combate a la ansiedad y la dispersión: Reunir poder interno',
      'Precisión mental: Pensar rápido, bien, sin errores',
      'Meta-cognición: Ser conscientes de cómo pensamos',
    ],
    subcategories: [
      'Meditación',
      'Mindfulness',
      'Ajedrez',
      'Rompecabezas',
      'Lógica',
      'Programación',
      'Journaling',
      'Planeamiento estratégico',
    ],
    psychological: 'Reduce ansiedad, mejora la concentración y autoobservación.',
    sociological: 'Contrarresta distracción crónica. Favorece introspección en sociedad ruidosa.',
    gameDesign: 'Compatible con sistemas de precisión, tareas de enfoque y lógica.',
    transformation: 'De la dispersión al dominio del presente',
  },
  [SKILLS.SOCIAL]: {
    name: 'Social',
    icon: '👥',
    color: 'bg-pink-500',
    archetype: 'La Tejedora de Vínculos / El Chamán Social',
    tagline: 'Los demás no son otros: son extensiones de mí',
    description: 'El desarrollo de relaciones significativas, comunicación y empatía.',
    motivations: [
      'Sentido de pertenencia: Somos seres sociales por diseño',
      'Seguridad y validación: El vínculo protege emocional y físicamente',
      'Expresión auténtica: Ser visto, escuchado, comprendido',
      'Influencia positiva: Ayudar, guiar, inspirar',
    ],
    subcategories: [
      'Amistad',
      'Pareja',
      'Networking',
      'Ayuda social',
      'Escucha activa',
      'Eventos',
      'Familia',
      'Citas',
    ],
    psychological: 'Satisface necesidad de pertenencia, reduce soledad.',
    sociological: 'Refuerza lazos humanos en la era del aislamiento digital.',
    gameDesign: 'Excelente para tareas colaborativas, logros compartidos.',
    transformation: 'De la timidez a la conexión significativa',
  },
  [SKILLS.CREATIVITY]: {
    name: 'Creatividad',
    icon: '🎨',
    color: 'bg-orange-500',
    archetype: 'La Musa del Caos / El Artista Visionario',
    tagline: 'Todo lo que veo, puede ser otra cosa',
    description: 'La capacidad de imaginar, crear, innovar y expresar tu voz única en el mundo.',
    motivations: [
      'Autoexpresión: Poner afuera lo que tenés adentro',
      'Belleza y sentido: Darle forma y alma a las ideas',
      'Solución de problemas no lineales',
      'Sentido de flujo (flow): Inmersión total en la tarea',
    ],
    subcategories: [
      'Dibujo',
      'Música',
      'Escritura',
      'Cocina',
      'Diseño',
      'Teatro',
      'Fotografía',
      'Manualidades',
      'UI',
      'Poesía',
    ],
    psychological: 'Refuerza resiliencia, canaliza emociones, promueve la fluidez.',
    sociological: 'Impulsa cultura e innovación, permite expresión única.',
    gameDesign: 'Perfecta para sistemas de crafting, personalización y logros artísticos.',
    transformation: 'De la rigidez al flujo espontáneo',
  },
} as const;

// Configuración de recurrencia
export const RECURRENCE_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
} as const;

// Configuración de categorías por defecto - Alineadas con el framework de crecimiento personal
export const DEFAULT_CATEGORIES = [
  {
    name: 'Físico',
    icon: '💪',
    color: 'bg-blue-500',
    primarySkill: SKILLS.PHYSICAL,
    description: 'El Guerrero - Mi cuerpo es mi primera herramienta de batalla',
    subcategories: [
      'Cardio',
      'Fuerza',
      'Flexibilidad',
      'Deportes',
      'Baile',
      'Caminata',
      'Descanso',
      'Hábitos saludables',
    ],
  },
  {
    name: 'Sabiduría',
    icon: '📚',
    color: 'bg-green-500',
    primarySkill: SKILLS.WISDOM,
    description: 'El Sabio - El conocimiento no me da poder. Me da libertad',
    subcategories: [
      'Lectura',
      'Cursos',
      'Idiomas',
      'Investigación',
      'Escritura',
      'Documentales',
      'Podcasts',
      'Ciencia',
      'Filosofía',
      'Cultura general',
    ],
  },
  {
    name: 'Mental',
    icon: '🧠',
    color: 'bg-purple-500',
    primarySkill: SKILLS.MENTAL,
    description: 'El Monje - Pienso. Luego respiro. Luego actúo',
    subcategories: [
      'Meditación',
      'Mindfulness',
      'Ajedrez',
      'Rompecabezas',
      'Lógica',
      'Programación',
      'Journaling',
      'Planeamiento estratégico',
    ],
  },
  {
    name: 'Social',
    icon: '👥',
    color: 'bg-pink-500',
    primarySkill: SKILLS.SOCIAL,
    description: 'La Tejedora - Los demás no son otros: son extensiones de mí',
    subcategories: [
      'Amistad',
      'Pareja',
      'Networking',
      'Ayuda social',
      'Escucha activa',
      'Eventos',
      'Familia',
      'Citas',
    ],
  },
  {
    name: 'Creatividad',
    icon: '🎨',
    color: 'bg-orange-500',
    primarySkill: SKILLS.CREATIVITY,
    description: 'La Musa - Todo lo que veo, puede ser otra cosa',
    subcategories: [
      'Dibujo',
      'Música',
      'Escritura',
      'Cocina',
      'Diseño',
      'Teatro',
      'Fotografía',
      'Manualidades',
      'UI',
      'Poesía',
    ],
  },
] as const;

// Configuración de personajes
export const CHARACTERS = [
  {
    name: 'Guerrero',
    avatar: '⚔️',
    cost: 0,
    unlocked: true,
    description: 'Un valiente guerrero que lucha por sus objetivos',
  },
  {
    name: 'Mago',
    avatar: '🔮',
    cost: 100,
    unlocked: false,
    description: 'Un sabio mago que domina el conocimiento',
  },
  {
    name: 'Arquero',
    avatar: '🏹',
    cost: 150,
    unlocked: false,
    description: 'Un hábil arquero que apunta a la excelencia',
  },
  {
    name: 'Druida',
    avatar: '🌿',
    cost: 200,
    unlocked: false,
    description: 'Un druida conectado con la naturaleza y la sabiduría',
  },
] as const;

// Configuración de la aplicación
export const APP_CONFIG = {
  NAME: 'GAMIZKY',
  VERSION: '1.0.0',
  DESCRIPTION: 'Gamificación Personal para Productividad',
  AUTHOR: 'Izky',
  WEBSITE: 'https://gamizky.com',
} as const;
