// Manifiesto de nodos. Versión 2 (segunda entrega, nov. 2026):
// las historias se reescribieron sin nombres ni parentescos presupuestos (ver docs/ANALISIS_FASE_1.md §9).
// `phase` indica en qué fase se escribe cada nodo.

const general = {
  P00: 'Bienvenida',
  P01: '¿Qué celular utiliza?',
  G03: '¿Dónde quiere practicar?',
  G05: 'Salir / Ayuda',
  G06: 'Lo que aprendimos juntos',
  T01: 'Mi recorrido',
  T02: 'Nuestro equipo',
};

const whatsapp = {
  W00: 'WhatsApp · Antes de empezar',
  W01: 'WhatsApp · Llega un mensaje',
  W02: 'WhatsApp · Un número desconocido saluda',
  W03A: 'WhatsApp · Pregunta quién le escribe',
  W03B: 'WhatsApp · Dice que no tiene guardado el número',
  W04C: 'WhatsApp · Acepta ayudar después de llamar',
  W04Q: 'WhatsApp · Pide que se identifique',
  W04R: 'WhatsApp · Acepta ayudar',
  W05C: 'WhatsApp · Intenta hablar por llamada',
  W06T: 'WhatsApp · Transferencia simulada',
  W90: 'WhatsApp · Bloquea el número',
  W91: 'WhatsApp · No envía dinero',
  W92: 'WhatsApp · Se detiene después de enviar',
  W90R: 'WhatsApp · Resultado: bloqueó el número',
  W91R: 'WhatsApp · Resultado: no envió dinero',
  W92R: 'WhatsApp · Resultado: se detuvo a tiempo',
  W93R: 'WhatsApp · Resultado: envió dinero',
};

const messenger = {
  M00: 'Messenger · Antes de empezar',
  M01: 'Messenger · Solicitud de mensaje',
  M02: 'Messenger · Un perfil desconocido escribe',
  M03A: 'Messenger · Pregunta qué actividad detectaron',
  M03B: 'Messenger · Revisa el perfil',
  M03C: 'Messenger · Elimina la solicitud',
  M03R: 'Messenger · Vuelve al chat',
  M04S: 'Messenger · Propone revisar en la aplicación oficial',
  M04W: 'Messenger · Página falsa del enlace',
  M05O: 'Messenger · Revisa en la aplicación oficial',
  M05P: 'Messenger · La página pide un código',
  M05X: 'Messenger · Cierra la página',
  M06C: 'Messenger · Consecuencia: pierde la cuenta',
  M06F: 'Messenger · Cambia la contraseña',
  M91: 'Messenger · Bloquea el perfil',
  M92: 'Messenger · Bloquea tras verificar',
  M92S: 'Messenger · Responde que su cuenta está bien',
  M93: 'Messenger · Bloquea tras cerrar la página',
  M90R: 'Messenger · Resultado: eliminó la solicitud',
  M91R: 'Messenger · Resultado: bloqueó el perfil',
  M92R: 'Messenger · Resultado: verificó en la aplicación oficial',
  M93R: 'Messenger · Resultado: cerró la página a tiempo',
  M94R: 'Messenger · Resultado: perdió la cuenta',
  M95R: 'Messenger · Resultado: se detuvo antes del código',
};

const sms = {
  S00: 'SMS · Antes de empezar',
  S01: 'SMS · Llega un aviso',
  S02: 'SMS · Aviso de entrega',
  S03A: 'SMS · Página del enlace',
  S03B: 'SMS · Responde que no espera ninguna entrega',
  S03C: 'SMS · Borra y reporta el mensaje',
  S04P: 'SMS · Consecuencia: cobros no autorizados',
  S04X: 'SMS · Cierra la página',
  S04N: 'SMS · Se niega a pagar',
  S04V: 'SMS · Consulta con una persona de confianza',
  S91: 'SMS · Reporta tras responder',
  S92: 'SMS · Reporta tras cerrar la página',
  S92N: 'SMS · No responde tras cerrar la página',
  S90R: 'SMS · Resultado: borró y reportó',
  S91R: 'SMS · Resultado: no abrió ni pagó',
  S92R: 'SMS · Resultado: cerró la página a tiempo',
  S93R: 'SMS · Resultado: datos expuestos',
};

const build = (app, titles, phase) =>
  Object.fromEntries(Object.entries(titles).map(([id, title]) => [id, { app, title, phase }]));

export const MANIFEST = {
  ...build('general', general, 1),
  ...build('whatsapp', whatsapp, 2),
  ...build('messenger', messenger, 3),
  ...build('sms', sms, 4),
};

export const START = 'P00';
export const OVERLAYS = ['G05'];
// Pantallas a las que se llega desde el menú «Salir / Ayuda».
export const OVERLAY_TARGETS = ['G03', 'G06', 'P01', 'T01', 'T02'];
