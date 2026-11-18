// "Salir / Ayuda" (antes G05): pausa, consejos, tamaño de letra, mensajes sin animación,
// cambiar de celular sin perder el progreso, y salir.
import { esc } from '../html.js';
import { OS_LABEL } from '../device/os-traits.js';

const toggle = (action, value, current, label) =>
  `<button type="button" class="ac-btn ac-btn--compact" data-action="${action}" data-value="${value}" ${current ? 'aria-pressed="true"' : ''}><span class="ac-btn__label">${esc(label)}</span></button>`;

export function pauseMenu({ os, prefs, hasOs, inChat }) {
  const osSection = hasOs
    ? `
    <section class="pause__block" aria-labelledby="pause-os">
      <h3 id="pause-os">Cambiar celular</h3>
      <p>Ahora se ve como: <strong>${esc(OS_LABEL[os])}</strong>. Si lo cambia, sigue en el mismo punto.</p>
      <div class="pause__row">
        ${['android', 'ios', 'simple'].map((o) => toggle('pause-os', o, o === os, OS_LABEL[o])).join('')}
      </div>
    </section>`
    : '';

  return `
    <div class="pause__inner">
      <h2 id="pause-title" class="pause__title" tabindex="-1">Pausa</h2>
      <p class="pause__lead">Nada se perdió. Puede seguir cuando quiera.</p>

      <section class="pause__block pause__block--tips" aria-labelledby="pause-tips">
        <h3 id="pause-tips">Si duda de un mensaje en la vida real</h3>
        <ul>
          <li>No responda ni toque enlaces.</li>
          <li>Llame usted a un número que ya conozca.</li>
          <li>Pida ayuda a alguien de confianza.</li>
        </ul>
        <p class="motto">Detente · Revisa · Verifica</p>
      </section>

      <section class="pause__block" aria-labelledby="pause-text">
        <h3 id="pause-text">Tamaño de la letra</h3>
        <div class="pause__row">
          ${toggle('pref-text', 'normal', prefs.text === 'normal', 'Normal')}
          ${toggle('pref-text', 'large', prefs.text === 'large', 'Más grande')}
        </div>
      </section>

      <section class="pause__block" aria-labelledby="pause-motion">
        <h3 id="pause-motion">Cómo llegan los mensajes</h3>
        <div class="pause__row">
          ${toggle('pref-motion', 'step', prefs.motion === 'step', 'De uno en uno')}
          ${toggle('pref-motion', 'instant', prefs.motion === 'instant', 'Todos de inmediato')}
        </div>
      </section>

      ${osSection}

      <div class="pause__actions">
        <button type="button" class="ac-btn ac-btn--primary" data-action="pause-close"><span class="ac-btn__label">Continuar practicando</span></button>
        ${hasOs ? (inChat ? `<button type="button" class="ac-btn ac-btn--act" data-action="ask" data-kind="switch"><span class="ac-btn__label">Elegir otra aplicación</span></button>` : `<button type="button" class="ac-btn ac-btn--act" data-action="pause-go" data-to="G03"><span class="ac-btn__label">Elegir otra aplicación</span></button>`) : ''}
        <button type="button" class="ac-btn ac-btn--act" data-action="pause-go" data-to="T01"><span class="ac-btn__label">Mi recorrido</span></button>
        <button type="button" class="ac-btn ac-btn--act" data-action="ask" data-kind="finish"><span class="ac-btn__label">Finalizar simulación</span></button>
      </div>
    </div>`;
}

// Confirmación explícita antes de finalizar o de reiniciar el progreso.
const CONFIRM = {
  switch: ['¿Desea salir de esta conversación?', 'Podrá volver a practicarla cuando quiera. Su recorrido se conserva.', 'Sí, elegir otra aplicación'],
  finish: ['¿Desea finalizar la simulación?', 'Verá la pantalla final. Su recorrido no se borra y no tiene que completar las tres aplicaciones.', 'Sí, finalizar'],
  reset: ['¿Desea reiniciar su progreso?', 'Se borrarán los desenlaces y las decisiones que ya exploró en este navegador. Esto no se puede deshacer.', 'Sí, reiniciar mi progreso'],
};

export function confirmMenu(kind) {
  const [title, text, yes] = CONFIRM[kind];
  return `
    <div class="pause__inner">
      <h2 id="pause-title" class="pause__title" tabindex="-1">${esc(title)}</h2>
      <p class="pause__lead">${esc(text)}</p>
      <div class="pause__actions">
        <button type="button" class="ac-btn ac-btn--primary" data-action="confirm-no"><span class="ac-btn__label">No, volver</span></button>
        <button type="button" class="ac-btn ac-btn--act" data-action="confirm-yes" data-kind="${kind}"><span class="ac-btn__label">${esc(yes)}</span></button>
      </div>
    </div>`;
}
