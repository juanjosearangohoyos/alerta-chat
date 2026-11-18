// Motor narrativo de ALERTA CHAT (compartido por WhatsApp, Messenger y SMS).
// Solo conoce nodos, el recorrido y el sistema elegido (os). No sabe cómo se dibuja nada.
// Cada paso del recorrido guarda la respuesta elegida (`say`), que se muestra como mensaje enviado.

import { resolveNode } from './resolve-node.js';

export const OS_VALUES = ['android', 'ios', 'simple'];
const STORAGE_KEY = 'alerta-chat:progreso:v2';

// sessionStorage: sobrevive a recargar la página y se borra al cerrar la pestaña.
// Solo se guarda el recorrido y el tipo de celular; nunca datos de la persona.
function safeSession() {
  try {
    const s = window.sessionStorage;
    s.setItem('__alerta__', '1');
    s.removeItem('__alerta__');
    return s;
  } catch {
    return null;
  }
}

export function createEngine({ story, manifest, start }) {
  const storage = typeof window === 'undefined' ? null : safeSession();
  const listeners = new Set();
  const fresh = () => ({ os: null, step: { id: start }, history: [] });

  let state = load() ?? fresh();

  function load() {
    if (!storage) return null;
    try {
      const saved = JSON.parse(storage.getItem(STORAGE_KEY) ?? 'null');
      if (!saved?.step || !manifest[saved.step.id] || !Array.isArray(saved.history)) return null;
      if (saved.os !== null && !OS_VALUES.includes(saved.os)) return null;
      return { os: saved.os, step: saved.step, history: saved.history.filter((s) => manifest[s?.id]) };
    } catch {
      return null;
    }
  }

  function save() {
    try {
      storage?.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* sin almacenamiento: la práctica sigue funcionando */
    }
  }

  function set(next, reason) {
    state = next;
    save();
    listeners.forEach((fn) => fn(state, reason));
  }

  const path = () => [...state.history, state.step];

  return {
    get state() {
      return state;
    },

    get nodeId() {
      return state.step.id;
    },

    node() {
      return resolveNode(story, manifest, state.step.id, path());
    },

    canGoBack() {
      return state.history.length > 0;
    },

    // `say`: texto de la respuesta elegida; aparece como mensaje enviado en el siguiente nodo.
    go(id, say) {
      if (!id) return;
      if (!manifest[id]) throw new Error(`ALERTA CHAT: el nodo «${id}» no existe en el manifiesto.`);
      set({ ...state, step: say ? { id, say } : { id }, history: [...state.history, state.step] }, 'go');
    },

    back() {
      const node = resolveNode(story, manifest, state.step.id, path());
      if (node.back) {
        const idx = state.history.map((s) => s.id).lastIndexOf(node.back);
        const history = idx >= 0 ? state.history.slice(0, idx) : state.history;
        set({ ...state, step: { id: node.back }, history }, 'back');
        return true;
      }
      if (!state.history.length) return false;
      set({ ...state, step: state.history[state.history.length - 1], history: state.history.slice(0, -1) }, 'back');
      return true;
    },

    // Cambiar de Android a iPhone (o a la versión sencilla) conserva el recorrido.
    setOS(os) {
      if (!OS_VALUES.includes(os)) throw new Error(`ALERTA CHAT: sistema desconocido «${os}».`);
      if (os !== state.os) set({ ...state, os }, 'os');
    },

    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}
