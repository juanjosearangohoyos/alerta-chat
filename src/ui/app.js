// Orquestador: lee el estado del motor y dibuja la franja y el teléfono (protagonista).
// También controla la llegada progresiva de mensajes con «Escribiendo…», sin tiempo límite para decidir.
import { strip } from './shell/strip.js';
import { dock } from './shell/dock.js';
import { pauseMenu, confirmMenu } from './shell/pause-menu.js';
import { deviceFrame } from './device/frame.js';
import { OS_LABEL } from './device/os-traits.js';
import { welcomeView, deviceChoiceView, appsView, storyIntroView, outcomeView, finalView, teamView, placeholderView } from './views/alerta-pages.js';
import { trackerView } from './views/tracker.js';
import { mountReader, stopReading, pauseReading } from './reader.js';
import { progress } from '../engine/progress.js';
import { STORY } from '../story/index.js';
import { listView } from './views/lists.js';
import { chatView, typingHtml } from './views/chat.js';
import { profileView } from './views/profile.js';
import { webpageView } from './views/webpage.js';

const ALERTA = 'alerta';
const VIEWS = {
  welcome: { render: welcomeView, surface: ALERTA },
  'device-choice': { render: deviceChoiceView, surface: ALERTA },
  apps: { render: appsView, surface: ALERTA },
  'story-intro': { render: storyIntroView, surface: ALERTA },
  outcome: { render: outcomeView, surface: ALERTA },
  final: { render: finalView, surface: ALERTA },
  tracker: { render: trackerView, surface: ALERTA },
  team: { render: teamView, surface: ALERTA },
  placeholder: { render: placeholderView, surface: ALERTA },
  'chat-list': { render: listView },
  chat: { render: chatView },
  profile: { render: profileView },
  webpage: { render: webpageView },
};

const HINTS = {
  link: 'Este enlace es de práctica y no abre nada. Para decidir, use las opciones de abajo.',
  control: 'Ese botón no se usa en esta práctica. Use las opciones de abajo.',
  row: 'Esa conversación no es parte de esta práctica.',
  field: 'Esto es una ilustración: aquí no se escribe nada. Use las opciones de abajo.',
};

const PREFS_KEY = 'alerta-chat:preferencias';
const prefersReduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function loadPrefs() {
  const base = { text: 'normal', motion: prefersReduced() ? 'instant' : 'step' };
  try {
    return { ...base, ...JSON.parse(window.sessionStorage.getItem(PREFS_KEY) ?? '{}') };
  } catch {
    return base;
  }
}

