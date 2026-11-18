// Revisa el guion contra el manifiesto.
// Errores: destinos inexistentes, nodos fuera del manifiesto, más de 3 opciones, opciones sin texto,
// elementos peligrosos (campos de texto, formularios, enlaces navegables o direcciones reales).
// Avisos: nodos escritos que no se alcanzan. Pendientes: nodos del manifiesto aún sin escribir.

const FORBIDDEN = [
  { re: /<\s*(input|textarea)/i, why: 'un campo de texto real' },
  { re: /<\s*form/i, why: 'un formulario real' },
  { re: /href\s*=/i, why: 'un enlace navegable (href)' },
  { re: /https?:\/\/(?![^\s"']*\.invalid\b)/i, why: 'una dirección web que no termina en .invalid' },
];

export function validateStory({ story, manifest, start, overlays = [], overlayTargets = [] }) {
  const errors = [];
  const warnings = [];

  for (const id of Object.keys(story)) {
    if (!manifest[id]) errors.push(`«${id}» está en el guion pero no en el manifiesto.`);
  }

  const targetsOf = (node) => [
    node.next?.to,
    node.then,
    node.back,
    ...(node.choices ?? []).map((c) => c.to),
    ...(node.apps ?? []).map((a) => a.to),
    ...(node.list?.rows ?? []).map((r) => r.to),
  ].filter(Boolean);

  for (const [id, node] of Object.entries(story)) {
    for (const to of targetsOf(node)) {
      if (!manifest[to]) errors.push(`«${id}» apunta a «${to}», que no existe.`);
    }
    if ((node.choices?.length ?? 0) > 3 && node.view !== 'outcome') errors.push(`«${id}» tiene más de 3 opciones.`);
    for (const c of node.choices ?? []) {
      if (!c.say && !c.label) errors.push(`«${id}» tiene una opción sin texto.`);
      if (c.say && c.label) errors.push(`«${id}»: una opción no puede ser respuesta (say) y acción (label) a la vez.`);
    }
    const text = JSON.stringify(node);
    for (const { re, why } of FORBIDDEN) if (re.test(text)) errors.push(`«${id}» contiene ${why}.`);
  }

  const reached = new Set();
  const queue = [start, ...overlayTargets];
  while (queue.length) {
    const id = queue.shift();
    if (reached.has(id)) continue;
    reached.add(id);
    if (story[id]) queue.push(...targetsOf(story[id]));
  }
  for (const id of Object.keys(story)) {
    if (!reached.has(id)) warnings.push(`«${id}» está escrito pero no se puede alcanzar desde ${start}.`);
  }

  const pending = Object.keys(manifest).filter((id) => !story[id] && !overlays.includes(id));
  return { errors, warnings, pending, written: Object.keys(story).length, total: Object.keys(manifest).length };
}
