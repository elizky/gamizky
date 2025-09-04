/**
 * Base de datos de actividades predefinidas para gamificación
 * Cada actividad incluye XP, monedas, distribución de habilidades y nivel sugerido
 */

export interface ActivityDefinition {
  id: string;
  name: string;
  description: string;
  skill: 'physical' | 'wisdom' | 'mental' | 'social' | 'creativity';
  difficulty: 'easy' | 'medium' | 'hard';
  baseXP: number;
  estimatedDuration: number; // en minutos
  skillDistribution: Record<string, number>; // porcentajes por habilidad
  subcategory: string;
  notes?: string;
  isRecurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly';
}

export const PREDEFINED_ACTIVITIES: ActivityDefinition[] = [
  // 💪 FÍSICO
  {
    id: 'walk-daily',
    name: 'Caminar (trayectos, paseo, recado)',
    description: 'Caminar para transporte, paseo o recados diarios',
    skill: 'physical',
    difficulty: 'easy',
    baseXP: 30,
    estimatedDuration: 30,
    skillDistribution: { physical: 100 },
    subcategory: 'Caminata',
    notes: 'Challenge de pasos diarios',
    isRecurring: true,
    recurringType: 'daily'
  },
  {
    id: 'run-1k',
    name: 'Trotar / correr 1K',
    description: 'Carrera corta de 1 kilómetro',
    skill: 'physical',
    difficulty: 'easy',
    baseXP: 30,
    estimatedDuration: 10,
    skillDistribution: { physical: 100 },
    subcategory: 'Cardio',
    notes: 'Escalable según condición'
  },
  {
    id: 'run-5k',
    name: 'Trotar / correr 5K',
    description: 'Carrera media de 5 kilómetros',
    skill: 'physical',
    difficulty: 'medium',
    baseXP: 50,
    estimatedDuration: 30,
    skillDistribution: { physical: 100 },
    subcategory: 'Cardio',
    notes: 'Escalable según condición'
  },
  {
    id: 'run-10k',
    name: 'Trotar / correr 10K',
    description: 'Carrera larga de 10 kilómetros',
    skill: 'physical',
    difficulty: 'hard',
    baseXP: 75,
    estimatedDuration: 60,
    skillDistribution: { physical: 100 },
    subcategory: 'Cardio',
    notes: 'Escalable según condición'
  },
  {
    id: 'stairs',
    name: 'Subir escaleras',
    description: 'Subir escaleras en lugar de usar ascensor',
    skill: 'physical',
    difficulty: 'easy',
    baseXP: 25,
    estimatedDuration: 5,
    skillDistribution: { physical: 100 },
    subcategory: 'Cardio',
    notes: 'Microdesafío diario'
  },
  {
    id: 'stretching',
    name: 'Hacer estiramientos',
    description: 'Rutina de estiramientos y flexibilidad',
    skill: 'physical',
    difficulty: 'easy',
    baseXP: 25,
    estimatedDuration: 15,
    skillDistribution: { physical: 80, mental: 20 },
    subcategory: 'Flexibilidad',
    notes: 'Ideal para recuperación'
  },
  {
    id: 'sleep-7h',
    name: 'Dormir 7h+',
    description: 'Dormir al menos 7 horas de calidad',
    skill: 'physical',
    difficulty: 'easy',
    baseXP: 20,
    estimatedDuration: 420, // 7 horas
    skillDistribution: { physical: 70, mental: 30 },
    subcategory: 'Descanso',
    notes: 'Bienestar integral',
    isRecurring: true,
    recurringType: 'daily'
  },
  {
    id: 'water-2l',
    name: 'Beber 2L de agua',
    description: 'Consumir al menos 2 litros de agua durante el día',
    skill: 'physical',
    difficulty: 'easy',
    baseXP: 20,
    estimatedDuration: 480, // todo el día
    skillDistribution: { physical: 100 },
    subcategory: 'Hábitos saludables',
    notes: 'Hábito saludable',
    isRecurring: true,
    recurringType: 'daily'
  },
  {
    id: 'no-processed-food',
    name: 'Día sin ultraprocesados',
    description: 'Evitar alimentos ultraprocesados durante todo el día',
    skill: 'physical',
    difficulty: 'medium',
    baseXP: 50,
    estimatedDuration: 480, // todo el día
    skillDistribution: { physical: 60, mental: 40 },
    subcategory: 'Hábitos saludables',
    notes: 'Autocontrol'
  },
  {
    id: 'home-workout',
    name: 'Hacer ejercicios en casa',
    description: 'Rutina de ejercicios de 15-30 minutos en casa',
    skill: 'physical',
    difficulty: 'medium',
    baseXP: 50,
    estimatedDuration: 25,
    skillDistribution: { physical: 80, mental: 20 },
    subcategory: 'Fuerza',
    notes: '15-30min de rutina'
  },
  {
    id: 'yoga-pilates',
    name: 'Yoga o pilates',
    description: 'Sesión de yoga o pilates',
    skill: 'physical',
    difficulty: 'medium',
    baseXP: 45,
    estimatedDuration: 45,
    skillDistribution: { physical: 60, mental: 40 },
    subcategory: 'Flexibilidad',
    notes: 'Equilibrio mente-cuerpo'
  },
  {
    id: 'team-sport',
    name: 'Participar en deporte grupal',
    description: 'Participar en deporte o actividad física grupal',
    skill: 'physical',
    difficulty: 'medium',
    baseXP: 50,
    estimatedDuration: 60,
    skillDistribution: { physical: 70, social: 30 },
    subcategory: 'Deportes',
    notes: 'Depende de la intensidad'
  },
  {
    id: 'track-steps',
    name: 'Medir pasos diarios',
    description: 'Registrar y alcanzar meta de pasos diarios',
    skill: 'physical',
    difficulty: 'easy',
    baseXP: 15,
    estimatedDuration: 480, // todo el día
    skillDistribution: { physical: 100 },
    subcategory: 'Caminata',
    notes: 'Requiere seguimiento',
    isRecurring: true,
    recurringType: 'daily'
  },
  {
    id: 'sun-exposure',
    name: 'Tomar sol conscientemente',
    description: 'Exposición consciente y segura al sol',
    skill: 'physical',
    difficulty: 'easy',
    baseXP: 20,
    estimatedDuration: 20,
    skillDistribution: { physical: 60, mental: 40 },
    subcategory: 'Hábitos saludables',
    notes: 'Bienestar'
  },

  // 📚 SABIDURÍA
  {
    id: 'read-book',
    name: 'Leer libro / capítulo',
    description: 'Leer un libro o capítulo de libro',
    skill: 'wisdom',
    difficulty: 'easy',
    baseXP: 30,
    estimatedDuration: 30,
    skillDistribution: { wisdom: 100 },
    subcategory: 'Lectura',
    notes: 'Varía según longitud'
  },
  {
    id: 'educational-podcast',
    name: 'Escuchar podcast educativo',
    description: 'Escuchar podcast educativo o informativo',
    skill: 'wisdom',
    difficulty: 'easy',
    baseXP: 25,
    estimatedDuration: 30,
    skillDistribution: { wisdom: 80, mental: 20 },
    subcategory: 'Podcasts',
    notes: 'Compatible con otras tareas'
  },
  {
    id: 'documentary',
    name: 'Ver documental',
    description: 'Ver documental educativo o informativo',
    skill: 'wisdom',
    difficulty: 'medium',
    baseXP: 45,
    estimatedDuration: 60,
    skillDistribution: { wisdom: 100 },
    subcategory: 'Documentales',
    notes: 'Tiempo prolongado'
  },
  {
    id: 'online-course',
    name: 'Tomar clase online',
    description: 'Participar en clase o curso online',
    skill: 'wisdom',
    difficulty: 'medium',
    baseXP: 50,
    estimatedDuration: 60,
    skillDistribution: { wisdom: 80, mental: 20 },
    subcategory: 'Cursos',
    notes: 'Según intensidad'
  },
  {
    id: 'summary-mindmap',
    name: 'Hacer resumen / mapa mental',
    description: 'Crear resumen o mapa mental de lo aprendido',
    skill: 'wisdom',
    difficulty: 'medium',
    baseXP: 50,
    estimatedDuration: 30,
    skillDistribution: { wisdom: 60, mental: 40 },
    subcategory: 'Escritura',
    notes: 'Mejora retención'
  },
  {
    id: 'study-language',
    name: 'Estudiar idioma',
    description: 'Sesión de estudio de idioma extranjero',
    skill: 'wisdom',
    difficulty: 'medium',
    baseXP: 50,
    estimatedDuration: 30,
    skillDistribution: { wisdom: 70, mental: 30 },
    subcategory: 'Idiomas',
    notes: 'Requiere constancia'
  },
  {
    id: 'write-reflection',
    name: 'Escribir reflexión sobre aprendizaje',
    description: 'Escribir reflexión personal sobre algo aprendido',
    skill: 'wisdom',
    difficulty: 'medium',
    baseXP: 45,
    estimatedDuration: 25,
    skillDistribution: { wisdom: 60, mental: 40 },
    subcategory: 'Escritura',
    notes: 'Integra ideas'
  },
  {
    id: 'teach-others',
    name: 'Enseñar lo aprendido',
    description: 'Enseñar o explicar algo aprendido a otra persona',
    skill: 'wisdom',
    difficulty: 'hard',
    baseXP: 75,
    estimatedDuration: 30,
    skillDistribution: { wisdom: 50, social: 50 },
    subcategory: 'Escritura',
    notes: 'Requiere dominio'
  },
  {
    id: 'ted-talk',
    name: 'Ver charla TED',
    description: 'Ver charla TED o similar',
    skill: 'wisdom',
    difficulty: 'easy',
    baseXP: 25,
    estimatedDuration: 20,
    skillDistribution: { wisdom: 90, mental: 10 },
    subcategory: 'Documentales',
    notes: 'Motivacional o técnico'
  },
  {
    id: 'complete-course',
    name: 'Terminar curso',
    description: 'Completar un curso completo',
    skill: 'wisdom',
    difficulty: 'hard',
    baseXP: 100,
    estimatedDuration: 480, // curso completo
    skillDistribution: { wisdom: 100 },
    subcategory: 'Cursos',
    notes: 'Fin de challenge'
  },

  // 🧠 MENTAL
  {
    id: 'meditate-5min',
    name: 'Meditar 5 min',
    description: 'Sesión de meditación de 5 minutos',
    skill: 'mental',
    difficulty: 'easy',
    baseXP: 30,
    estimatedDuration: 5,
    skillDistribution: { mental: 100 },
    subcategory: 'Meditación',
    notes: 'Atención plena'
  },
  {
    id: 'meditate-20min',
    name: 'Meditar 20 min',
    description: 'Sesión de meditación de 20 minutos',
    skill: 'mental',
    difficulty: 'medium',
    baseXP: 45,
    estimatedDuration: 20,
    skillDistribution: { mental: 100 },
    subcategory: 'Meditación',
    notes: 'Atención plena'
  },
  {
    id: 'conscious-breathing',
    name: 'Respiración consciente',
    description: 'Ejercicio de respiración consciente',
    skill: 'mental',
    difficulty: 'easy',
    baseXP: 20,
    estimatedDuration: 5,
    skillDistribution: { mental: 100 },
    subcategory: 'Mindfulness',
    notes: 'Micro pausa'
  },
  {
    id: 'personal-journal',
    name: 'Diario personal',
    description: 'Escribir en diario personal',
    skill: 'mental',
    difficulty: 'easy',
    baseXP: 30,
    estimatedDuration: 15,
    skillDistribution: { mental: 80, creativity: 20 },
    subcategory: 'Journaling',
    notes: 'Reflexión'
  },
  {
    id: 'priority-list',
    name: 'Hacer lista prioridades',
    description: 'Crear lista de prioridades del día/semana',
    skill: 'mental',
    difficulty: 'easy',
    baseXP: 25,
    estimatedDuration: 10,
    skillDistribution: { mental: 70, wisdom: 30 },
    subcategory: 'Planeamiento estratégico',
    notes: 'Organización'
  },
  {
    id: 'weekly-planning',
    name: 'Planificar semana',
    description: 'Planificación detallada de la semana',
    skill: 'mental',
    difficulty: 'medium',
    baseXP: 50,
    estimatedDuration: 30,
    skillDistribution: { mental: 60, wisdom: 40 },
    subcategory: 'Planeamiento estratégico',
    notes: 'Gestión del tiempo'
  },
  {
    id: 'chess-strategy',
    name: 'Jugar ajedrez / estrategia',
    description: 'Jugar ajedrez o juego de estrategia',
    skill: 'mental',
    difficulty: 'medium',
    baseXP: 50,
    estimatedDuration: 30,
    skillDistribution: { mental: 100 },
    subcategory: 'Ajedrez',
    notes: 'Reto cognitivo'
  },
  {
    id: 'habit-review',
    name: 'Revisión de hábitos',
    description: 'Revisar y evaluar hábitos personales',
    skill: 'mental',
    difficulty: 'medium',
    baseXP: 40,
    estimatedDuration: 20,
    skillDistribution: { mental: 80, wisdom: 20 },
    subcategory: 'Journaling',
    notes: 'Self-audit'
  },
  {
    id: 'digital-detox',
    name: 'Desconexión digital 1h+',
    description: 'Desconectarse de dispositivos digitales por 1 hora o más',
    skill: 'mental',
    difficulty: 'medium',
    baseXP: 45,
    estimatedDuration: 60,
    skillDistribution: { mental: 70, wisdom: 30 },
    subcategory: 'Mindfulness',
    notes: 'Challenge frecuente'
  },
  {
    id: 'metacognition',
    name: 'Meta-cognición',
    description: 'Ejercicio de observación de procesos mentales',
    skill: 'mental',
    difficulty: 'hard',
    baseXP: 75,
    estimatedDuration: 30,
    skillDistribution: { mental: 100 },
    subcategory: 'Mindfulness',
    notes: 'Observación profunda'
  },

  // 👥 SOCIAL
  {
    id: 'affectionate-message',
    name: 'Enviar mensaje afectivo',
    description: 'Enviar mensaje cariñoso o de apoyo a alguien',
    skill: 'social',
    difficulty: 'easy',
    baseXP: 20,
    estimatedDuration: 5,
    skillDistribution: { social: 100 },
    subcategory: 'Amistad',
    notes: 'Iniciar hábito'
  },
  {
    id: 'call-someone',
    name: 'Llamar a alguien',
    description: 'Hacer llamada telefónica a familiar o amigo',
    skill: 'social',
    difficulty: 'easy',
    baseXP: 30,
    estimatedDuration: 15,
    skillDistribution: { social: 100 },
    subcategory: 'Amistad',
    notes: 'Varía según vínculo'
  },
  {
    id: 'talk-new-person',
    name: 'Charlar con persona nueva',
    description: 'Iniciar conversación con persona desconocida',
    skill: 'social',
    difficulty: 'medium',
    baseXP: 45,
    estimatedDuration: 20,
    skillDistribution: { social: 100 },
    subcategory: 'Networking',
    notes: 'Ampliar red'
  },
  {
    id: 'social-event',
    name: 'Participar evento social',
    description: 'Participar en evento o reunión social',
    skill: 'social',
    difficulty: 'medium',
    baseXP: 50,
    estimatedDuration: 120,
    skillDistribution: { social: 100 },
    subcategory: 'Eventos',
    notes: 'Según contexto'
  },
  {
    id: 'active-listening',
    name: 'Escuchar activamente',
    description: 'Practicar escucha activa en conversación',
    skill: 'social',
    difficulty: 'medium',
    baseXP: 40,
    estimatedDuration: 30,
    skillDistribution: { social: 90, mental: 10 },
    subcategory: 'Escucha activa',
    notes: 'Mejora empatía'
  },
  {
    id: 'ask-give-help',
    name: 'Pedir o dar ayuda',
    description: 'Pedir ayuda cuando se necesita o ofrecer ayuda',
    skill: 'social',
    difficulty: 'medium',
    baseXP: 50,
    estimatedDuration: 20,
    skillDistribution: { social: 80, wisdom: 20 },
    subcategory: 'Ayuda social',
    notes: 'Confianza'
  },
  {
    id: 'resolve-conflict',
    name: 'Resolver conflicto',
    description: 'Resolver conflicto de manera constructiva',
    skill: 'social',
    difficulty: 'hard',
    baseXP: 75,
    estimatedDuration: 45,
    skillDistribution: { social: 70, mental: 30 },
    subcategory: 'Amistad',
    notes: 'Autocontrol requerido'
  },
  {
    id: 'connect-people',
    name: 'Conectar personas',
    description: 'Presentar o conectar a dos personas',
    skill: 'social',
    difficulty: 'medium',
    baseXP: 45,
    estimatedDuration: 15,
    skillDistribution: { social: 100 },
    subcategory: 'Networking',
    notes: 'Networking real'
  },

  // 🎨 CREATIVIDAD
  {
    id: 'draw-sketch',
    name: 'Dibujar / bocetar',
    description: 'Crear dibujo o boceto artístico',
    skill: 'creativity',
    difficulty: 'easy',
    baseXP: 30,
    estimatedDuration: 20,
    skillDistribution: { creativity: 100 },
    subcategory: 'Dibujo',
    notes: 'Diario creativo'
  },
  {
    id: 'write-story-poetry',
    name: 'Escribir historia / poesía',
    description: 'Escribir historia corta, poesía o narrativa',
    skill: 'creativity',
    difficulty: 'medium',
    baseXP: 50,
    estimatedDuration: 45,
    skillDistribution: { creativity: 100 },
    subcategory: 'Escritura',
    notes: 'Narrativo'
  },
  {
    id: 'play-instrument',
    name: 'Tocar instrumento',
    description: 'Practicar con instrumento musical',
    skill: 'creativity',
    difficulty: 'medium',
    baseXP: 45,
    estimatedDuration: 30,
    skillDistribution: { creativity: 100 },
    subcategory: 'Música',
    notes: 'Práctica musical'
  },
  {
    id: 'cook-new-recipe',
    name: 'Cocinar receta nueva',
    description: 'Preparar una receta nueva o experimentar en cocina',
    skill: 'creativity',
    difficulty: 'medium',
    baseXP: 50,
    estimatedDuration: 60,
    skillDistribution: { creativity: 60, physical: 40 },
    subcategory: 'Cocina',
    notes: 'Híbrido'
  },
  {
    id: 'create-digital-content',
    name: 'Crear contenido digital',
    description: 'Crear contenido para redes sociales o digital',
    skill: 'creativity',
    difficulty: 'medium',
    baseXP: 50,
    estimatedDuration: 45,
    skillDistribution: { creativity: 80, mental: 20 },
    subcategory: 'Diseño',
    notes: 'Rápido'
  },
  {
    id: 'edit-video',
    name: 'Editar video',
    description: 'Editar video o contenido audiovisual',
    skill: 'creativity',
    difficulty: 'hard',
    baseXP: 75,
    estimatedDuration: 90,
    skillDistribution: { creativity: 60, mental: 40 },
    subcategory: 'Diseño',
    notes: 'Técnica'
  },
  {
    id: 'artistic-photo',
    name: 'Sacar foto artística',
    description: 'Tomar fotografía con enfoque artístico',
    skill: 'creativity',
    difficulty: 'easy',
    baseXP: 30,
    estimatedDuration: 20,
    skillDistribution: { creativity: 100 },
    subcategory: 'Fotografía',
    notes: 'Integrable a caminata'
  },
  {
    id: 'musical-theatrical-improv',
    name: 'Impro musical o teatral',
    description: 'Improvisación musical o teatral',
    skill: 'creativity',
    difficulty: 'medium',
    baseXP: 50,
    estimatedDuration: 30,
    skillDistribution: { creativity: 70, social: 30 },
    subcategory: 'Teatro',
    notes: 'Expresión'
  },
  {
    id: 'design-mockup',
    name: 'Diseñar mockup / cartel',
    description: 'Crear diseño de mockup, cartel o material gráfico',
    skill: 'creativity',
    difficulty: 'hard',
    baseXP: 75,
    estimatedDuration: 60,
    skillDistribution: { creativity: 80, mental: 20 },
    subcategory: 'Diseño',
    notes: 'Creatividad digital'
  },
  {
    id: 'crafts-diy',
    name: 'Manualidades / DIY',
    description: 'Crear manualidades o proyectos DIY',
    skill: 'creativity',
    difficulty: 'easy',
    baseXP: 30,
    estimatedDuration: 45,
    skillDistribution: { creativity: 100 },
    subcategory: 'Manualidades',
    notes: 'Lúdico'
  }
];

