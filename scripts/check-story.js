// npm run check — valida el guion contra el manifiesto de los 72 nodos.
import { STORY, MANIFEST, START, OVERLAYS, OVERLAY_TARGETS } from '../src/story/index.js';
import { validateStory } from '../src/engine/validate-story.js';

const r = validateStory({
  story: STORY,
  manifest: MANIFEST,
  start: START,
  overlays: OVERLAYS,
  overlayTargets: OVERLAY_TARGETS,
});

console.log(`ALERTA CHAT · guion: ${r.written} nodos escritos de ${r.total} en el manifiesto.`);
for (const w of r.warnings) console.log(`  aviso: ${w}`);

const byPhase = {};
for (const id of r.pending) (byPhase[MANIFEST[id].phase] ??= []).push(id);
for (const [phase, ids] of Object.entries(byPhase)) {
  console.log(`  pendientes (Fase ${phase}): ${ids.length} → ${ids.join(', ')}`);
}

if (r.errors.length) {
  for (const e of r.errors) console.error(`  ERROR: ${e}`);
  process.exit(1);
}
console.log('  sin errores.');