const nowClock = () => {
  const d = new Date();
  return `${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export function mountApp(root, engine) {
  progress.migrate((node, i) => STORY[node]?.choices?.[i]?.id);
  root.innerHTML = `
    <div class="app">
      <div data-region="strip"></div>
      <main class="stage" data-region="stage"></main>
      <dialog class="pause" aria-labelledby="pause-title"></dialog>
    </div>`;
  const stripEl = root.querySelector('[data-region="strip"]');
  const stageEl = root.querySelector('[data-region="stage"]');
  const dialog = root.querySelector('dialog');

  let prefs = loadPrefs();
  let revealRun = 0;
  let finishReveal = null;

  const applyPrefs = () => {
    document.documentElement.dataset.text = prefs.text;
    try {
      window.sessionStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {
      /* sin almacenamiento */
    }
  };
  applyPrefs();

  function render(reason) {
    const { os } = engine.state;
    const node = engine.node();
    const view = VIEWS[node.view];
    if (!view) throw new Error(`ALERTA CHAT: vista desconocida «${node.view}» en ${node.id}.`);
    const viewOs = os ?? 'simple';

    stopReading(); // la voz nunca continúa en otra pantalla
    if (node.app !== 'general') progress.visit(node.id);
    revealRun += 1; // cancela una llegada de mensajes en curso
    finishReveal = null;

    stripEl.innerHTML = strip({ canGoBack: engine.canGoBack() || Boolean(node.back) });
    stageEl.innerHTML = deviceFrame({
      os: os ?? 'neutral',
      surface: view.surface ?? node.app,
      clock: node.clock ?? nowClock(),
      label: `Pantalla del celular (simulación)${os ? ` · ${OS_LABEL[os]}` : ''}`,
      screen: view.render(node, { os: viewOs, chosenOs: os }),
      dock: dock(node),
    });
    document.title = `${node.title} · ALERTA CHAT`;
    const readerEl = stageEl.querySelector('[data-reader]');
    if (readerEl) mountReader(readerEl);

    const animate = reason === 'go' && prefs.motion === 'step';
    if (animate && stageEl.querySelector('.thread [data-new]')) {
      revealMessages(node, viewOs);
    } else {
      scrollThreadToEnd(false);
      if (reason === 'go' || reason === 'back') focusDock();
    }
  }

  function scrollThreadToEnd(smooth) {
    const thread = stageEl.querySelector('.thread');
    if (thread) thread.scrollTo({ top: thread.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  }

  function focusDock() {
    stageEl.querySelector('.dock [data-focus], .ac-page button')?.focus({ preventScroll: true });
  }

  // Muestra los mensajes nuevos de uno en uno, con «Escribiendo…» antes de cada mensaje recibido.
  // Las opciones aparecen cuando terminan de llegar; no hay límite de tiempo para elegir.
  function revealMessages(node, os) {
    const run = revealRun;
    const thread = stageEl.querySelector('.thread');
    const dockEl = stageEl.querySelector('.dock');
    const pending = [...thread.querySelectorAll('[data-new]')];
    pending.forEach((el) => (el.hidden = true));
    dockEl?.classList.add('is-waiting');
    scrollThreadToEnd(false);

    let typingEl = null;
    let timer = null;
    const done = () => {
      clearTimeout(timer);
      typingEl?.remove();
      pending.forEach((el) => (el.hidden = false));
      dockEl?.classList.remove('is-waiting');
      finishReveal = null;
      scrollThreadToEnd(false);
      focusDock();
    };
    finishReveal = done;

    let i = 0;
    const step = () => {
      if (run !== revealRun) return;
      if (i >= pending.length) return done();
      const el = pending[i++];
      const incoming = el.classList.contains('msg--them');
      if (!incoming) {
        el.hidden = false;
        scrollThreadToEnd(true);
        timer = setTimeout(step, el.classList.contains('msg') ? 450 : el.matches('.tstamp') ? 0 : 700);
        return;
      }
      const length = el.textContent.trim().length;
      typingEl = document.createRange().createContextualFragment(typingHtml(node.app, os, node.chat.contact)).firstElementChild;
      thread.append(typingEl);
      scrollThreadToEnd(true);
      timer = setTimeout(() => {
        if (run !== revealRun) return;
        typingEl.remove();
        typingEl = null;
        el.hidden = false;
        scrollThreadToEnd(true);
        timer = setTimeout(step, 500);
      }, 700 + Math.min(1300, length * 15));
    };
    step();
  }

  function toast(text) {
    const el = stageEl.querySelector('.device__toast');
    if (!el) return;
    el.textContent = text;
    el.hidden = false;
  }

  const hideToast = () => {
    const el = stageEl.querySelector('.device__toast');
    if (el) el.hidden = true;
  };

  async function copyPhone(number) {
    try {
      await navigator.clipboard.writeText(number);
      toast(`Número copiado: ${number}. La extensión se marca aparte.`);
    } catch {
      toast(`No se pudo copiar. Puede marcar ${number} a mano.`);
    }
  }

  function openPause() {
    pauseReading();
    const { os } = engine.state;
    const n = engine.node();
    const inChat = ['whatsapp', 'messenger', 'sms'].includes(n.app) && ['chat', 'chat-list', 'profile', 'webpage'].includes(n.view);
    dialog.innerHTML = pauseMenu({ os: os ?? 'simple', prefs, hasOs: Boolean(os) && engine.nodeId !== 'P01', inChat });
    if (!dialog.open) dialog.showModal();
    dialog.querySelector('.pause__title')?.focus();
  }

  const closePause = () => dialog.open && dialog.close();

  dialog.addEventListener('close', () => stripEl.querySelector('[data-action="pause"]')?.focus());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closePause();
  });

  root.addEventListener('click', (e) => {
    const actionEl = e.target.closest('[data-action]');
    const inertEl = e.target.closest('[data-inert]');
    if (inertEl && !actionEl) return toast(HINTS[inertEl.dataset.inert] ?? HINTS.control);
    hideToast();
    if (!actionEl || actionEl.disabled) return;

    const { action, to, say, value } = actionEl.dataset;
    switch (action) {
      case 'go':
        if (actionEl.closest('.dock__choices') && engine.node().view !== 'outcome') progress.decide(actionEl.dataset.id);
        return engine.go(to, say);
      case 'back':
        return engine.back();
      case 'show-all':
        return finishReveal?.();
      case 'set-os': {
        const node = engine.node();
        engine.setOS(actionEl.dataset.os);
        return node.then && engine.go(node.then);
      }
      case 'pause':
        return openPause();
      case 'ask':
        closePause();
        dialog.innerHTML = confirmMenu(actionEl.dataset.kind);
        dialog.showModal();
        return dialog.querySelector('.pause__title')?.focus();
      case 'confirm-no':
        return closePause();
      case 'confirm-yes':
        closePause();
        if (actionEl.dataset.kind === 'reset') {
          progress.reset();
          return render('init');
        }
        return engine.go(actionEl.dataset.kind === 'switch' ? 'G03' : 'G06');
      case 'copy-phone':
        return copyPhone(actionEl.dataset.number);
      case 'pause-close':
        return closePause();
      case 'pause-go':
        closePause();
        return engine.go(to);
      case 'pause-os': {
        const changed = value !== engine.state.os;
        closePause();
        engine.setOS(value);
        return toast(changed ? `Listo: ahora se ve como ${value === 'simple' ? 'la versión sencilla' : `un ${OS_LABEL[value]}`}. Sigue en el mismo punto.` : 'Ya estaba usando esta opción.');
      }
      case 'pref-text':
      case 'pref-motion':
        prefs = { ...prefs, [action === 'pref-text' ? 'text' : 'motion']: value };
        applyPrefs();
        if (action === 'pref-motion' && value === 'instant') finishReveal?.();
        return openPause();
      default:
        return undefined;
    }
  });

  engine.subscribe((_, reason) => render(reason));
  render('init');
}