/**
 * Obtener actividades por habilidad
 */
export function getActivitiesBySkill(skill: string): ActivityDefinition[] {
  return PREDEFINED_ACTIVITIES.filter(activity => activity.skill === skill);
}

/**
 * Obtener actividades por dificultad
 */
export function getActivitiesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): ActivityDefinition[] {
  return PREDEFINED_ACTIVITIES.filter(activity => activity.difficulty === difficulty);
}

/**
 * Obtener actividades recurrentes
 */
export function getRecurringActivities(): ActivityDefinition[] {
  return PREDEFINED_ACTIVITIES.filter(activity => activity.isRecurring);
}

/**
 * Buscar actividades por nombre o descripción
 */
export function searchActivities(query: string): ActivityDefinition[] {
  const lowercaseQuery = query.toLowerCase();
  return PREDEFINED_ACTIVITIES.filter(activity => 
    activity.name.toLowerCase().includes(lowercaseQuery) ||
    activity.description.toLowerCase().includes(lowercaseQuery) ||
    activity.subcategory.toLowerCase().includes(lowercaseQuery)
  );
}

/**
 * Obtener actividad por ID
 */
export function getActivityById(id: string): ActivityDefinition | undefined {
  return PREDEFINED_ACTIVITIES.find(activity => activity.id === id);
}

/**
 * Obtener actividades sugeridas basadas en nivel de habilidad
 */
export function getSuggestedActivities(skillLevels: Record<string, number>): ActivityDefinition[] {
  return PREDEFINED_ACTIVITIES.filter(activity => {
    const skillLevel = skillLevels[activity.skill] || 1;
    
    // Sugerir actividades apropiadas para el nivel
    if (skillLevel <= 3) {
      return activity.difficulty === 'easy';
    } else if (skillLevel <= 6) {
      return activity.difficulty === 'easy' || activity.difficulty === 'medium';
    } else {
      return true; // Todos los niveles para usuarios avanzados
    }
  });
}
