import { general } from './general.js';
import { whatsapp } from './whatsapp.js';
import { messenger } from './messenger.js';
import { sms } from './sms.js';

export { MANIFEST, START, OVERLAYS, OVERLAY_TARGETS } from './manifest.js';

// Un solo guion para los tres sistemas (Android, iPhone y sencillo).
export const STORY = { ...general, ...whatsapp, ...messenger, ...sms };

// Identificador estable de cada opción: "pantalla>destino" (con ".2", ".3" si una pantalla tiene varias opciones
// al mismo destino, en el orden del guion). No depende del texto ni de reordenar opciones con destinos distintos.
for (const [nodeId, node] of Object.entries(STORY)) {
  const count = {};
  // Se copian las opciones: algunas (BLOCK, OPEN...) son objetos compartidos entre pantallas.
  if (node.choices) node.choices = node.choices.map((c) => {
    const base = `${nodeId}>${c.to ?? c.kind}`;
    count[base] = (count[base] ?? 0) + 1;
    return { ...c, id: count[base] === 1 ? base : `${base}.${count[base]}` };
  });
}
