// Lector de recomendaciones: lee en voz alta el texto marcado con .rd-s (una oración por marca).
// Un fragmento de audio por oración: pausar, retroceder, avanzar y cambiar la velocidad son exactos
// y el resaltado de oración nunca se basa en temporizadores. El resaltado por palabra es una mejora
// progresiva: solo aparece si el navegador envía eventos `boundary` reales.
// Para usar audios grabados más adelante, basta sustituir speak()/cancel() por un reproductor de archivos.
import { esc } from './html.js';
import { icon } from './icons.js';

const synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
export const RATES = [
  [0.7, '0,70× · Muy lenta'],
  [0.85, '0,85× · Pausada'],
  [1, '1,00× · Normal'],
  [1.15, '1,15× · Más rápida'],
  [1.25, '1,25× · Rápida'],
];
let lastRate = 1; // velocidad normal por defecto; se conserva entre desenlaces durante la visita

// ---- Cantidades en pesos colombianos: "$550.000 COP" se pronuncia en palabras (nunca "dólares") ----
const U = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
const T = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const C = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
const below1000 = (n) => {
  if (n === 100) return 'cien';
  const r = n % 100;
  const tens = r < 30 ? U[r] : `${T[Math.floor(r / 10)]}${r % 10 ? ` y ${U[r % 10]}` : ''}`;
  return [C[Math.floor(n / 100)], r ? tens : ''].filter(Boolean).join(' ');
};
const apocope = (w) => w.replace(/uno$/, 'ún'); // veintiún mil, veintiún millones
// shortcut: cubre hasta 999.999.999 (suficiente para esta simulación); ampliar si aparecen miles de millones.
export function numberToWords(n) {
  if (n === 0) return 'cero';
  const m = Math.floor(n / 1e6);
  const k = Math.floor((n % 1e6) / 1000);
  const r = n % 1000;
  return [
    m && (m === 1 ? 'un millón' : `${apocope(numberToWords(m))} millones`),
    k && (k === 1 ? 'mil' : `${apocope(below1000(k))} mil`),
    r && below1000(r),
  ].filter(Boolean).join(' ');
}
// Texto que se pronuncia: solo cambia las cantidades en pesos; el texto visible no se toca.
export const spokenText = (text) =>
  text.replace(/\$\s?(\d{1,3}(?:\.\d{3})+|\d+)(?:\s?COP)?/g, (_, n) => {
    const v = Number(n.replace(/\./g, ''));
    const round = v >= 1e6 && v % 1e6 === 0;
    return v === 1 ? 'un peso colombiano' : `${numberToWords(v)}${round ? ' de' : ''} pesos colombianos`;
  });

