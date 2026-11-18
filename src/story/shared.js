// Piezas comunes a las tres historias: introducción, mensajes, desenlaces y botones finales.
// Todos los montos se escriben "$350.000 COP" (pesos colombianos); el lector los dice en palabras.

export const them = (time, text, extra = {}) => ({ from: 'them', time, text, ...extra });
export const event = (time, text, kind = 'info') => ({ from: 'event', time, text, kind });

// Pantalla breve antes de abrir cada conversación. No revela cuál respuesta es la adecuada.
export const storyIntro = (first) => ({
  view: 'story-intro',
  next: { label: 'Iniciar conversación', to: first },
});

// Botones al terminar cualquier historia.
export const endChoices = (restart) => [
  { label: 'Volver a practicar', icon: 'repeat', to: restart },
  { label: 'Elegir otra aplicación', icon: 'apps', to: 'G03' },
  { label: 'Volver al inicio', icon: 'home', to: 'P00' },
  { label: 'Finalizar simulación', icon: 'shieldCheck', to: 'G06' },
];

// Fuentes ya documentadas en el proyecto (docs/ANALISIS_FASE_1.md, bibliografía y referentes).
export const SOURCES =
  'Recomendaciones basadas en: Federal Trade Commission (2025), alertas sobre estafas por suplantación de identidad; Instituto Nacional de Ciberseguridad de España (INCIBE), guías para personas mayores.';

// Desenlace breve: qué pasó, señales que realmente aparecieron en la ruta y qué hacer.
// Cada texto debe ser cierto en TODAS las rutas que llegan a ese desenlace (lo comprueba npm test en parte).
export const outcome = ({ tone, heading, happened, signals, todo, restart }) => ({
  view: 'outcome',
  tone,
  heading,
  happened,
  signals,
  todo,
  sources: SOURCES,
  choices: endChoices(restart),
});
