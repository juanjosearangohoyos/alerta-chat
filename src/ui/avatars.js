// Fotos de perfil ilustradas y genéricas (sin nombres). Ninguna foto de persona real.

const PEOPLE = {
  p1: { bg: '#B9D7EA', skin: '#B9825A', hair: '#2B1E16', shirt: '#2F5D8A', long: false },
  p2: { bg: '#F3C6D3', skin: '#D8A07A', hair: '#4A2C1A', shirt: '#9B3D6B', long: true },
};

function person({ bg, skin, hair, shirt, long }) {
  return `
    <rect width="40" height="40" fill="${bg}"/>
    ${long ? `<path d="M11.5 18a8.5 8.5 0 0 1 17 0v13h-17z" fill="${hair}"/>` : ''}
    <ellipse cx="20" cy="37" rx="12.5" ry="9" fill="${shirt}"/>
    <rect x="17.5" y="22" width="5" height="6" rx="2" fill="${skin}"/>
    <circle cx="20" cy="17" r="7" fill="${skin}"/>
    <path d="M12.8 17.2a7.2 7.2 0 0 1 14.4 0c-1.6-3.4-4.6-4.6-7.2-4.6s-5.6 1.2-7.2 4.6z" fill="${hair}"/>`;
}

const SHAPES = {
  unknown: `<rect width="40" height="40" fill="#C2C2C8"/><circle cx="20" cy="16" r="7" fill="#fff"/><ellipse cx="20" cy="36" rx="12.5" ry="9.5" fill="#fff"/>`,
  // Google Mensajes (Android): círculo de color con silueta blanca
  gm: `<rect width="40" height="40" fill="#188038"/><circle cx="20" cy="16" r="6.5" fill="#fff"/><ellipse cx="20" cy="33" rx="11" ry="8" fill="#fff"/>`,
  group: `<rect width="40" height="40" fill="#CFD8DC"/><circle cx="14" cy="17" r="5" fill="#fff"/><circle cx="26" cy="17" r="5" fill="#fff"/><ellipse cx="14" cy="33" rx="8" ry="7" fill="#fff"/><ellipse cx="26" cy="33" rx="8" ry="7" fill="#fff"/>`,
  shield: `<rect width="40" height="40" fill="#1F4FA8"/><path d="M20 8l10 4v7c0 6.5-4.3 11.4-10 13-5.7-1.6-10-6.5-10-13v-7z" fill="#fff"/><path d="M15.5 20l3.2 3.2 6-6.4" fill="none" stroke="#1F4FA8" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  clinic: `<rect width="40" height="40" fill="#D3ECEC"/><rect x="16.5" y="10" width="7" height="20" rx="1.5" fill="#2E7D7D"/><rect x="10" y="16.5" width="20" height="7" rx="1.5" fill="#2E7D7D"/>`,
};

export function avatar(key = 'unknown', size = 44) {
  const body = PEOPLE[key] ? person(PEOPLE[key]) : SHAPES[key] ?? SHAPES.unknown;
  return `<span class="avatar" style="--size:${size}px" aria-hidden="true"><svg viewBox="0 0 40 40" width="${size}" height="${size}" focusable="false">${body}</svg></span>`;
}