// Divide un texto en oraciones sin cortar cifras ($350.000), «a. m./p. m.» ni direcciones.
export const sentences = (text) =>
  text.match(/.+?(?:(?<!\b[ap]|\b[ap]\. m)[.!?…]+["»”)]*(?=\s|$)|$)/gs)?.map((t) => t.trim()).filter(Boolean) ?? [];

// Texto visible dividido en oraciones marcadas para el lector.
export const rd = (text) => sentences(text).map((t) => `<span class="rd-s">${esc(t)}</span>`).join(' ');

export function playerHtml() {
  const btn = (act, ic, label, aria) =>
    `<button type="button" class="reader__btn" data-rd="${act}" aria-label="${aria}">${icon[ic](26)}<span>${label}</span></button>`;
  return `
    <section class="reader" data-reader aria-label="Escuchar recomendaciones">
      <button type="button" class="ac-btn ac-btn--primary reader__main" data-rd="main">${icon.speaker(26)}<span class="ac-btn__label">Escuchar recomendaciones</span></button>
      <div class="reader__bar" hidden>
        <div class="reader__row">
          ${btn('prev', 'skipBack', 'Atrás', 'Retroceder una oración')}
          <button type="button" class="reader__btn reader__btn--main" data-rd="toggle" aria-label="Pausar"><span data-rd-ic></span><span data-rd-label>Pausar</span></button>
          ${btn('next', 'skipForward', 'Adelante', 'Avanzar una oración')}
          ${btn('repeat', 'repeat', 'Inicio', 'Repetir desde el inicio')}
          ${btn('stop', 'stop', 'Detener', 'Detener la lectura')}
        </div>
        <div class="reader__row reader__row--seek">
          <span class="reader__status" data-rd-status aria-live="polite"></span>
          <label for="rd-seek" class="sr-only">Posición de la lectura, por oración</label>
          <input id="rd-seek" type="range" min="1" value="1" step="1" data-rd="seek" aria-valuetext="Oración 1" />
        </div>
        <div class="reader__row reader__row--rate">
          <label for="rd-rate">Velocidad</label>
          <select id="rd-rate" data-rd="rate">${RATES.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select>
        </div>
      </div>
      <p class="reader__voice" data-rd-voice></p>
    </section>`;
}

const LATAM = /^es[-_](419|MX|US|AR|CL|PE|VE|EC|UY|PY|BO|CR|CU|DO|GT|HN|NI|PA|PR|SV)\b/i;
// es-CO primero; si no existe, español latinoamericano; si no, cualquier español.
export function pickVoice(voices) {
  const es = voices.filter((v) => /^es/i.test(v.lang));
  return es.find((v) => /^es[-_]CO\b/i.test(v.lang)) ?? es.find((v) => LATAM.test(v.lang)) ?? es[0] ?? null;
}

let current = null; // una sola lectura a la vez: nunca se superponen voces
export const stopReading = () => current?.destroy();
export const pauseReading = () => current?.pause();
if (typeof window !== 'undefined') window.addEventListener('pagehide', () => synth?.cancel());

export function mountReader(el) {
  current?.destroy();
  if (!synth) {
    el.innerHTML = '<p class="ac-small">Este navegador no puede leer en voz alta. Puede leer el texto en pantalla.</p>';
    return;
  }
  const page = el.closest('[data-reading]');
  const q = (s) => el.querySelector(s);
  const note = q('[data-rd-voice]');
  const units = [...page.querySelectorAll('.rd-s')];
  const texts = units.map((u) => u.textContent);
  const spoken = texts.map(spokenText);
  let idx = 0;
  let state = 'idle'; // idle | playing | paused
  let token = 0; // invalida callbacks de lecturas canceladas
  let rate = lastRate;
  let voice = null;

  q('[data-rd="rate"]').value = String(rate);
  const bar = q('.reader__bar');
  const main = q('[data-rd="main"]');
  const toggle = q('[data-rd="toggle"]');
  const toggleIc = q('[data-rd-ic]');
  const toggleLabel = q('[data-rd-label]');
  const status = q('[data-rd-status]');

  function loadVoices() {
    const all = synth.getVoices();
    voice = pickVoice(all);
    main.disabled = false;
    if (!all.length) note.textContent = '';
    else if (!voice) {
      note.textContent = 'Este dispositivo no tiene una voz en español. Puede leer el texto en pantalla.';
      main.disabled = true;
    } else note.textContent = `Voz del dispositivo: ${voice.name} (${voice.lang.replace('_', '-')}).`;
  }
  loadVoices();
  synth.addEventListener('voiceschanged', loadVoices);

  // Barra basada en oraciones reales (SpeechSynthesis no informa tiempos). Si hay audios grabados,
  // aquí puede usarse la duración real con currentTime.
  const seek = q('[data-rd="seek"]');
  seek.max = String(units.length);
  function syncSeek() {
    seek.value = String(idx + 1);
    seek.setAttribute('aria-valuetext', `Oración ${idx + 1} de ${units.length}`);
  }

  function setState(next) {
    state = next;
    main.hidden = state !== 'idle';
    bar.hidden = state === 'idle';
    toggleIc.innerHTML = state === 'playing' ? icon.pause(26) : icon.play(26);
    toggleLabel.textContent = state === 'playing' ? 'Pausar' : 'Continuar';
    toggle.setAttribute('aria-label', state === 'playing' ? 'Pausar' : 'Continuar la lectura');
    status.textContent = state === 'idle' ? '' : `Oración ${idx + 1} de ${units.length}`;
    syncSeek();
  }

  function clearMarks() {
    units.forEach((u, i) => {
      u.classList.remove('is-active');
      if (u.querySelector('.rd-w')) u.textContent = texts[i];
    });
  }

  // Solo se desplaza si la oración queda fuera del área visible (bajo el reproductor fijo).
  function reveal(u) {
    const r = u.getBoundingClientRect();
    const c = page.getBoundingClientRect();
    const top = c.top + el.offsetHeight + 12;
    if (r.top >= top && r.bottom <= c.bottom - 12) return;
    const calm = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    page.scrollTo({ top: page.scrollTop + r.top - top - 8, behavior: calm ? 'auto' : 'smooth' });
  }

  function markWord(charIndex) {
    const u = units[idx];
    if (!u.querySelector('.rd-w')) u.innerHTML = texts[idx].replace(/\S+/g, (w) => `<span class="rd-w">${esc(w)}</span>`);
    let pos = 0;
    let hit = null;
    for (const w of u.querySelectorAll('.rd-w')) {
      const start = texts[idx].indexOf(w.textContent, pos);
      pos = start + w.textContent.length;
      w.classList.remove('is-current');
      if (start <= charIndex) hit = w;
    }
    hit?.classList.add('is-current');
  }

  function speak() {
    const mine = ++token;
    synth.cancel();
    clearMarks();
    units[idx].classList.add('is-active');
    reveal(units[idx]);
    setState('playing');
    const u = new SpeechSynthesisUtterance(spoken[idx]);
    u.lang = voice?.lang ?? 'es-CO';
    if (voice) u.voice = voice;
    u.rate = rate;
    u.onboundary = (e) => {
      // shortcut: con cantidades en pesos el texto hablado difiere del visible; se resalta solo la oración.
      if (mine === token && spoken[idx] === texts[idx] && (e.name === undefined || e.name === 'word')) markWord(e.charIndex);
    };
    u.onend = () => {
      if (mine !== token) return;
      if (idx < units.length - 1) {
        idx += 1;
        speak();
      } else stop();
    };
    u.onerror = (e) => {
      if (mine !== token || e.error === 'canceled' || e.error === 'interrupted') return;
      setState('paused');
      status.textContent = 'No se pudo reproducir la voz. Puede leer el texto en pantalla.';
    };
    setTimeout(() => mine === token && synth.speak(u), 50); // algunos navegadores ignoran speak() inmediato tras cancel()
  }

  function pause() {
    token += 1;
    synth.cancel();
    setState('paused'); // el resaltado se queda en la oración actual
  }

  function stop() {
    token += 1;
    synth.cancel();
    idx = 0;
    clearMarks();
    setState('idle');
  }

  const actions = {
    main: speak,
    toggle: () => (state === 'playing' ? pause() : speak()),
    prev: () => {
      idx = Math.max(0, idx - 1);
      speak();
    },
    next: () => {
      if (idx >= units.length - 1) return stop();
      idx += 1;
      speak();
    },
    repeat: () => {
      idx = 0;
      speak();
    },
    stop,
  };
  const onClick = (e) => actions[e.target.closest('[data-rd]')?.dataset.rd]?.();
  const onSeekInput = (e) => {
    if (e.target.dataset.rd === 'seek') status.textContent = `Oración ${e.target.value} de ${units.length}`;
  };
  const onRate = (e) => {
    if (e.target.dataset.rd === 'seek') {
      idx = Number(e.target.value) - 1; // al soltar: cancela la lectura anterior y reanuda desde esa oración
      return speak();
    }
    if (e.target.dataset.rd !== 'rate') return;
    rate = lastRate = Number(e.target.value);
    if (state === 'playing') speak(); // retoma la misma oración con la nueva velocidad
  };
  el.addEventListener('click', onClick);
  el.addEventListener('change', onRate);
  el.addEventListener('input', onSeekInput);
  setState('idle');

  current = {
    pause: () => state === 'playing' && pause(),
    destroy() {
      token += 1;
      synth.cancel();
      synth.removeEventListener('voiceschanged', loadVoices);
      el.removeEventListener('click', onClick);
      el.removeEventListener('change', onRate);
      el.removeEventListener('input', onSeekInput);
      current = null;
    },
  };
}
