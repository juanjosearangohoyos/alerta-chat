// Íconos SVG propios. Los íconos de las apps están inspirados en los originales (forma y color reconocibles),
// dibujados por el equipo, sin logotipos oficiales. Pendiente de decisión: docs/ANALISIS_FASE_1.md §7.1.3.

const stroke = (paths, size = 24) =>
  `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;

const fill = (paths, size = 24) =>
  `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">${paths}</svg>`;

export const icon = {
  chevronBack: (s) => stroke('<path d="M15 4l-8 8 8 8"/>', s),
  chevronRight: (s) => stroke('<path d="M9 5l7 7-7 7"/>', s),
  arrowBack: (s) => stroke('<path d="M20 12H5M11 5l-7 7 7 7"/>', s),
  phone: (s) =>
    stroke('<path d="M5 3.5h3.5l2 5-2.6 1.6a11.5 11.5 0 0 0 6 6l1.6-2.6 5 2V19a2 2 0 0 1-2 2A17 17 0 0 1 3 5.5a2 2 0 0 1 2-2z"/>', s),
  video: (s) => stroke('<rect x="2.5" y="6" width="13" height="12" rx="2.5"/><path d="M15.5 10.5l6-3.5v10l-6-3.5z"/>', s),
  camera: (s) => stroke('<rect x="3" y="7" width="18" height="13" rx="2.5"/><circle cx="12" cy="13.5" r="3.5"/><path d="M8.5 7l1.6-2.5h3.8L15.5 7"/>', s),
  plus: (s) => stroke('<path d="M12 5v14M5 12h14"/>', s),
  mic: (s) => stroke('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>', s),
  smile: (s) => stroke('<circle cx="12" cy="12" r="9"/><path d="M8 14.5s1.5 2 4 2 4-2 4-2"/><path d="M9 9.5h.01M15 9.5h.01"/>', s),
  sticker: (s) => stroke('<path d="M20.5 12.5A8.5 8.5 0 1 1 11.5 3.5h9v9z"/><path d="M20.5 12.5h-5a4 4 0 0 1-4-4v-5"/>', s),
  image: (s) => stroke('<rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>', s),
  search: (s) => stroke('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/>', s),
  more: (s) => fill('<circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>', s),
  moreH: (s) => fill('<circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>', s),
  compose: (s) => stroke('<path d="M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"/><path d="M17.5 3.5l3 3L12 15H9v-3z"/>', s),
  thumb: (s) =>
    fill('<path d="M2 10h4v11H2zM8 21h9.2a2 2 0 0 0 2-1.6l1.6-7.4A2 2 0 0 0 18.8 9.5H14l.8-4.2A2 2 0 0 0 12.9 3L8 10z"/>', s),
  chat: (s) => stroke('<path d="M4 5h16v11H9l-5 4z"/>', s),
  status: (s) => stroke('<circle cx="12" cy="12" r="8.5" stroke-dasharray="4 2.5"/><circle cx="12" cy="12" r="4"/>', s),
  people: (s) => stroke('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14a6.5 6.5 0 0 1 3.5 6"/>', s),
  gear: (s) => stroke('<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>', s),
  bell: (s) => stroke('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>', s),
  place: (s) => stroke('<path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>', s),
  clock: (s) => stroke('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', s),
  photo: (s) => stroke('<rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="12" cy="11" r="3"/><path d="M7 20a5 5 0 0 1 10 0"/>', s),
  post: (s) => stroke('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>', s),
  personAdd: (s) => fill('<circle cx="10" cy="8" r="4"/><path d="M2 20a8 8 0 0 1 16 0z"/><path d="M19 7v6M16 10h6" stroke="currentColor" stroke-width="2"/>', s),
  check: (s) => stroke('<path d="M4 12.5l5 5L20 6.5"/>', s),
  doubleCheck: (s) => stroke('<path d="M2 12.5l4.5 4.5L15 8.5M10 16l1 1L21.5 6.5"/>', s),
  alert: (s) => stroke('<path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5M12 17.5h.01"/>', s),
  pause: (s) => fill('<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>', s),
  link: (s) => stroke('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>', s),
  missedCall: (s) => stroke('<path d="M3 8l5 5 4-4 6 6M18 11v4h-4"/>', s),
  play: (s) => fill('<path d="M7 4.5v15l13-7.5z"/>', s),
  skipBack: (s) => fill('<path d="M6 5h2.5v14H6zM20 5v14L9.5 12z"/>', s),
  skipForward: (s) => fill('<path d="M15.5 5H18v14h-2.5zM4 5l10.5 7L4 19z"/>', s),
  stop: (s) => fill('<rect x="6" y="6" width="12" height="12" rx="1.5"/>', s),
  speaker: (s) => stroke('<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>', s),
  external: (s) => stroke('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>', s),
  block: (s) => stroke('<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>', s),
  repeat: (s) => stroke('<path d="M4 12a8 8 0 0 1 13.7-5.7L20 8.5M20 4v4.5h-4.5"/><path d="M20 12a8 8 0 0 1-13.7 5.7L4 15.5M4 20v-4.5h4.5"/>', s),
  apps: (s) => stroke('<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>', s),
  home: (s) => stroke('<path d="M4 11l8-6.5 8 6.5V20h-5.5v-5h-5v5H4z"/>', s),
  money: (s) => stroke('<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.8"/><path d="M6 9.5v5M18 9.5v5"/>', s),
  eye: (s) => stroke('<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>', s),
  trash: (s) => stroke('<path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>', s),
  reply: (s) => stroke('<path d="M4 5h16v11H9l-5 4z"/><path d="M8.5 9.5h7M8.5 12.5h4.5"/>', s),
  shieldCheck: (s) => stroke('<path d="M12 3l8 3v6c0 5-3.4 8.6-8 9.9C7.4 20.6 4 17 4 12V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>', s),
  warn: (s) => stroke('<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5h.01"/>', s),
  // Barra de estado
  signal: (s) => fill('<rect x="2" y="15" width="3.2" height="5" rx="1"/><rect x="7.2" y="11.5" width="3.2" height="8.5" rx="1"/><rect x="12.4" y="8" width="3.2" height="12" rx="1"/><rect x="17.6" y="4.5" width="3.2" height="15.5" rx="1"/>', s),
  wifi: (s) => stroke('<path d="M2.5 9a14 14 0 0 1 19 0M5.8 12.5a9 9 0 0 1 12.4 0M9 16a4.5 4.5 0 0 1 6 0"/><circle cx="12" cy="19.2" r=".6" fill="currentColor"/>', s),
  battery: (s) =>
    `<svg class="ico" width="${(s ?? 24) * 1.25}" height="${s ?? 24}" viewBox="0 0 30 24" aria-hidden="true" focusable="false"><rect x="1.5" y="6" width="24" height="12" rx="3.5" fill="none" stroke="currentColor" stroke-width="1.6" opacity=".55"/><rect x="3.5" y="8" width="17" height="8" rx="2" fill="currentColor"/><rect x="27" y="10" width="2" height="4" rx="1" fill="currentColor" opacity=".55"/></svg>`,
};

