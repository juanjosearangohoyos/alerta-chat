// Franja superior de ALERTA CHAT, siempre en el mismo lugar y fuera de la ficción:
// Atrás · Simulación educativa · Salir / Ayuda.
import { icon } from '../icons.js';

export function strip({ canGoBack }) {
  return `
    <header class="strip">
      <button type="button" class="strip__btn" data-action="back" ${canGoBack ? '' : 'disabled'}>
        ${icon.chevronBack(22)}<span>Atrás</span>
      </button>
      <p class="strip__badge">${icon.alert(20)}<span>Simulación educativa</span></p>
      <button type="button" class="strip__btn" data-action="pause" aria-haspopup="dialog">
        ${icon.pause(20)}<span>Salir o finalizar</span>
      </button>
    </header>`;
}
