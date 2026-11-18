// Lista de conversaciones: WhatsApp (W01), solicitudes de Messenger (M01) y Mensajes (S01).
// Un solo componente para las tres apps y los tres sistemas.
import { esc } from '../html.js';
import { icon } from '../icons.js';
import { avatar } from '../avatars.js';
import { LIST_TITLE, SEARCH_PLACEHOLDER, WHATSAPP_TABS } from '../device/os-traits.js';

// Los controles de la app que no forman parte de la práctica llevan data-inert:
// al tocarlos, ALERTA CHAT explica que se usan las opciones de abajo.
// En Google Mensajes (Android) los remitentes sin foto se ven como un círculo de color.
export const avatarKey = (key, app, os) => (app === 'sms' && os === 'android' && key === 'unknown' ? 'gm' : key);

const inert = (cls, inner, kind = 'control') => `<span class="${cls}" data-inert="${kind}" aria-hidden="true">${inner}</span>`;

function row(r, os, app) {
  const badge = r.unread
    ? os === 'simple'
      ? `<span class="row__badge">${r.unread} mensaje nuevo</span>`
      : `<span class="row__badge">${r.unread}</span>`
    : '';
  const inner = `
    <span class="row__avatar">${avatar(avatarKey(r.avatar, app, os), 52)}</span>
    <span class="row__body"><span class="row__name">${esc(r.name)}</span><span class="row__preview">${esc(r.preview)}</span></span>
    <span class="row__meta"><span class="row__time">${esc(r.time)}</span>${badge}</span>`;
  return r.to
    ? `<li><button type="button" class="row${r.unread ? ' is-unread' : ''}" data-action="go" data-to="${esc(r.to)}">${inner}<span class="sr-only"> (mensaje nuevo)</span></button></li>`
    : `<li><div class="row" data-inert="row">${inner}</div></li>`;
}

function header(app, os, title) {
  const t = esc(title);
  if (os === 'simple') return `<header class="lbar lbar--simple"><h1 class="lbar__title">${t}</h1></header>`;
  if (app === 'whatsapp' && os === 'android') {
    return `<header class="lbar"><h1 class="lbar__title lbar__title--brand">${t}</h1>${inert('lbar__icons', icon.camera(24) + icon.search(24) + avatar('unknown', 30))}</header>`;
  }
  if (app === 'whatsapp') {
    return `<header class="lbar lbar--large">${inert('lbar__icons lbar__icons--split', `<span class="lbar__circle">${icon.moreH(20)}</span><span>${icon.camera(24)}<span class="lbar__plus">${icon.plus(20)}</span></span>`)}<h1 class="lbar__title">${t}</h1></header>`;
  }
  if (app === 'sms' && os === 'ios') {
    return `<header class="lbar lbar--large">${inert('lbar__icons lbar__icons--split', `<span class="lbar__text">Editar</span>${icon.compose(26)}`)}<h1 class="lbar__title">${t}</h1></header>`;
  }
  if (app === 'sms') return `<header class="lbar lbar--center"><h1 class="lbar__title">${t}</h1>${inert('lbar__me lbar__icons', icon.search(24) + icon.more(24))}</header>`;
  // Messenger
  return `<header class="lbar"><h1 class="lbar__title">${t}</h1>${inert('lbar__icons', `<span class="lbar__circle">${icon.compose(20)}</span>`)}</header>`;
}

function search(app, os) {
  const ph = SEARCH_PLACEHOLDER[app]?.[os];
  return ph ? inert('lsearch', `${icon.search(20)}<span>${esc(ph)}</span>`) : '';
}

// Filtros, «Archivados» y aviso de cifrado de WhatsApp para Android (decorativos).
function whatsappExtras(app, os, where) {
  if (app !== 'whatsapp' || os !== 'android') return '';
  if (where === 'top') {
    return (
      inert('lchips', ['Todos', 'No leídos', 'Contactos', 'Grupos'].map((c, i) => `<span class="lchip${i === 0 ? ' is-on' : ''}">${c}</span>`).join('')) +
      inert('larchived', `${icon.post(22)}<span>Archivados</span>`)
    );
  }
  return inert('lnote', 'Tus mensajes personales están cifrados de extremo a extremo');
}

function fab(app, os) {
  if (os !== 'android') return '';
  if (app === 'whatsapp') return inert('lfab lfab--wa', icon.plus(26));
  if (app === 'sms') return inert('lfab lfab--gm', `${icon.chat(22)}<span>Iniciar chat</span>`);
  return '';
}

function bottom(app, os) {
  if (app === 'whatsapp' && WHATSAPP_TABS[os]) {
    return inert('ltabs', WHATSAPP_TABS[os].map((t) => `<span class="ltab${t.active ? ' is-on' : ''}">${icon[t.icon](24)}<span>${t.label}</span></span>`).join(''));
  }
  return '';
}

export function listView(node, { os }) {
  const app = node.app;
  const title = node.list.title && os !== 'simple' ? node.list.title : LIST_TITLE[app][os];
  return `
    <section class="list app-skin" data-app="${app}" data-os="${os}">
      ${header(app, os, title)}
      <div class="list__scroll">
        ${search(app, os)}
        ${whatsappExtras(app, os, 'top')}
        <ul class="lrows" role="list">${node.list.rows.map((r) => row(r, os, app)).join('')}</ul>
        ${whatsappExtras(app, os, 'bottom')}
      </div>
      ${fab(app, os)}
      ${bottom(app, os)}
    </section>`;
}
