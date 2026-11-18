// npm test — auditoría automática de las tres historias (además de npm run check).
//  1. El grafo no tiene ciclos y todo recorrido termina en un desenlace.
//  2. Ninguna ruta repite un mensaje del remitente ni una respuesta elegida.
//  3. Cada desenlace solo cita lo que aparece en TODAS las rutas que llegan a él (montos, cuentas y frases entre comillas).
//  4. Cada decisión tiene 2 o 3 opciones y al menos una evita un desenlace de riesgo.
//  5. Los desenlaces ofrecen los cuatro botones finales; los montos llevan "COP"; no hay nombres ni parentescos.
// Use `npm test -- --list` para imprimir todas las rutas.
import { STORY } from '../src/story/index.js';

const STORIES = [
  ['WhatsApp', 'W00', 'W'],
  ['Messenger', 'M00', 'M'],
  ['SMS', 'S00', 'S'],
];
const END_LABELS = ['Volver a practicar', 'Elegir otra aplicación', 'Volver al inicio', 'Finalizar simulación'];
const FORBIDDEN_WORDS = /\b(mij[ao]|t[ií][ao]|mam[aá]|pap[aá]|abuel[oa]|sobrin[oa]|hij[oa]|señora|Andr[eé]s|Daniela|Laura|Dani)\b/i;
const LIST = process.argv.includes('--list');

const targets = (n, prefix) => [
  ...new Set([n.next?.to, ...(n.choices ?? []).map((c) => c.to), ...(n.list?.rows ?? []).map((r) => r.to)].filter((t) => t?.startsWith(prefix))),
];
const strings = (v) => (typeof v === 'string' ? [v] : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : []);
const norm = (t) => t.toLowerCase().replace(/[.,;:!?¿¡…]+/g, ' ').replace(/\s+/g, ' ').trim();

const failures = [];
const fail = (msg) => failures.push(msg);

