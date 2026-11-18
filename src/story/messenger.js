// Facebook Messenger — Perfil desconocido que se presenta como "soporte". Grafo sin ciclos.
// Conflicto: confianza digital y robo de cuenta (contraseña y código). Sin nombres ni parentescos.
// La página del enlace es una ilustración local sin campos reales.
//
// M02 ┬ A «¿Qué tipo de actividad detectaron?» → M03A ┬ 1 abrir enlace → M04W
//     │                                               ├ 2 «Prefiero revisar desde la app oficial» → M04S
//     │                                               └ 3 revisar perfil → M03B
//     ├ B revisar perfil → M03B ┬ 1 bloquear → M91 · 2 app oficial → M05O · 3 volver al chat → M03R
//     └ C eliminar solicitud → M03C → M90R
// M03R → M04W | «Voy a revisar desde la app oficial» → M04S | bloquear → M91
// M04S → M04W | app oficial → M05O | bloquear → M91
// M05O → bloquear (M92) | «Revisé y mi cuenta está bien» (M92S) → M92R
// M04W ┬ escribir correo y contraseña → M05P ┬ escribir código → M06C → M94R
//      │                                     └ detenerme → M06F → M95R
//      └ cerrar sin escribir → M05X ┬ bloquear → M93 → M93R · app oficial → M05O

import { them, event, storyIntro, outcome } from './shared.js';

const NAME = 'Soporte de Cuentas';
const contact = {
  name: NAME,
  avatar: 'shield',
  request: true,
  profileNote: 'No son amigos en Facebook · Perfil creado hace 2 semanas',
};
const chat = (add, extra = {}) => ({ thread: 'ms', contact, add, ...extra });
const LINK = 'soporte-cuentas.invalid/verificar';

const OPEN = { label: 'Abrir el enlace', icon: 'link', to: 'M04W' };
const BLOCK = { label: 'Bloquear y reportar el perfil', icon: 'block', to: 'M91' };
const OFFICIAL = { label: 'Revisar mi cuenta desde la aplicación oficial', icon: 'shieldCheck', to: 'M05O' };
const PROMPT = '¿Qué hace?';

const closer = (to) => ({
  view: 'chat',
  clock: '9:24',
  chat: chat([event('9:24 a. m.', `Usted bloqueó y reportó a ${NAME}. Ya no puede escribirle.`, 'block')]),
  next: { label: 'Ver qué pasó', to },
});

