// Páginas de ALERTA CHAT dentro del teléfono: bienvenida, elegir celular, elegir aplicación,
// introducción de cada historia, resultados, cierre y nodos en construcción. Trato de «usted».
import { esc } from '../html.js';
import { alertaLogo, appIcon, icon } from '../icons.js';
import { APP_LABEL, OS_LABEL } from '../device/os-traits.js';
import { playerHtml, rd } from '../reader.js';
import { helpSection } from './help.js';
import { summary } from './tracker.js';

const brand = `<div class="ac-page__brand">${alertaLogo(40)}<span>ALERTA CHAT</span></div>`;

// Ilustración sencilla: un celular con mensajes y un escudo.
const WELCOME_ART = `
  <svg class="ac-art" viewBox="0 0 200 150" width="200" height="150" aria-hidden="true" focusable="false">
    <rect x="62" y="6" width="76" height="138" rx="14" fill="#fff" stroke="#1D3D8F" stroke-width="4"/>
    <rect x="88" y="12" width="24" height="6" rx="3" fill="#1D3D8F"/>
    <rect x="72" y="30" width="44" height="16" rx="8" fill="#E6ECFA"/>
    <rect x="84" y="52" width="44" height="16" rx="8" fill="#D9FDD3"/>
    <rect x="72" y="74" width="50" height="16" rx="8" fill="#E6ECFA"/>
    <circle cx="146" cy="104" r="26" fill="#F2B705"/>
    <path d="M146 88l13 5v8c0 8-5.5 13.5-13 15.5-7.5-2-13-7.5-13-15.5v-8z" fill="#fff"/>
    <path d="M140 102l4.5 4.5 8-8.5" fill="none" stroke="#1D3D8F" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

export function welcomeView() {
  return `
    <div class="ac-page ac-page--center">
      ${brand}
      ${WELCOME_ART}
      <h1 class="ac-h1 ac-h1--big">Aprenda a reconocer mensajes sospechosos.</h1>
      <p class="ac-lead">Practique con conversaciones parecidas a las que puede recibir en su celular.</p>
      <p class="ac-lead">Aquí puede aprender sin poner en riesgo su dinero ni sus datos.</p>
      <p class="ac-small ac-note">${icon.shieldCheck(20)}<span>Esta es una simulación educativa. No necesita ingresar datos personales.</span></p>
      <button type="button" class="ac-textlink" data-action="go" data-to="T02">Conozca al equipo</button>
    </div>`;
}

const PHONE_ART = {
  android: `
    <svg viewBox="0 0 90 150" width="78" height="130" aria-hidden="true" focusable="false">
      <rect x="4" y="4" width="82" height="142" rx="10" fill="#202124"/>
      <rect x="9" y="9" width="72" height="132" rx="6" fill="#E6F4EA"/>
      <circle cx="45" cy="17" r="3.5" fill="#202124"/>
      <path d="M27 82a18 18 0 0 1 36 0z" fill="#3DDC84"/>
      <circle cx="37" cy="74" r="2.4" fill="#0B3D1F"/><circle cx="53" cy="74" r="2.4" fill="#0B3D1F"/>
      <path d="M31 58l4 6M59 58l-4 6" stroke="#3DDC84" stroke-width="3" stroke-linecap="round"/>
      <rect x="27" y="85" width="36" height="22" rx="4" fill="#3DDC84"/>
      <rect x="32" y="134" width="26" height="3" rx="1.5" fill="#202124" opacity=".6"/>
    </svg>`,
  ios: `
    <svg viewBox="0 0 90 150" width="78" height="130" aria-hidden="true" focusable="false">
      <rect x="4" y="4" width="82" height="142" rx="18" fill="#1C1C1E"/>
      <rect x="8.5" y="8.5" width="73" height="133" rx="14" fill="#E9E7F5"/>
      <rect x="33" y="13" width="24" height="7" rx="3.5" fill="#1C1C1E"/>
      ${[0, 1, 2]
        .map((r) =>
          [0, 1, 2].map((c) => `<rect x="${17 + c * 21}" y="${34 + r * 23}" width="14" height="14" rx="4" fill="${['#34C759', '#0A84FF', '#FF9F0A', '#AF52DE', '#FF375F', '#5AC8FA', '#30B0C7', '#FFD60A', '#8E8E93'][r * 3 + c]}"/>`).join(''),
        )
        .join('')}
      <rect x="31" y="134" width="28" height="3" rx="1.5" fill="#1C1C1E"/>
    </svg>`,
};

export function deviceChoiceView(node, { chosenOs: os }) {
  const [android, ios, simple] = node.osChoices;
  const card = (c) => `
    <button type="button" class="ac-card ac-card--device" data-action="set-os" data-os="${c.os}" ${os === c.os ? 'aria-pressed="true"' : ''}>
      ${PHONE_ART[c.os]}
      <span class="ac-card__name">${esc(c.label)}</span>
    </button>`;
  return `
    <div class="ac-page">
      <h1 class="ac-h1">¿Qué celular utiliza?</h1>
      <p class="ac-lead">Seleccione el que más se parece al suyo.</p>
      <div class="ac-devices">${card(android)}${card(ios)}</div>
      <button type="button" class="ac-card ac-card--unsure" data-action="set-os" data-os="${simple.os}" ${os === simple.os ? 'aria-pressed="true"' : ''}>
        <span class="ac-card__q" aria-hidden="true">?</span>
        <span class="ac-card__name">${esc(simple.label)}</span>
      </button>
      <p class="ac-small">Si tiene dudas, le mostraremos una versión sencilla. Puede cambiarla después.</p>
    </div>`;
}

export function appsView(node, { os }) {
  return `
    <div class="ac-page">
      <div class="ac-row">
        <p class="ac-chip">Celular: <strong>${esc(OS_LABEL[os])}</strong></p>
        <button type="button" class="ac-mini" data-action="go" data-to="P01">Cambiar celular</button>
        <button type="button" class="ac-mini" data-action="go" data-to="T01">Mi recorrido</button>
      </div>
      <h1 class="ac-h1">¿Dónde quiere practicar?</h1>
      <p class="ac-lead">Elija una aplicación. Puede practicar las tres.</p>
      <ul class="ac-apps" role="list">
        ${node.apps
          .map(
            (a) => `
          <li><button type="button" class="ac-card ac-card--app" data-action="go" data-to="${esc(a.to)}">
            ${appIcon(a.app, os, 60)}
            <span class="ac-card__name">${esc(a.label)}</span>
            ${icon.chevronRight(28)}
          </button></li>`,
          )
          .join('')}
      </ul>
      <button type="button" class="ac-btn ac-btn--act" data-action="go" data-to="G06"><span class="ac-btn__label">Finalizar simulación</span></button>
    </div>`;
}

export function storyIntroView(node, { os }) {
  return `
    <div class="ac-page ac-page--center">
      <div class="ac-intro-app">${appIcon(node.app, os, 84)}<span>${esc(APP_LABEL[node.app][os])}</span></div>
      <h1 class="ac-h1 ac-h1--big">Va a recibir mensajes simulados.</h1>
      <p class="ac-lead">Lea con calma y elija cómo responder.</p>
      <p class="ac-lead"><strong>No hay límite de tiempo.</strong></p>
    </div>`;
}

const TONE = {
  safe: { cls: 'safe', icon: 'shieldCheck', label: 'Decisión segura' },
  fix: { cls: 'fix', icon: 'repeat', label: 'Se detuvo y corrigió' },
  risk: { cls: 'risk', icon: 'warn', label: 'Decisión con riesgo' },
};

export function outcomeView(node) {
  const t = TONE[node.tone];
  const block = (title, items) => `
      <section class="ac-section">
        <h2 class="ac-h2 ac-label">${rd(title)}</h2>
        <ul class="ac-list">${items.map((i) => `<li>${rd(i)}</li>`).join('')}</ul>
      </section>`;
  return `
    <div class="ac-page" data-reading>
      ${playerHtml()}
      <p class="ac-tone ac-tone--${t.cls}">${icon[t.icon](22)}<span>${rd(t.label)}</span></p>
      <h1 class="ac-h1">${rd(node.heading)}</h1>
      <p class="ac-p ac-just"><strong class="ac-label">${rd('Qué pasó:')}</strong> ${rd(node.happened)}</p>
      ${block('Señales importantes:', node.signals)}
      ${block('Qué hacer:', node.todo)}
      <p class="ac-small">${rd(node.sources)}</p>
      ${helpSection()}
    </div>`;
}

const FINAL_TEXT = [
  'Gracias por participar en ALERTA CHAT. Creamos esta experiencia para practicar cómo reconocer mensajes sospechosos y tomar decisiones con tranquilidad.',
  'No siempre es fácil detectar un engaño. Algunos mensajes utilizan la confianza, la preocupación o la urgencia para que actuemos sin verificar.',
  'Recuerde que puede detenerse, comprobar la información por otro medio y pedir ayuda antes de compartir datos o dinero.',
  'Aprender a cuidarnos en internet es una tarea que construimos entre todos.',
];
const TEAM = ['Valentina Giraldo', 'Sebastián Camacho Cabarcas', 'Juan Román', 'Juan José Arango'];

// Créditos: cada nombre en su propia línea (bienvenida → "Conozca al equipo", y pantalla final).
const teamSection = () => `
      <section class="ac-section">
        <h2 class="ac-h2">${rd('Nuestro equipo')}</h2>
        <p class="ac-p"><strong>${rd('Equipo de desarrollo')}</strong></p>
        <ul class="ac-list ac-list--plain">${TEAM.map((n) => `<li>${rd(n)}</li>`).join('')}</ul>
        <p class="ac-p"><strong>${rd('Proyecto académico')}</strong></p>
        <p class="ac-p">${rd('ALERTA CHAT — Ciberculturas')}<br>${rd('Pontificia Universidad Javeriana Cali')}<br>${rd('Cali, Colombia · 2026')}</p>
      </section>`;

export const teamView = () => `<div class="ac-page" data-reading>${playerHtml()}<h1 class="ac-h1">${rd('Conozca al equipo')}</h1>${teamSection()}</div>`;

export function finalView() {
  const s = summary();
  const apps = s.apps.filter((a) => a.visited).length;
  return `
    <div class="ac-page" data-reading>
      ${playerHtml()}
      <h1 class="ac-h1">${rd('Lo que aprendimos juntos')}</h1>
      ${FINAL_TEXT.map((t) => `<p class="ac-p">${rd(t)}</p>`).join('')}
      <section class="ac-section">
        <h2 class="ac-h2">${rd('Propósito del proyecto')}</h2>
        <p class="ac-p">${rd('ALERTA CHAT busca que las personas mayores practiquen, sin riesgo para su dinero ni sus datos, cómo reconocer mensajes sospechosos en WhatsApp, Messenger y mensajes de texto.')}</p>
      </section>
      <section class="ac-section">
        <h2 class="ac-h2">${rd('Lo que exploró')}</h2>
        <p class="ac-p">${rd(`Usted visitó ${apps} de 3 aplicaciones y descubrió ${s.found} de ${s.total} desenlaces (${s.percent} %).`)}</p>
      </section>
      <section class="ac-section">
        <h2 class="ac-h2">${rd('Recomendaciones generales')}</h2>
        <p class="motto">${rd('Detente · Revisa · Verifica')}</p>
        <ul class="ac-list">
          <li>${rd('Desconfíe de la prisa y de los pedidos de dinero, datos o códigos.')}</li>
          <li>${rd('Confirme quién le escribe por un medio que usted ya conoce.')}</li>
          <li>${rd('No comparta dinero, contraseñas ni códigos sin verificar.')}</li>
        </ul>
      </section>
      ${helpSection()}
      ${teamSection()}
    </div>`;
}

export function placeholderView(node) {
  return `
    <div class="ac-page ac-page--center">
      ${brand}
      <p class="ac-tone ac-tone--info">${icon.clock(22)}<span>En construcción · Fase ${esc(node.phase)}</span></p>
      <h1 class="ac-h1">Esta parte de la historia se está preparando</h1>
      <p class="ac-lead">${esc(node.title)}.</p>
    </div>`;
}
