// Convierte un nodo del guion en lo que necesitan las vistas.
// - La conversación se arma con el RECORRIDO real: desde el último nodo que inicia el chat
//   (`chat.start`) hasta el actual. Así dos ramas pueden llegar al mismo nodo con historias distintas.
// - La respuesta elegida (`say`) se inserta como mensaje enviado al comienzo de cada paso.
// - Si el nodo aún no está escrito, devuelve un nodo provisional (desarrollo por fases).

export function resolveNode(story, manifest, id, path = [{ id }]) {
  const entry = manifest[id];
  if (!entry) throw new Error(`ALERTA CHAT: el nodo «${id}» no existe en el manifiesto.`);

  const raw = story[id];
  if (!raw) {
    return {
      id,
      app: entry.app,
      view: 'placeholder',
      title: entry.title,
      phase: entry.phase,
      guide: `Esta parte se construye en la Fase ${entry.phase}.`,
      pending: true,
    };
  }

  const node = { ...raw, id, app: entry.app, title: entry.title };
  if (raw.chat) node.chat = { ...raw.chat, messages: collectMessages(story, path, raw.chat.thread) };
  return node;
}

function collectMessages(story, path, thread) {
  let from = 0;
  path.forEach((step, i) => {
    const chat = story[step.id]?.chat;
    if (chat?.thread === thread && chat.start) from = i;
  });

  const messages = [];
  path.slice(from).forEach((step, i, steps) => {
    const node = story[step.id];
    if (node?.chat?.thread !== thread) return;
    const isNew = i === steps.length - 1;
    // La respuesta toma la hora del primer mensaje del paso (mismo formato que la conversación).
    if (step.say) messages.push({ from: 'me', time: node.chat.add?.[0]?.time ?? node.clock, text: step.say, isNew });
    for (const m of node.chat.add ?? []) messages.push({ ...m, isNew });
  });
  return messages;
}