// Logo de la capa ALERTA CHAT: burbuja azul con signo de alerta ámbar.
export const alertaLogo = (size = 40) =>
  `<svg class="ac-logo" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
    <path d="M20 3C10.1 3 2.5 9.9 2.5 18.4c0 4.7 2.3 8.8 6 11.6V37l6.6-3.6c1.5.4 3.2.6 4.9.6 9.9 0 17.5-6.9 17.5-15.6S29.9 3 20 3z" fill="#1D3D8F"/>
    <rect x="17.6" y="8.5" width="4.8" height="13" rx="2.4" fill="#F2B705"/>
    <circle cx="20" cy="26.6" r="2.7" fill="#F2B705"/>
  </svg>`;

// Íconos de las tres apps según el sistema. Forma: círculo en Android, cuadrado redondeado en iPhone.
export function appIcon(app, os, size = 64) {
  const shape =
    os === 'ios' ? (fillColor) => `<rect width="64" height="64" rx="14.5" fill="${fillColor}"/>` : (fillColor) => `<circle cx="32" cy="32" r="32" fill="${fillColor}"/>`;

  let body = '';
  if (app === 'whatsapp') {
    body =
      shape('#25D366') +
      `<path d="M32 13.5A18 18 0 0 0 16.4 40.6L14 50l9.6-2.5A18 18 0 1 0 32 13.5z" fill="none" stroke="#fff" stroke-width="3.6" stroke-linejoin="round"/>
       <path d="M25.6 24.4c.6-1.2 1.5-1.3 2.2-1.3h1.1c.4 0 .8.2 1 .8l1.5 3.7c.2.4.1.9-.2 1.3l-1.2 1.4c-.2.3-.3.7 0 1.1a12.4 12.4 0 0 0 5.6 5c.4.2.8.1 1.1-.2l1.5-1.8c.3-.4.8-.5 1.2-.3l3.5 1.7c.5.2.7.6.7 1.1-.1 1.1-.4 2.4-1.6 3.2-1.4 1-3.6 1.4-6.8-.1a22 22 0 0 1-9.6-8.9c-1.7-3.1-.6-5.6 0-6.7z" fill="#fff"/>`;
  } else if (app === 'messenger') {
    const bg =
      os === 'ios'
        ? `<defs><linearGradient id="msg-g-ios" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#0866FF"/><stop offset=".6" stop-color="#A033FF"/><stop offset="1" stop-color="#FF5C87"/></linearGradient></defs><rect width="64" height="64" rx="14.5" fill="url(#msg-g-ios)"/>`
        : `<defs><linearGradient id="msg-g-and" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#0866FF"/><stop offset=".6" stop-color="#A033FF"/><stop offset="1" stop-color="#FF5C87"/></linearGradient></defs><circle cx="32" cy="32" r="32" fill="url(#msg-g-and)"/>`;
    body =
      bg +
      `<path d="M32 13c-11 0-19.5 8.1-19.5 18.7 0 5.6 2.4 10.5 6.2 13.9V52l6.4-3.5c2.2.6 4.5.9 6.9.9 11 0 19.5-8.1 19.5-18.7S43 13 32 13z" fill="#fff"/>
       <path d="M20.5 36.5l9-9.6 4.8 4.8 8.9-4.8-9 9.6-4.8-4.8z" fill="#7B3FF2"/>`;
  } else if (app === 'sms') {
    if (os === 'android') {
      // Inspirado en Google Mensajes
      body =
        `<circle cx="32" cy="32" r="32" fill="#E8F0FE"/>` +
        `<path d="M14 18a5 5 0 0 1 5-5h26a5 5 0 0 1 5 5v19a5 5 0 0 1-5 5H26l-10 8v-8.5A5 5 0 0 1 14 37z" fill="#1A73E8"/>
         <path d="M23 24h18M23 31h12" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/>`;
    } else {
      const color = os === 'ios' ? '#34C759' : '#3D5A80';
      body =
        shape(color) +
        `<path d="M32 14c-11.6 0-21 7.5-21 16.8 0 5.2 2.9 9.8 7.5 12.9-.4 2.7-1.8 5.2-3.9 7.1 4.2 0 7.9-1.6 10.6-4.2 2.2.6 4.5.9 6.8.9 11.6 0 21-7.5 21-16.7S43.6 14 32 14z" fill="#fff"/>`;
    }
  }
  return `<svg class="app-icon" width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true" focusable="false">${body}</svg>`;
}
