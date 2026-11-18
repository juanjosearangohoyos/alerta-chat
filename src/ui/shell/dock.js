// Panel de decisiones de ALERTA CHAT, dentro del teléfono y en el lugar de la barra de escribir.
// La persona nunca escribe: solo elige entre 2 o 3 opciones (máximo 3).
// - Respuesta (`say`): se muestra como mensaje enviado en el chat.
// - Acción (`label`): llamar, bloquear, transferir, etc.
// Las opciones que ya se eligieron en visitas anteriores llevan "Ya elegida" (no se bloquean).
import { esc } from '../html.js';
import { icon } from '../icons.js';
import { progress } from '../../engine/progress.js';

const done = (on) => (on ? `<span class="ac-btn__done">${icon.check(18)}Ya elegida</span>` : '');

function choiceButton(c, markable) {
  const chosen = markable && progress.hasDecided(c.id);
  if (c.say) {
    return `
      <button type="button" class="ac-btn ac-btn--reply" data-action="go" data-id="${esc(c.id)}" data-to="${esc(c.to)}" data-say="${esc(c.say)}">
        <span class="ac-btn__icon">${icon.reply(24)}</span>
        <span class="ac-btn__label"><span class="ac-btn__tag">Responder</span>${esc(c.say)}${done(chosen)}</span>
      </button>`;
  }
  return `
    <button type="button" class="ac-btn ac-btn--act" data-id="${esc(c.id)}" data-action="${c.action ?? 'go'}" ${c.to ? `data-to="${esc(c.to)}"` : ''} ${c.kind ? `data-kind="${c.kind}"` : ''}>
      <span class="ac-btn__icon">${icon[c.icon ?? 'chevronRight'](24)}</span>
      <span class="ac-btn__label">${esc(c.label)}${done(chosen)}</span>
    </button>`;
}

export function dock(node) {
  const hasContent = node.guide || node.prompt || node.choices || node.next || node.pending;
  if (!hasContent) return '';
  // Solo las decisiones de una historia se marcan (no los botones de resultados, recorrido o cierre).
  const markable = ['whatsapp', 'messenger', 'sms'].includes(node.app) && node.view !== 'outcome';

  const guide = node.guide ? `<p class="dock__guide" data-focus tabindex="-1">${esc(node.guide)}</p>` : '';
  const prompt = node.prompt ? `<h2 class="dock__prompt" ${node.guide ? '' : 'data-focus'} tabindex="-1">${esc(node.prompt)}</h2>` : '';
  const choices = node.choices ? `<div class="dock__choices">${node.choices.map((c) => choiceButton(c, markable)).join('')}</div>` : '';
  const next = node.next
    ? `<button type="button" class="ac-btn ac-btn--primary" data-action="go" data-to="${esc(node.next.to)}" ${!node.guide && !node.prompt ? 'data-focus' : ''}><span class="ac-btn__label">${esc(node.next.label)}</span>${icon.chevronRight(24)}</button>`
    : '';
  const pending = node.pending
    ? `<button type="button" class="ac-btn ac-btn--primary" data-action="back">${icon.chevronBack(24)}<span class="ac-btn__label">Volver a la decisión</span></button>`
    : '';

  return `
    <div class="dock" data-surface="${esc(node.view)}">
      <div class="dock__body">${guide}${prompt}${choices}${next}${pending}</div>
      <div class="dock__wait" aria-hidden="true">
        <span class="typing-dots"><span></span><span></span><span></span></span>
        <span>Llegando mensajes…</span>
        <button type="button" class="dock__skip" data-action="show-all">Mostrar todos</button>
      </div>
    </div>`;
}
