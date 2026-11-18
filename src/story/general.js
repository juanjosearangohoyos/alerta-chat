// Inicio en cuatro pasos: BIENVENIDA → CELULAR → APLICACIÓN → (introducción breve) → CONVERSACIÓN.
// La capa ALERTA CHAT trata a la persona de «usted».

export const general = {
  P00: {
    view: 'welcome',
    next: { label: 'Comenzar', to: 'P01' },
  },

  P01: {
    view: 'device-choice',
    then: 'G03',
    osChoices: [
      { os: 'android', label: 'Android' },
      { os: 'ios', label: 'iPhone' },
      { os: 'simple', label: 'No estoy seguro' },
    ],
  },

  G03: {
    view: 'apps',
    apps: [
      { app: 'whatsapp', label: 'WhatsApp', to: 'W00' },
      { app: 'messenger', label: 'Messenger de Facebook', to: 'M00' },
      { app: 'sms', label: 'Mensajes de texto (SMS)', to: 'S00' },
    ],
  },

  // Pantalla final («Lo que aprendimos juntos»): el texto está en views/alerta-pages.js (finalView).
  G06: {
    view: 'final',
    prompt: '¿Qué desea hacer?',
    choices: [
      { label: 'Seguir practicando', icon: 'apps', to: 'G03' },
      { label: 'Ver mi recorrido', icon: 'eye', to: 'T01' },
      { label: 'Volver al inicio', icon: 'home', to: 'P00' },
    ],
  },

  T02: {
    view: 'team',
    next: { label: 'Volver a la bienvenida', to: 'P00' },
  },

  T01: {
    view: 'tracker',
    choices: [
      { label: 'Seguir practicando', icon: 'apps', to: 'G03' },
      { label: 'Finalizar simulación', icon: 'shieldCheck', action: 'ask', kind: 'finish' },
      { label: 'Reiniciar mi progreso', icon: 'trash', action: 'ask', kind: 'reset' },
    ],
  },
};
