// "Mi recorrido": qué pantallas se visitaron y qué opciones se eligieron. Se guarda en localStorage
// (solo identificadores del guion; ningún dato personal) y sobrevive al cerrar la página.
// Tres cosas distintas: pantallas visitadas (visited), opciones elegidas (decisions "pantalla#posición")
// y desenlaces descubiertos (pantallas de resultado dentro de visited).
const KEY = 'alerta-chat:recorrido:v2';
const empty = () => ({ v: 3, visited: [], decisions: [] });
// Ids de opciones cuyo destino cambió al separar las ramas de WhatsApp (v3). Se aplican una sola vez.
const LEGACY = { 'W02>W03B': 'W02>W03A', 'W02>W03B.2': 'W02>W03B', 'W05C>W04R': 'W05C>W04C' };

function read() {
  try {
    const d = JSON.parse(window.localStorage.getItem(KEY) ?? 'null');
    if (Array.isArray(d?.visited) && Array.isArray(d?.decisions)) {
      if (d.v !== 3) {
        d.decisions = d.decisions.map((x) => LEGACY[x] ?? x);
        d.v = 3;
      }
      return d;
    }
  } catch {
    /* sin almacenamiento o datos dañados: se empieza de cero */
  }
  return empty();
}

let data = typeof window === 'undefined' ? empty() : read();

function add(list, value) {
  if (list.includes(value)) return;
  list.push(value);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* la práctica sigue funcionando sin guardar */
  }
}

export const progress = {
  visit: (id) => add(data.visited, id),
  // Una opción cuenta solo cuando la persona la elige (no al volver atrás). `choiceId` es el id estable de la opción.
  decide: (choiceId) => add(data.decisions, choiceId),
  // Convierte el formato anterior ("pantalla#posición") a identificadores estables sin perder datos.
  migrate(idOf) {
    const next = data.decisions.map((d) => {
      const m = /^(.+)#(\d+)$/.exec(d);
      return (m && idOf(m[1], Number(m[2]))) || d;
    });
    if (next.join() === data.decisions.join()) return;
    data.decisions = [...new Set(next)];
    try {
      window.localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* se migra en memoria */
    }
  },
  hasVisited: (id) => data.visited.includes(id),
  hasDecided: (choiceId) => data.decisions.includes(choiceId),
  reset() {
    data = empty();
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* nada que borrar */
    }
  },
};
