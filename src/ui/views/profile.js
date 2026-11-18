// Perfil de Facebook visto desde Messenger (M03B). Igual para los tres sistemas.
// Muestra la información visible del perfil para que la persona la revise.
import { esc } from '../html.js';
import { icon } from '../icons.js';
import { avatar } from '../avatars.js';
import { BACK_ICON } from '../device/os-traits.js';

export function profileView(node, { os }) {
  const p = node.profile;
  const actions = (p.actions ?? [])
    .map((a, i) => `<span class="profile__btn${i === 0 ? ' profile__btn--primary' : ''}">${esc(a)}</span>`)
    .join('');
  return `
    <section class="profile app-skin" data-app="messenger" data-os="${os}">
      <header class="pbar">
        <button type="button" class="pbar__back" data-action="back" aria-label="Atrás">${icon[BACK_ICON[os]](26)}</button>
        <span class="pbar__title">${esc(p.name)}</span>
        <span class="pbar__icons" data-inert="control" aria-hidden="true">${icon.search(22)}</span>
      </header>
      <div class="profile__scroll">
        <div class="profile__cover" aria-hidden="true"></div>
        <div class="profile__id">
          ${avatar(p.avatar, 120)}
          <h1 class="profile__name">${esc(p.name)}</h1>
          <p class="profile__headline">${esc(p.headline)}</p>
          ${actions ? `<div class="profile__actions" data-inert="control" aria-hidden="true">${actions}</div>` : ''}
        </div>
        <h2 class="profile__section">Información del perfil</h2>
        <dl class="profile__facts">
          ${p.facts
            .map(
              (f) => `
            <div class="profile__fact">
              <dt>${icon[f.icon](24)}<span>${esc(f.label)}</span></dt>
              <dd>${esc(f.value)}</dd>
            </div>`,
            )
            .join('')}
        </dl>
      </div>
    </section>`;
}
