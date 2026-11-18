// Escapa todo texto que viene del guion antes de insertarlo en el HTML.
const MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (value = '') => String(value).replace(/[&<>"']/g, (c) => MAP[c]);

// Une fragmentos ignorando vacíos (false, null, undefined, '').
export const join = (parts) => parts.filter(Boolean).join('');
