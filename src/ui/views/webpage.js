// Páginas fuera del chat, siempre ilustrativas (Messenger y, en la Fase 4, SMS):
// - phishing: página falsa abierta desde un enlace. Sin campos reales: todo es dibujo.
// - official: la aplicación oficial (la persona entra por su cuenta, no por el enlace).
// - system:   aviso del sistema que muestra una consecuencia simulada.
import { esc } from '../html.js';
import { icon } from '../icons.js';

const notification = (n) =>
  n
    ? `<div class="web__notif" data-inert="control"><p class="web__notif-from">${icon.chat(18)}<span>${esc(n.from)}</span></p><p class="web__notif-text">${esc(n.text)}</p></div>`
    : '';

const field = (f) => `
  <div class="web__field" data-inert="field">
    <span class="web__label">${esc(f.label)}</span>
    <span class="web__input${f.filled ? ' is-filled' : ''}">${f.filled ? '••••••••' : 'campo ilustrativo'}</span>
  </div>`;

function phishing(p) {
  return `
    <div class="web__bar" data-inert="control"><span class="web__url">${icon.warn(18)}<span>${esc(p.url)}</span></span></div>
    <div class="web__scroll">
      ${notification(p.notification)}
      <p class="web__sim">${esc(p.banner ?? 'Ilustración: no es un formulario real')}</p>
      <h1 class="web__title">${esc(p.title)}</h1>
      ${(p.lines ?? []).map((l) => `<p class="web__text">${esc(l)}</p>`).join('')}
      ${(p.fields ?? []).map(field).join('')}
      ${p.button ? `<span class="web__btn" data-inert="field">${esc(p.button)}</span>` : ''}
    </div>`;
}

function official(p) {
  return `
    <div class="web__appbar"><span>${icon.shieldCheck(22)}</span><span>${esc(p.title)}</span></div>
    <div class="web__scroll">
      ${(p.lines ?? []).map((l) => `<p class="web__row">${icon.check(20)}<span>${esc(l)}</span></p>`).join('')}
    </div>`;
}

function system(p) {
  return `
    <div class="web__scroll web__scroll--center">
      <p class="web__sim">${esc(p.banner ?? 'Consecuencia simulada')}</p>
      <span class="web__big-icon">${icon.warn(48)}</span>
      <h1 class="web__title">${esc(p.title)}</h1>
      ${(p.lines ?? []).map((l) => `<p class="web__text">${esc(l)}</p>`).join('')}
    </div>`;
}

const KINDS = { phishing, official, system };

export function webpageView(node, { os }) {
  const p = node.page;
  return `<section class="web app-skin web--${p.kind}" data-app="${node.app}" data-os="${os}">${KINDS[p.kind](p)}</section>`;
}
