// "Mi recorrido": tarjetas simples con avance por aplicación y progreso general; el detalle va aparte.
// Avance = desenlaces distintos descubiertos ÷ total de desenlaces. Se distinguen tres cosas:
// pantallas de decisión visitadas, opciones elegidas y desenlaces descubiertos.
import { esc } from '../html.js';
import { icon } from '../icons.js';
import { STORY, MANIFEST } from '../../story/index.js';
import { progress } from '../../engine/progress.js';

const APPS = [
  ['whatsapp', 'WhatsApp'],
  ['messenger', 'Messenger de Facebook'],
  ['sms', 'Mensajes de texto (SMS)'],
];

export function summary() {
  const apps = APPS.map(([app, name]) => {
    const ids = Object.keys(MANIFEST).filter((id) => MANIFEST[id].app === app && STORY[id]);
    const outcomes = ids.filter((id) => STORY[id].view === 'outcome');
    const decisions = ids.filter((id) => STORY[id].choices && STORY[id].view !== 'outcome');
    const options = decisions.flatMap((id) =>
      STORY[id].choices.map((c) => ({ from: id, text: c.say ?? c.label, taken: progress.hasDecided(c.id) })),
    );
    return {
      app, name, outcomes, decisions, options,
      found: outcomes.filter((id) => progress.hasVisited(id)),
      taken: options.filter((o) => o.taken).length,
      visitedDecisions: decisions.filter((id) => progress.hasVisited(id)).length,
      visited: ids.some((id) => progress.hasVisited(id)),
    };
  });
  const total = apps.reduce((n, a) => n + a.outcomes.length, 0);
  const found = apps.reduce((n, a) => n + a.found.length, 0);
  return { apps, total, found, percent: total ? Math.round((found / total) * 100) : 0 };
}

const chip = (text, kind) => `<span class="trk__chip trk__chip--${kind}">${text}</span>`;

function details(a) {
  return `
    <details class="trk__details">
      <summary class="trk__more">Ver detalles</summary>
      <p class="trk__nums">Pantallas de decisión visitadas: <strong>${a.visitedDecisions} de ${a.decisions.length}</strong><br>Opciones elegidas: <strong>${a.taken} de ${a.options.length}</strong><br>Desenlaces descubiertos: <strong>${a.found.length} de ${a.outcomes.length}</strong></p>
      <h3 class="trk__h">Desenlaces</h3>
      <ul class="trk__list">${a.outcomes
        .map((id) => {
          const ok = progress.hasVisited(id);
          return `<li>${ok ? chip('Descubierto', 'ok') : chip('Pendiente', 'no')}<span>${ok ? esc(STORY[id].heading) : 'Desenlace sin descubrir'}</span></li>`;
        })
        .join('')}</ul>
      <h3 class="trk__h">Decisiones</h3>
      ${a.decisions
        .map(
          (id) => `<p class="trk__q">${esc(MANIFEST[id].title.split(' · ').slice(1).join(' · '))} ${progress.hasVisited(id) ? chip('Visitada', 'vis') : chip('Pendiente', 'no')}</p>
      <ul class="trk__list">${a.options
        .filter((o) => o.from === id)
        .map((o) => `<li>${o.taken ? chip('Ya elegida', 'ok') : chip('Pendiente', 'no')}<span>${esc(o.text)}</span></li>`)
        .join('')}</ul>`,
        )
        .join('')}
    </details>`;
}

export function trackerView() {
  const s = summary();
  return `
    <div class="ac-page">
      <h1 class="ac-h1">Mi recorrido</h1>
      <section class="trk__total" aria-label="Progreso general">
        <p class="trk__pct"><strong>${s.percent} %</strong> explorado</p>
        <progress max="100" value="${s.percent}" aria-label="Progreso general">${s.percent} %</progress>
        <p class="ac-small">${s.found} de ${s.total} desenlaces descubiertos.</p>
      </section>
      ${s.apps
        .map((a) => {
          const full = a.found.length === a.outcomes.length;
          return `
        <article class="trk__card${full ? ' is-full' : ''}">
          <h2 class="trk__name">${full ? icon.check(24) : ''}<span>${esc(a.name)}</span></h2>
          <progress max="${a.outcomes.length}" value="${a.found.length}" aria-label="Avance de ${esc(a.name)}">${a.found.length} de ${a.outcomes.length}</progress>
          <p class="trk__count"><strong>${a.found.length} de ${a.outcomes.length}</strong> desenlaces descubiertos${full ? ' · Completo' : a.visited ? '' : ' · Sin visitar'}</p>
          ${details(a)}
        </article>`;
        })
        .join('')}
    </div>`;
}
