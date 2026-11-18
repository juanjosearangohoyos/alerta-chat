// WhatsApp — Posible suplantación de identidad. Grafo sin ciclos: cada decisión avanza la historia.
// Un número que la persona no tiene guardado escribe como si la conociera. No se presuponen nombres,
// parentescos ni relaciones. Un solo pedido de dinero y una sola cuenta; si hay transferencia, la ruta se cierra.
//
// W00 → W01 → W02 ┬ A «Buenas, disculpe, ¿quién me escribe?» → W03A ┬ ayudar → W04R · saber quién es → W04Q · bloquear → W90
//                 ├ B «No tengo guardado este número…» → W03B ┬ ayudar → W04R · «no envío nada si no sé quién es» → W04Q · bloquear → W90
//                 └ C bloquear → W90 → W90R
// W04Q ┬ ayudar → W04R · llamar → W05C ┬ no enviar → W91 → W91R · ayudar → W04C · bloquear → W90 │ bloquear → W90
// W04R / W04C (W04C recuerda la llamada) ┬ transferir → W06T → W93R · no enviar → W92 → W92R

import { them, event, storyIntro, outcome } from './shared.js';

const NUMBER = '+57 322 555 0187';
const MONEY = '$350.000 COP';
const contact = { name: NUMBER, avatar: 'p1', unsaved: true };
const chat = (add, extra = {}) => ({ thread: 'wa', contact, add, ...extra });
const BLOCK = { label: 'Dejar de responder y bloquear el número', icon: 'block', to: 'W90' };
const PROMPT = '¿Qué hace?';