export const messenger = {
  M00: storyIntro('M01'),

  M01: {
    view: 'chat-list',
    clock: '9:12',
    guide: 'Tiene una solicitud de mensaje de un perfil que no está entre sus contactos.',
    list: {
      title: 'Solicitudes de mensajes',
      rows: [{ name: NAME, preview: 'Aviso importante sobre su cuenta', time: '9:12 a. m.', unread: 1, avatar: 'shield', to: 'M02' }],
    },
    next: { label: 'Abrir la solicitud', to: 'M02' },
  },

  M02: {
    view: 'chat',
    clock: '9:13',
    guide: 'Lea con calma quién le escribe y qué le pide.',
    chat: chat(
      [
        them('9:12 a. m.', 'Hola. Le escribimos del equipo de soporte de cuentas.'),
        them('9:12 a. m.', 'Detectamos actividad inusual en su perfil y podría ser desactivado hoy.'),
        them('9:13 a. m.', 'Para evitarlo, confirme sus datos aquí:', { link: LINK }),
      ],
      { start: true },
    ),
    prompt: PROMPT,
    choices: [
      { say: '¿Qué tipo de actividad detectaron?', to: 'M03A' },
      { label: 'Revisar el perfil que me escribe', icon: 'eye', to: 'M03B' },
      { label: 'Ignorar y eliminar la solicitud', icon: 'trash', to: 'M03C' },
    ],
  },

  M03A: {
    view: 'chat',
    clock: '9:15',
    chat: chat([
      them('9:15 a. m.', 'Alguien intentó entrar a su cuenta desde otro país.'),
      them('9:15 a. m.', 'Por seguridad, debe confirmar que usted maneja la cuenta antes de las 6:00 p. m.'),
      them('9:15 a. m.', 'Es un trámite rápido: ingrese con su correo y su contraseña en el enlace que le enviamos.'),
    ]),
    prompt: PROMPT,
    choices: [OPEN, { say: 'Prefiero revisar desde la aplicación oficial.', to: 'M04S' }, { label: 'Revisar el perfil que me escribe', icon: 'eye', to: 'M03B' }],
  },

  M03B: {
    view: 'profile',
    clock: '9:16',
    guide: 'Revise con calma la información que muestra el perfil.',
    profile: {
      name: NAME,
      avatar: 'shield',
      headline: 'Perfil personal · No son amigos en Facebook',
      actions: ['Agregar a amigos', 'Mensaje'],
      facts: [
        { icon: 'people', label: 'Tipo de cuenta', value: 'Perfil personal, no es una página oficial' },
        { icon: 'clock', label: 'Creado', value: 'Hace 2 semanas' },
        { icon: 'people', label: 'Amigos', value: '3' },
        { icon: 'post', label: 'Publicaciones', value: 'Ninguna' },
      ],
    },
    prompt: PROMPT,
    choices: [BLOCK, OFFICIAL, { label: 'Volver al chat', icon: 'chat', to: 'M03R' }],
  },

  M03C: {
    view: 'chat',
    clock: '9:14',
    chat: chat([event('9:14 a. m.', 'Usted eliminó la solicitud de mensaje. El perfil ya no aparece en sus chats.', 'block')]),
    next: { label: 'Ver qué pasó', to: 'M90R' },
  },

  M03R: {
    view: 'chat',
    clock: '9:18',
    chat: chat([
      them('9:18 a. m.', '¿Sigue ahí? Necesitamos su confirmación hoy.'),
      them('9:18 a. m.', 'Si no confirma, su cuenta será desactivada.'),
    ]),
    prompt: PROMPT,
    choices: [OPEN, { say: 'Voy a revisar desde la aplicación oficial.', to: 'M04S' }, BLOCK],
  },

  M04S: {
    view: 'chat',
    clock: '9:19',
    chat: chat([
      them('9:19 a. m.', 'La aplicación no muestra este aviso. Por eso le escribimos por aquí.'),
      them('9:19 a. m.', 'Es más rápido confirmar en el enlace.'),
    ]),
    prompt: PROMPT,
    choices: [OPEN, OFFICIAL, BLOCK],
  },

  M05O: {
    view: 'webpage',
    clock: '9:21',
    guide: 'Usted entró por su cuenta a la aplicación oficial, sin usar el enlace.',
    page: {
      kind: 'official',
      title: 'Configuración · Seguridad',
      lines: [
        'No hay alertas de seguridad en su cuenta.',
        'Último inicio de sesión: este celular, hoy.',
        'Su cuenta está activa. No hay ningún aviso de desactivación.',
      ],
    },
    prompt: PROMPT,
    choices: [
      { label: 'Volver a Messenger y bloquear el perfil', icon: 'block', to: 'M92' },
      { say: 'Revisé en la aplicación oficial y mi cuenta está bien.', to: 'M92S' },
    ],
  },

  M04W: {
    view: 'webpage',
    clock: '9:20',
    guide: 'Se abrió una página fuera de Messenger. Mire con calma la dirección de arriba.',
    page: {
      kind: 'phishing',
      url: LINK,
      title: 'Centro de seguridad',
      lines: ['Su cuenta será desactivada hoy.', 'Confirme su identidad para evitarlo.'],
      fields: [{ label: 'Correo o teléfono' }, { label: 'Contraseña' }],
      button: 'Confirmar',
    },
    prompt: PROMPT,
    choices: [
      { label: 'Escribir mi correo y mi contraseña', icon: 'compose', to: 'M05P' },
      { label: 'Cerrar la página sin escribir nada', icon: 'arrowBack', to: 'M05X' },
    ],
  },

  M05P: {
    view: 'webpage',
    clock: '9:22',
    guide: 'La página ahora le pide el código que acaba de llegar a su celular.',
    page: {
      kind: 'phishing',
      url: LINK,
      banner: 'Ilustración: su correo y su contraseña no se enviaron a ninguna parte',
      notification: { from: 'Mensaje de texto · 87112', text: 'Su código de seguridad es 482913. No lo comparta con nadie.' },
      title: 'Último paso',
      lines: ['Le enviamos un código por mensaje de texto.', 'Escríbalo aquí para terminar la verificación.'],
      fields: [{ label: 'Correo o teléfono', filled: true }, { label: 'Código de 6 números' }],
      button: 'Verificar',
    },
    prompt: PROMPT,
    choices: [
      { label: 'Escribir el código en la página', icon: 'compose', to: 'M06C' },
      { label: 'Detenerme: el mensaje dice que no lo comparta', icon: 'warn', to: 'M06F' },
    ],
  },

  M05X: {
    view: 'chat',
    clock: '9:22',
    chat: chat([them('9:22 a. m.', '¿Ya pudo confirmar? Le quedan pocas horas.')]),
    prompt: PROMPT,
    choices: [{ label: 'Bloquear y reportar el perfil', icon: 'block', to: 'M93' }, OFFICIAL],
  },

  M06C: {
    view: 'webpage',
    clock: '9:24',
    page: {
      kind: 'system',
      banner: 'Consecuencia simulada: no pasó en su cuenta real',
      title: 'Se cerró su sesión',
      lines: ['Alguien cambió la contraseña de su cuenta y usted ya no puede entrar.', 'Desde su cuenta, esa persona podría escribirles a sus contactos.'],
    },
    next: { label: 'Ver qué pasó', to: 'M94R' },
  },

  M06F: {
    view: 'webpage',
    clock: '9:25',
    guide: 'Usted cerró la página y entró por su cuenta a la aplicación oficial.',
    page: {
      kind: 'official',
      title: 'Configuración · Contraseña',
      lines: ['Cambió su contraseña.', 'Cerró las sesiones que no reconocía.', 'No compartió el código.'],
    },
    next: { label: 'Ver qué pasó', to: 'M95R' },
  },

  M91: closer('M91R'),
  M92: closer('M92R'),
  M93: closer('M93R'),

  M92S: {
    view: 'chat',
    clock: '9:23',
    chat: chat([them('9:23 a. m.', 'Entendido.'), event('9:23 a. m.', 'El perfil eliminó la conversación.', 'info')]),
    next: { label: 'Ver qué pasó', to: 'M92R' },
  },

  // ---------- Desenlaces ----------
  M90R: outcome({
    tone: 'safe',
    heading: 'Usted eliminó la solicitud',
    happened: 'Eliminó la solicitud de un perfil que no conocía, sin responder ni abrir el enlace. No entregó ningún dato.',
    signals: ['Un perfil desconocido que dice ser "soporte".', 'Amenaza con desactivar su cuenta hoy.'],
    todo: ['Las solicitudes de perfiles desconocidos se pueden ignorar o eliminar.', 'Revise los avisos de su cuenta solo desde la aplicación oficial.'],
    restart: 'M00',
  }),

  M91R: outcome({
    tone: 'safe',
    heading: 'Usted bloqueó y reportó el perfil',
    happened: 'Bloqueó y reportó un perfil que usted no podía comprobar. No entregó contraseñas ni códigos.',
    signals: ['Un perfil nuevo que no está entre sus amistades.', 'Un plazo para asustar: "podría ser desactivado hoy".', 'Un enlace que no es de la aplicación oficial.'],
    todo: ['Bloquear y reportar también protege a otras personas.', 'No escriba contraseñas ni códigos en páginas que llegan por mensaje.'],
    restart: 'M00',
  }),

  M92R: outcome({
    tone: 'safe',
    heading: 'Usted verificó desde la aplicación oficial',
    happened: 'Entró por su cuenta a la aplicación oficial y comprobó que no había ninguna alerta ni aviso de desactivación.',
    signals: ['Un perfil nuevo que no está entre sus amistades.', 'Un plazo para asustar: "podría ser desactivado hoy".', 'Un enlace que no es de la aplicación oficial.'],
    todo: ['Para revisar su cuenta, entre usted mismo a la aplicación oficial.', 'Puede bloquear y reportar el perfil desde Messenger.'],
    restart: 'M00',
  }),

  M93R: outcome({
    tone: 'fix',
    heading: 'Usted cerró la página a tiempo',
    happened: 'Abrió el enlace, pero cerró la página sin escribir nada y bloqueó el perfil. Detenerse también es una buena decisión.',
    signals: ['La dirección no era la aplicación oficial: "soporte-cuentas.invalid".', 'La página pedía correo y contraseña.'],
    todo: ['Si abre un enlace por error, ciérrelo sin escribir nada.', 'Bloquee y reporte el perfil.'],
    restart: 'M00',
  }),

  M94R: outcome({
    tone: 'risk',
    heading: 'Otra persona tomó su cuenta en la simulación',
    happened: 'Escribió su correo, su contraseña y el código en una página falsa. En la simulación alguien cambió su contraseña y usted ya no pudo entrar. Su cuenta real no se afectó.',
    signals: ['La dirección no era la oficial: "soporte-cuentas.invalid".', 'El mensaje del código decía "No lo comparta con nadie".'],
    todo: [
      'Entre a la aplicación oficial y cambie su contraseña. Cierre las sesiones que no reconozca.',
      'Avise a sus contactos que no respondan pedidos de dinero o códigos que lleguen desde su cuenta.',
    ],
    restart: 'M00',
  }),

  M95R: outcome({
    tone: 'fix',
    heading: 'Usted se detuvo antes de entregar el código',
    happened: 'Escribió su correo y su contraseña en la página falsa, pero no compartió el código y cambió su contraseña desde la aplicación oficial.',
    signals: ['La página imitaba un centro de seguridad.', 'Pedía un código que decía que no se compartiera.'],
    todo: ['Si escribió su contraseña en una página dudosa, cámbiela de inmediato.', 'Nunca comparta códigos de verificación.'],
    restart: 'M00',
  }),
};
