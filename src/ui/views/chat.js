// Conversación: UN componente para WhatsApp, Messenger y Mensajes, en Android, iPhone y sencillo.
// No hay barra de escribir: en su lugar está el panel de decisiones de ALERTA CHAT (shell/dock.js).
import { esc } from '../html.js';
import { icon } from '../icons.js';
import { avatar } from '../avatars.js';
import { APP_LABEL, BACK_ICON } from '../device/os-traits.js';
import { avatarKey } from './lists.js';

const inertBox = (cls, inner) => `<span class="${cls}" data-inert="control" aria-hidden="true">${inner}</span>`;

function chatHeader(app, os, contact) {
  const back = `<button type="button" class="cbar__back" data-action="back" aria-label="Atrás">${icon[BACK_ICON[os]](26)}</button>`;
  const name = esc(contact.name);

  if (os === 'simple') {
    return `<header class="cbar cbar--simple">${back}<div class="cbar__who"><span class="cbar__app">${esc(APP_LABEL[app].simple)}</span><span class="cbar__name">Mensajes de ${name}</span></div></header>`;
  }
  if (app === 'sms' && os === 'ios') {
    return `<header class="cbar cbar--stacked">${back}<div class="cbar__center">${avatar(contact.avatar, 46)}<span class="cbar__name">${name} ${icon.chevronRight(12)}</span></div><span class="cbar__spacer"></span></header>`;
  }
  if (app === 'sms' && os === 'android') {
    return `<header class="cbar">${back}<div class="cbar__who"><span class="cbar__name">${name}</span></div>${inertBox('cbar__actions', icon.video(24) + icon.phone(22) + icon.more(22))}</header>`;
  }
  const actions =
    app === 'sms' ? icon.phone(22) + icon.more(22) : app === 'whatsapp' && os === 'android' ? icon.video(24) + icon.phone(22) + icon.more(22) : icon.video(24) + icon.phone(22);
  return `<header class="cbar">${back}${avatar(contact.avatar, 40)}<div class="cbar__who"><span class="cbar__name">${name}</span></div>${inertBox('cbar__actions', actions)}</header>`;
}

function threadTop(app, os, chat) {
  const c = chat.contact;
  if (app === 'whatsapp' && c.unsaved) {
    return `
      <div class="tcard" data-inert="control">
        ${avatar(c.avatar, 64)}
        <p class="tcard__name">${esc(c.name)}</p>
        <p class="tcard__text">No está en tus contactos</p>
        <span class="tcard__btns" aria-hidden="true"><span class="tcard__btn tcard__btn--danger">Bloquear</span><span class="tcard__btn">Agregar</span></span>
      </div>
      ${os === 'simple' ? '' : '<p class="tchip">Hoy</p>'}`;
  }
  if (app === 'messenger' && c.request) {
    return `
      <div class="tcard tcard--plain" data-inert="control">
        ${avatar(c.avatar, 72)}
        <p class="tcard__name">${esc(c.name)}</p>
        <p class="tcard__text">${esc(c.profileNote)}</p>
        <span class="tcard__btns" aria-hidden="true"><span class="tcard__btn">Ver perfil</span></span>
      </div>`;
  }
  if (app === 'sms' && chat.dateStamp) {
    const kind = os === 'ios' ? '<span class="tstamp__kind">Mensaje de texto • SMS</span>' : '';
    return `<p class="tstamp">${kind}<span>${esc(chat.dateStamp)}</span></p>`;
  }
  return '';
}

const EVENT_ICON = { call: 'missedCall', block: 'block', info: 'clock', transfer: 'money' };

function eventHtml(m) {
  const flag = m.isNew ? ' data-new' : '';
  if (m.kind === 'transfer') {
    return `
      <div class="tmoney"${flag}>
        <p class="tmoney__title">${icon.money(22)}<span>Transferencia simulada · ${esc(m.time)}</span></p>
        <p class="tmoney__text">${esc(m.text)}</p>
        <p class="tmoney__note">Simulación educativa: no se movió dinero real.</p>
      </div>`;
  }
  return `<p class="tevent tevent--${esc(m.kind)}"${flag}>${icon[EVENT_ICON[m.kind] ?? 'clock'](18)}<span>${esc(m.time)} · ${esc(m.text)}</span></p>`;
}

function messageHtml(m, i, list, { app, os, contact }) {
  if (m.from === 'event') return eventHtml(m);
  const side = m.from === 'me' ? 'me' : 'them';
  const prev = list[i - 1];
  const next = list[i + 1];
  const first = !prev || prev.from !== m.from;
  const last = !next || next.from !== m.from;
  const who = side === 'me' ? 'Usted' : contact.name;
  const flag = m.isNew ? ' data-new' : '';

  // Messenger y Mensajes muestran la hora entre grupos, no dentro de la burbuja.
  const showStamp = os !== 'simple' && app !== 'whatsapp' && (!prev || prev.time !== m.time);
  const stamp = showStamp ? `<p class="tstamp tstamp--time"${flag}>${esc(m.time)}</p>` : '';

  const link = m.link ? ` <span class="msg__link" role="link" aria-disabled="true" data-inert="link">${esc(m.link)}</span>` : '';
  const time =
    app === 'whatsapp' && os !== 'simple'
      ? `<span class="msg__time" aria-hidden="true">${esc(m.time)}${side === 'me' ? icon.doubleCheck(16) : ''}</span>`
      : '';
  const label = os === 'simple' ? `<p class="msg__who">${esc(who)} · ${esc(m.time)}</p>` : `<span class="sr-only">${esc(who)}, ${esc(m.time)}: </span>`;
  const withAvatar = (app === 'messenger' && os !== 'simple') || (app === 'sms' && os === 'android');
  const groupAvatar =
    withAvatar && side === 'them' ? `<span class="msg__avatar">${last ? avatar(avatarKey(contact.avatar, app, os), 30) : ''}</span>` : '';

  const cls = ['msg', `msg--${side}`, first && 'is-first', last && 'is-last'].filter(Boolean).join(' ');
  return `${stamp}<div class="${cls}"${flag}>${groupAvatar}<div class="msg__body">${os === 'simple' ? label : ''}<div class="msg__bubble"><p class="msg__text">${os === 'simple' ? '' : label}${esc(m.text)}${link}</p>${time}</div></div></div>`;
}

// Indicador «Escribiendo…» (lo inserta y retira app.js mientras llegan los mensajes).
export function typingHtml(app, os, contact) {
  const withAvatar = (app === 'messenger' && os !== 'simple') || (app === 'sms' && os === 'android');
  const groupAvatar = withAvatar ? `<span class="msg__avatar">${avatar(avatarKey(contact.avatar, app, os), 30)}</span>` : '';
  return `<div class="msg msg--them is-first is-last msg--typing">${groupAvatar}<div class="msg__body">${os === 'simple' ? `<p class="msg__who">${esc(contact.name)}</p>` : ''}<div class="msg__bubble"><span class="typing-dots" aria-hidden="true"><span></span><span></span><span></span></span><span class="sr-only">Escribiendo…</span></div></div></div>`;
}

export function chatView(node, { os }) {
  const app = node.app;
  const { contact, messages } = node.chat;
  const ctx = { app, os, contact };
  return `
    <section class="chat app-skin" data-app="${app}" data-os="${os}">
      ${chatHeader(app, os, contact)}
      <div class="thread" role="log" tabindex="0" aria-label="Conversación con ${esc(contact.name)}">
        ${threadTop(app, os, node.chat)}
        ${messages.map((m, i, list) => messageHtml(m, i, list, ctx)).join('')}
      </div>
    </section>`;
}
