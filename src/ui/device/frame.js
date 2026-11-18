// Marco del teléfono: una sola estructura; el CSS le da forma de Android, iPhone o sencilla.
// El panel de decisiones (dock) va dentro del teléfono, siempre visible.
import { icon } from '../icons.js';
import { esc } from '../html.js';

function statusBar(os, clock) {
  if (os === 'simple' || os === 'neutral') return '';
  return `
    <div class="statusbar" aria-hidden="true">
      <span class="statusbar__time">${esc(clock)}</span>
      <span class="statusbar__notch"></span>
      <span class="statusbar__icons">${icon.signal(15)}${icon.wifi(16)}${icon.battery(15)}</span>
    </div>`;
}

const navBar = (os) => (os === 'android' || os === 'ios' ? '<div class="navbar" aria-hidden="true"><span></span></div>' : '');

export function deviceFrame({ os, surface, clock, label, screen, dock }) {
  return `
    <section class="device" data-os="${os}" aria-label="${esc(label)}">
      <div class="device__screen" data-surface="${surface}">
        ${statusBar(os, clock)}
        <div class="device__view">${screen}</div>
        ${dock}
        ${navBar(os)}
        <p class="device__toast" role="status" aria-live="polite" hidden></p>
      </div>
    </section>`;
}
