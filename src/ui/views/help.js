// Canales oficiales de orientación y denuncia. Son enlaces reales, solo aparecen en secciones
// educativas (nunca dentro de los chats de la práctica) y se abren en una pestaña nueva.
// Verificados el 17 nov. 2026 en policia.gov.co. El teléfono de la página de Ciberseguridad es el contacto
// del centro, con horario de oficina: no es línea de emergencias ni línea de denuncias.
// Los números de los remitentes ficticios de las historias NUNCA son enlaces de llamada.
import { esc } from '../html.js';
import { icon } from '../icons.js';
import { rd } from '../reader.js';

export const PHONE = { display: '+57 1 5159700', tel: '+5715159700', ext: '30427' };

const LINKS = [
  ['Abrir Centro de Ciberseguridad', 'https://www.policia.gov.co/ciberseguridad'],
  ['Ir al CAI Virtual', 'https://caivirtual.policia.gov.co/'],
  ['Consultar cómo denunciar', 'https://www.policia.gov.co/denunciar-delitos-informaticos'],
];

const TIPS = [
  'No comparta códigos de verificación ni contraseñas.',
  'No haga transferencias por instrucciones de mensajes sospechosos.',
  'Verifique por canales independientes y oficiales.',
  'Conserve pantallazos y comprobantes cuando sea seguro.',
];

const KINDS = [
  ['Orientación:', 'el Centro de Ciberseguridad publica información oficial.'],
  ['Reportar un incidente:', 'el CAI Virtual recibe reportes de incidentes o delitos informáticos.'],
  ['Denuncia formal:', 'la página "Denunciar delitos informáticos" explica el trámite.'],
];

export const helpSection = () => `
  <section class="ac-section ac-help" aria-labelledby="help-h">
    <h2 class="ac-h2" id="help-h">${rd('¿Necesita ayuda o quiere reportar un posible fraude?')}</h2>
    <p class="ac-p">${rd('Estos son canales oficiales de la Policía Nacional de Colombia. Son enlaces reales y están fuera de los mensajes de la práctica.')}</p>
    <ul class="ac-list">${KINDS.map(([k, t]) => `<li><strong>${rd(k)}</strong> ${rd(t)}</li>`).join('')}</ul>
    <ul class="ac-links" role="list">
      ${LINKS.map(
        ([label, url]) => `<li><a class="ac-linkbtn" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${icon.external(24)}<span>${esc(label)}</span><span class="sr-only"> (se abre en una página nueva)</span></a></li>`,
      ).join('')}
    </ul>
    <p class="ac-p"><strong>${rd('Recomendaciones breves:')}</strong></p>
    <ul class="ac-list">${TIPS.map((t) => `<li>${rd(t)}</li>`).join('')}</ul>
    <div class="ac-phone">
      <p class="ac-p">${rd('El Centro de Ciberseguridad publica un teléfono de contacto, en horario de oficina de lunes a viernes.')}</p>
      <p class="ac-phone__num">${rd(`Teléfono: ${PHONE.display}. Extensión: ${PHONE.ext}.`)}</p>
      <ul class="ac-links" role="list">
        <li><a class="ac-linkbtn" href="tel:${PHONE.tel}">${icon.phone(24)}<span>Llamar al ${PHONE.display}</span></a></li>
        <li><button type="button" class="ac-linkbtn" data-action="copy-phone" data-number="${PHONE.display}">${icon.post(24)}<span>Copiar número</span></button></li>
      </ul>
      <p class="ac-small">${rd('Si su dispositivo no marca la extensión automáticamente, márquela cuando se la pidan. Este teléfono no es una línea de emergencias ni de denuncias. Consulte en el portal los datos actualizados.')}</p>
    </div>
    <p class="ac-small">${rd('Presentar un reporte o una denuncia no garantiza recuperar dinero ni una cuenta.')}</p>
  </section>`;
