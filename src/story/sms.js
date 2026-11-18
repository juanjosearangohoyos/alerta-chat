// SMS — Aviso sospechoso de entrega. Grafo sin ciclos. No presupone una compra: la persona puede decir
// "No estoy esperando ninguna entrega". En iPhone se dibuja como Mensajes de Apple; en Android, como Google Mensajes.
// El enlace abre una página educativa local, sin campos reales.
//
// S02 ┬ A abrir enlace → S03A ┬ 1 escribir datos → S04P → S93R
//     │                       └ 2 cerrar → S04X ┬ borrar y reportar → S92 → S92R · no responder → S92N → S92R
//     ├ B «No estoy esperando ninguna entrega.» → S03B ┬ abrir enlace → S03A
//     │                                                ├ consultar a alguien de confianza → S04V ┬ reportar → S91
//     │                                                │                                         └ «No voy a pagar» → S04N → S91R
//     │                                                └ reportar → S91 → S91R
//     └ C borrar y reportar → S03C → S90R

import { them, event, storyIntro, outcome } from './shared.js';

const SENDER = '87648';
const contact = { name: SENDER, avatar: 'unknown', unsaved: true };
const LINK = 'https://entregas-co.invalid/reprogramar';
const FEE = '$4.900 COP';
const chat = (add, extra = {}) => ({ thread: 'sms', contact, dateStamp: 'Hoy 6:40 p. m.', add, ...extra });
const PROMPT = '¿Qué hace?';
const REPORT = { label: 'Borrar el mensaje y reportarlo como no deseado', icon: 'trash' };

const closer = (clock, text, next) => ({
  view: 'chat',
  clock,
  chat: chat([event(`${clock} p. m.`, text, 'block')]),
  next: { label: 'Ver qué pasó', to: next },
});