export const whatsapp = {
  W00: storyIntro('W01'),

  W01: {
    view: 'chat-list',
    clock: '10:38',
    guide: 'Le llegó un mensaje nuevo. Ábralo para leerlo.',
    list: {
      rows: [{ name: NUMBER, preview: 'Hola, buenos días. ¿Cómo ha estado?', time: '10:38', unread: 1, avatar: 'p1', to: 'W02' }],
    },
    next: { label: 'Abrir el mensaje', to: 'W02' },
  },

  W02: {
    view: 'chat',
    clock: '10:38',
    guide: 'Le escribe un número que usted no tiene guardado. Lea con calma.',
    chat: chat(
      [
        them('10:38', 'Hola, buenos días. ¿Cómo ha estado?'),
        them('10:38', 'Le escribo desde este número nuevo porque el otro se me dañó.'),
        them('10:39', '¿Sí sabe quién le habla? 😊'),
      ],
      { start: true },
    ),
    prompt: '¿Cómo responde?',
    choices: [
      { say: 'Buenas, disculpe, ¿quién me escribe?', to: 'W03A' },
      { say: 'Buenos días. No tengo guardado este número. ¿Quién habla?', to: 'W03B' },
      { label: 'No responder y bloquear el número', icon: 'block', to: 'W90' },
    ],
  },

  W03A: {
    view: 'chat',
    clock: '10:41',
    chat: chat([
      them('10:41', 'Jajaja, ¿no me reconoce? Mire bien la foto.'),
      them('10:41', 'Bueno, después le cuento. Ahora estoy en un apuro: tengo que pagar hoy una cuota y la aplicación del banco no me deja hacer transferencias.'),
      them('10:42', `¿Me puede prestar ${MONEY}? Mañana mismo se los devuelvo.`),
    ]),
    prompt: PROMPT,
    choices: [
      { say: 'Bueno, le ayudo. ¿A qué cuenta se los mando?', to: 'W04R' },
      { say: 'Antes de ayudar, necesito saber quién es.', to: 'W04Q' },
      BLOCK,
    ],
  },

  // Responde a "No tengo guardado este número": no da explicaciones y pasa directo al apuro.
  W03B: {
    view: 'chat',
    clock: '10:41',
    chat: chat([
      them('10:41', 'Ahora no puedo explicarle bien, estoy contra el tiempo.'),
      them('10:41', 'Tengo que pagar hoy una cuota y el banco no me deja hacer la transferencia desde la aplicación.'),
      them('10:42', `Si me presta ${MONEY}, se los devuelvo mañana sin falta.`),
    ]),
    prompt: PROMPT,
    choices: [
      { say: 'Está bien, le ayudo. ¿A qué cuenta se los mando?', to: 'W04R' },
      { say: 'No le voy a enviar nada si no sé quién es.', to: 'W04Q' },
      BLOCK,
    ],
  },

  W04Q: {
    view: 'chat',
    clock: '10:43',
    chat: chat([
      them('10:43', '¿Cómo así? ¿Ahora desconfía de mí? 😔'),
      them('10:43', 'No tengo tiempo de explicarle, el banco cierra a las 12.'),
      them('10:44', 'Ayúdeme y más tarde hablamos con calma.'),
    ]),
    prompt: PROMPT,
    choices: [
      { say: 'Bueno, si es tan urgente, le ayudo. ¿A qué cuenta?', to: 'W04R' },
      { label: 'Llamar a ese número para confirmar quién es', icon: 'phone', to: 'W05C' },
      BLOCK,
    ],
  },

  W05C: {
    view: 'chat',
    clock: '10:45',
    chat: chat([
      event('10:45', 'Intento de llamada de voz · sin respuesta', 'call'),
      them('10:45', 'No puedo contestar, estoy en una reunión.'),
      them('10:45', 'Escríbame solo por aquí, por favor. Es urgente.'),
    ]),
    prompt: PROMPT,
    choices: [
      { say: 'Si no sé quién es, no le voy a enviar dinero.', to: 'W91' },
      { say: 'Está bien. Dígame a qué cuenta los envío.', to: 'W04C' },
      BLOCK,
    ],
  },

  W04R: {
    view: 'chat',
    clock: '10:46',
    chat: chat([
      them('10:46', '¡Mil gracias! Mándelos a la cuenta de Banco Ceiba, ahorros 000-555-0199, a nombre de otra persona.'),
      them('10:47', 'Cuando lo haga, mándeme el pantallazo, por favor.'),
    ]),
    prompt: PROMPT,
    choices: [
      { label: `Hacer la transferencia de ${MONEY}`, icon: 'money', to: 'W06T' },
      { say: 'Espere. No voy a enviar nada hasta saber quién es usted.', to: 'W92' },
    ],
  },

  // Después del intento de llamada: recuerda que no contestó y no repite el pedido de verificación.
  W04C: {
    view: 'chat',
    clock: '10:46',
    chat: chat([
      them('10:46', 'Gracias por entender, y disculpe que no pude contestar la llamada.'),
      them('10:46', 'Mándelos a la cuenta de Banco Ceiba, ahorros 000-555-0199, a nombre de otra persona.'),
      them('10:47', 'Cuando lo haga, mándeme el pantallazo.'),
    ]),
    prompt: PROMPT,
    choices: [
      { label: `Hacer la transferencia de ${MONEY}`, icon: 'money', to: 'W06T' },
      { say: 'Prefiero no enviar nada hasta hablar con usted por teléfono.', to: 'W92' },
    ],
  },

  W06T: {
    view: 'chat',
    clock: '10:49',
    chat: chat([
      event('10:48', `${MONEY} a Banco Ceiba · Ahorros 000-555-0199`, 'transfer'),
      them('10:49', 'Listo, mil gracias 🙏'),
      them('10:49', 'Mañana le devuelvo todo.'),
      event('Al día siguiente', 'El número no responde y ya no tiene foto de perfil.', 'info'),
    ]),
    next: { label: 'Ver qué pasó', to: 'W93R' },
  },

  // ---------- Cierres de la conversación ----------
  W90: {
    view: 'chat',
    clock: '10:46',
    chat: chat([event('10:46', `Usted bloqueó a ${NUMBER}. Ya no puede escribirle.`, 'block')]),
    next: { label: 'Ver qué pasó', to: 'W90R' },
  },

  W91: {
    view: 'chat',
    clock: '10:47',
    chat: chat([them('10:47', 'Qué desconfianza… Bueno, no importa.'), event('10:48', 'El número dejó de escribir.', 'info')]),
    next: { label: 'Ver qué pasó', to: 'W91R' },
  },

  W92: {
    view: 'chat',
    clock: '10:50',
    chat: chat([them('10:50', '¿Cómo así? Entonces le pido el favor a otra persona.'), event('10:51', 'El número dejó de responder.', 'info')]),
    next: { label: 'Ver qué pasó', to: 'W92R' },
  },

  // ---------- Desenlaces ----------
  W90R: outcome({
    tone: 'safe',
    heading: 'Usted bloqueó el número',
    happened: 'Un número que usted no tenía guardado le escribió sin decir quién era, y usted decidió bloquearlo. Así evitó seguir una conversación que no podía comprobar.',
    signals: ['Un número que usted no tiene guardado.', 'Preguntó "¿Sí sabe quién le habla?" sin identificarse.'],
    todo: [
      'Si alguien dice que cambió de número, confírmelo llamando al que usted ya conocía.',
      'Puede bloquear y reportar un número desde los datos del chat de WhatsApp.',
    ],
    restart: 'W00',
  }),

  W91R: outcome({
    tone: 'safe',
    heading: 'Usted no envió dinero',
    happened: 'Intentó llamar y nadie contestó. Como no pudo comprobar quién escribía, decidió no enviar dinero.',
    signals: ['Un número no guardado que nunca dijo su nombre.', 'Pidió dinero con prisa: "tengo que pagar hoy".', 'No contestó la llamada y pidió seguir solo por chat.'],
    todo: ['No envíe dinero a quien no pueda identificar.', 'Para confirmar, llame a un número que usted ya tenía, no al que le escribe.'],
    restart: 'W00',
  }),

  W92R: outcome({
    tone: 'fix',
    heading: 'Usted se detuvo antes de enviar dinero',
    happened: 'Aceptó ayudar y recibió los datos de una cuenta, pero se detuvo antes de transferir. En la simulación no se envió dinero.',
    signals: ['Nunca dijo quién era.', 'La cuenta estaba a nombre de otra persona.', 'Pidió el dinero con prisa.'],
    todo: ['Detenerse a tiempo también es una buena decisión.', 'Antes de pagar, confirme llamando a un número que ya tenga guardado.'],
    restart: 'W00',
  }),

  W93R: outcome({
    tone: 'risk',
    heading: 'Usted envió $350.000 COP en la simulación',
    happened: 'Transfirió $350.000 COP a una cuenta a nombre de otra persona sin saber quién escribía, y después el número dejó de responder. Fue una simulación: no se movió dinero real.',
    signals: ['Nunca dijo quién era.', 'Pidió el dinero con prisa.', 'La cuenta no era de quien escribía.'],
    todo: [
      'Si le pasa en la vida real, llame ya a la línea oficial de su banco, que está en el respaldo de su tarjeta.',
      'Guarde los pantallazos y denuncie ante la Policía Nacional.',
      'La próxima vez, confirme por un número que ya conocía antes de enviar dinero.',
    ],
    restart: 'W00',
  }),
};