for (const [name, start, prefix] of STORIES) {
  // 1. Ciclos (DFS con pila) y nodos faltantes.
  const seen = new Set();
  const visit = (id, stack) => {
    const n = STORY[id];
    if (!n) return fail(`${name}: falta el nodo ${id}`);
    if (stack.includes(id)) return fail(`${name}: ciclo ${[...stack.slice(stack.indexOf(id)), id].join(' → ')}`);
    seen.add(id);
    if (n.view === 'outcome') return;
    const next = targets(n, prefix);
    if (!next.length) fail(`${name}: ${id} no tiene salida`);
    next.forEach((t) => visit(t, [...stack, id]));
  };
  visit(start, []);

  // Rutas completas: [{ id, say }]
  const paths = [];
  const walk = (id, say, trail) => {
    const n = STORY[id];
    const here = [...trail, { id, say }];
    if (n.view === 'outcome') return void paths.push(here);
    const edges = [...(n.choices ?? []).map((c) => [c.to, c.say]), ...(n.next ? [[n.next.to, undefined]] : []), ...(n.list?.rows ?? []).filter((r) => r.to).map((r) => [r.to, undefined])];
    for (const [to, s] of edges) if (to.startsWith(prefix) && !trail.some((t) => t.id === to)) walk(to, s, here);
  };
  walk(start, undefined, []);

  const byOutcome = new Map();
  for (const p of paths) {
    const last = p.at(-1).id;
    if (LIST) console.log(`${name}: ${p.map((s) => s.id).join(' → ')}`);

    // 2. Sin repeticiones dentro de la ruta.
    const sender = [];
    const says = [];
    let accountAsks = 0;
    for (const { id, say } of p) {
      if (say) {
        says.push(norm(say));
        if (/a qu[eé] cuenta/i.test(say)) accountAsks += 1;
      }
      for (const m of STORY[id].chat?.add ?? []) if (m.from === 'them') sender.push(norm(m.text));
    }
    const dup = (arr) => arr.find((t, i) => arr.indexOf(t) !== i);
    if (dup(sender)) fail(`${name}: la ruta ${p.map((s) => s.id).join('→')} repite el mensaje "${dup(sender)}"`);
    if (dup(says)) fail(`${name}: la ruta ${p.map((s) => s.id).join('→')} repite la respuesta "${dup(says)}"`);
    if (accountAsks > 1) fail(`${name}: la ruta ${p.map((s) => s.id).join('→')} pregunta dos veces por la cuenta`);

    (byOutcome.get(last) ?? byOutcome.set(last, []).get(last)).push(p);
  }

  // 3. Coherencia de cada desenlace con TODAS sus rutas.
  for (const [oid, ps] of byOutcome) {
    const o = STORY[oid];
    const claims = strings({ h: o.heading, a: o.happened, s: o.signals, t: o.todo });
    const facts = [...claims.join(' ').matchAll(/\$[\d.]+(?: COP)?|\d{3}-\d{3}-\d{4}|"[^"]+"/g)].map((m) => m[0]);
    for (const p of ps) {
      const evidence = norm(p.flatMap(({ id, say }) => [...(id === oid ? [] : strings(STORY[id])), say ?? '']).join(' '));
      for (const f of facts) {
        const needle = norm(f.replace(/^"|"$/g, '').replace(/ COP$/, ''));
        if (!evidence.includes(needle)) fail(`${name}: ${oid} cita ${f}, que no aparece en la ruta ${p.map((s) => s.id).join('→')}`);
      }
    }
  }

  // 4–5. Decisiones y desenlaces.
  const reach = new Map();
  const reachable = (id, stack = new Set()) => {
    if (reach.has(id)) return reach.get(id);
    const n = STORY[id];
    if (n.view === 'outcome') return new Set([id]);
    if (stack.has(id)) return new Set();
    stack.add(id);
    const out = new Set();
    for (const t of targets(n, prefix)) for (const o of reachable(t, stack)) out.add(o);
    stack.delete(id);
    reach.set(id, out);
    return out;
  };
  for (const id of seen) {
    const n = STORY[id];
    if (FORBIDDEN_WORDS.test(JSON.stringify(n))) fail(`${name}: ${id} contiene un nombre o parentesco`);
    for (const s of strings(n)) if (/\$[\d.]+(?! COP)/.test(s) && !/\$[\d.]+ COP/.test(s)) fail(`${name}: ${id} tiene un monto sin "COP": ${s.slice(0, 50)}`);
    if (n.view === 'outcome') {
      if (JSON.stringify(n.choices.map((c) => c.label)) !== JSON.stringify(END_LABELS)) fail(`${name}: ${id} no tiene los cuatro botones finales`);
      continue;
    }
    if (n.choices) {
      // Alternativas hermanas: destinos distintos, respuestas distintas y continuaciones de contenido no equivalente.
      const kids = n.choices.map((c) => c.to);
      if (new Set(kids).size !== kids.length) fail(`${name}: ${id} tiene dos opciones que llevan a la misma pantalla`);
      const says = n.choices.map((c) => norm(c.say ?? c.label ?? ''));
      if (new Set(says).size !== says.length) fail(`${name}: ${id} tiene dos opciones con el mismo texto`);
      const sig = (k) => norm(strings({ ...STORY[k], clock: '', choices: '', id: '', next: '' }).join(' '));
      const sigs = kids.filter((k) => STORY[k]).map(sig);
      if (new Set(sigs).size !== sigs.length) fail(`${name}: ${id} tiene alternativas con conversaciones equivalentes`);
      if (n.choices.length < 2 || n.choices.length > 3) fail(`${name}: ${id} tiene ${n.choices.length} opciones`);
      if (!n.choices.some((c) => [...reachable(c.to)].some((o) => STORY[o].tone !== 'risk'))) fail(`${name}: en ${id} ninguna opción evita un desenlace de riesgo`);
    }
  }
  console.log(`${name}: ${seen.size} pantallas · ${paths.length} rutas · ${byOutcome.size} desenlaces · sin ciclos`);
}

const ids = Object.values(STORY).flatMap((n) => (n.choices ?? []).map((c) => c.id));
if (ids.length !== new Set(ids).size || ids.some((i) => !i)) fail('los identificadores de opciones no son únicos');

if (failures.length) {
  failures.forEach((f) => console.error(`  FALLA: ${f}`));
  process.exit(1);
}
console.log('Todas las pruebas superadas.');