export const sms = {
  S00: storyIntro('S01'),

  S01: {
    view: 'chat-list',
    clock: '6:40',
    guide: 'Le llegó un mensaje de texto de un número corto que no conoce.',
    list: {
      rows: [{ name: SENDER, preview: 'Aviso de entrega. Su paquete no pudo ser entregado…', time: '6:40 p. m.', unread: 1, avatar: 'unknown', to: 'S02' }],
    },
    next: { label: 'Abrir el mensaje', to: 'S02' },
  },

  S02: {
    view: 'chat',
    clock: '6:41',
    guide: 'Lea el mensaje con calma.',
    chat: chat(
      [
        them('6:40 p. m.', 'Aviso de entrega. Su paquete no pudo ser entregado porque la dirección está incompleta.'),
        them('6:40 p. m.', 'Actualice sus datos para reprogramar la entrega:', { link: LINK }),
        them('6:41 p. m.', 'Si no actualiza hoy, el paquete será devuelto.'),
      ],
      { start: true },
    ),
    prompt: PROMPT,
    choices: [
      { label: 'Abrir el enlace', icon: 'link', to: 'S03A' },
      { say: 'No estoy esperando ninguna entrega.', to: 'S03B' },
      { ...REPORT, to: 'S03C' },
    ],
  },

  S03A: {
    view: 'webpage',
    clock: '6:43',
    guide: 'Se abrió una página que usted no conoce. Mire la dirección y lo que le pide.',
    page: {
      kind: 'phishing',
      url: 'entregas-co.invalid/reprogramar',
      title: 'Reprogramar entrega',
      lines: ['Su paquete está retenido.', `Para reprogramarlo, pague el costo de reenvío: ${FEE}.`],
      fields: [{ label: 'Nombre completo' }, { label: 'Dirección' }, { label: 'Número de tarjeta' }],
      button: `Pagar ${FEE}`,
    },
    prompt: PROMPT,
    choices: [
      { label: 'Escribir mis datos y pagar', icon: 'compose', to: 'S04P' },
      { label: 'Cerrar la página sin escribir nada', icon: 'arrowBack', to: 'S04X' },
    ],
  },

  S03B: {
    view: 'chat',
    clock: '6:44',
    chat: chat([
      them('6:44 p. m.', 'Su número aparece como destinatario. Puede ser un envío a su nombre.'),
      them('6:44 p. m.', `Para recibirlo, solo pague el reenvío de ${FEE} en el enlace.`),
    ]),
    prompt: PROMPT,
    choices: [
      { label: 'Abrir el enlace', icon: 'link', to: 'S03A' },
      { label: 'Mostrarle el mensaje a una persona de confianza antes de hacer algo', icon: 'people', to: 'S04V' },
      { ...REPORT, to: 'S91' },
    ],
  },

  S03C: closer('6:42', 'Usted borró el mensaje y lo reportó como no deseado.', 'S90R'),

  S04V: {
    view: 'chat',
    clock: '6:47',
    chat: chat([
      event('6:47 p. m.', 'Una persona de confianza revisa el mensaje con usted: no dice de qué empresa es, usted no espera ningún paquete y el enlace no es de una empresa conocida.', 'info'),
    ]),
    prompt: PROMPT,
    choices: [{ ...REPORT, to: 'S91' }, { say: 'No voy a pagar nada. Gracias.', to: 'S04N' }],
  },

  S04N: {
    view: 'chat',
    clock: '6:46',
    chat: chat([them('6:46 p. m.', 'Entendido. El enlace estará activo hasta hoy.'), event('Al día siguiente', 'Llega un aviso parecido desde otro número corto.', 'info')]),
    next: { label: 'Ver qué pasó', to: 'S91R' },
  },

  S04P: {
    view: 'webpage',
    clock: '6:58',
    page: {
      kind: 'system',
      banner: 'Consecuencia simulada: no se usó ninguna tarjeta real',
      title: 'Llegaron cobros que usted no hizo',
      lines: ['Con los datos de la tarjeta, alguien hizo compras por $890.000 COP.', 'Además, ahora tienen su nombre y su dirección.'],
    },
    next: { label: 'Ver qué pasó', to: 'S93R' },
  },

  S04X: {
    view: 'chat',
    clock: '6:50',
    chat: chat([them('6:50 p. m.', 'Último aviso. Su paquete será devuelto hoy.')]),
    prompt: PROMPT,
    choices: [{ ...REPORT, to: 'S92' }, { label: 'No responder y dejar el mensaje así', icon: 'arrowBack', to: 'S92N' }],
  },

  S91: closer('6:45', 'Usted borró el mensaje y lo reportó como no deseado.', 'S91R'),
  S92: closer('6:51', 'Usted borró el mensaje y lo reportó como no deseado.', 'S92R'),
  S92N: closer('6:51', 'Usted no respondió. El mensaje quedó sin contestar.', 'S92R'),

  // ---------- Desenlaces ----------
  S90R: outcome({
    tone: 'safe',
    heading: 'Usted borró y reportó el mensaje',
    happened: 'No abrió el enlace ni respondió a un aviso de entrega que no esperaba.',
    signals: ['Un número corto que usted no conoce.', 'Habla de un paquete sin decir qué es ni de qué empresa.', 'Un plazo: "si no actualiza hoy, el paquete será devuelto".'],
    todo: ['No abra enlaces de mensajes inesperados.', 'Si espera un paquete, revíselo escribiendo usted mismo la página de la empresa.'],
    restart: 'S00',
  }),

  S91R: outcome({
    tone: 'safe',
    heading: 'Usted no abrió el enlace ni pagó',
    happened: 'Dijo que no esperaba ninguna entrega y no pagó el supuesto "reenvío".',
    signals: ['Cambió de excusa: "su número aparece como destinatario".', `Pidió un pago pequeño de ${FEE}.`, 'Un número corto que usted no conoce.'],
    todo: ['Ante la duda, no responda: responder puede traer más mensajes parecidos.', 'Borre el mensaje y repórtelo como no deseado.'],
    restart: 'S00',
  }),

  S92R: outcome({
    tone: 'fix',
    heading: 'Usted cerró la página a tiempo',
    happened: 'Abrió el enlace, pero no escribió nada y dejó de seguir el mensaje. Detenerse también es una buena decisión.',
    signals: ['La página pedía datos de tarjeta para un pago pequeño.', 'La dirección no era de una empresa conocida: "entregas-co.invalid".'],
    todo: ['Si abre un enlace por error, ciérrelo sin escribir nada.', 'Borre el mensaje y repórtelo como no deseado.'],
    restart: 'S00',
  }),

  S93R: outcome({
    tone: 'risk',
    heading: 'Sus datos y su tarjeta quedaron expuestos en la simulación',
    happened: 'Escribió su nombre, su dirección y los datos de su tarjeta en una página que llegó por un mensaje inesperado. En la simulación alguien hizo compras por $890.000 COP. No se usó ninguna tarjeta real.',
    signals: ['El mensaje no decía qué paquete era ni de qué empresa.', 'La página pedía datos de tarjeta para un pago pequeño.'],
    todo: [
      'Llame ya a la línea oficial de su banco, que está en el respaldo de su tarjeta, para bloquearla.',
      'Guarde los pantallazos y denuncie ante la Policía Nacional.',
      'Antes de pagar algo, revise si de verdad espera un paquete.',
    ],
    restart: 'S00',
  }),
};
