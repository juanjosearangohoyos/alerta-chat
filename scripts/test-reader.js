// npm test — división en oraciones y elección de voz del lector.
import assert from 'node:assert/strict';
import { sentences, pickVoice, spokenText, numberToWords } from '../src/ui/reader.js';

assert.deepEqual(sentences('Envió $350.000, pero se detuvo. ¿Quién es? Revise soporte-cuentas.invalid hoy.'), [
  'Envió $350.000, pero se detuvo.',
  '¿Quién es?',
  'Revise soporte-cuentas.invalid hoy.',
]);
assert.deepEqual(sentences('Antes de las 6:00 p. m. llame al banco.'), ['Antes de las 6:00 p. m. llame al banco.']);
assert.deepEqual(sentences('Lo que hizo bien'), ['Lo que hizo bien']);
assert.deepEqual(sentences(''), []);

const v = (lang) => ({ lang, name: lang });
assert.equal(pickVoice([v('en-US'), v('es-ES'), v('es_MX'), v('es-CO')]).lang, 'es-CO');
assert.equal(pickVoice([v('es-ES'), v('es_MX')]).lang, 'es_MX');
assert.equal(pickVoice([v('en-US'), v('es-ES')]).lang, 'es-ES');
assert.equal(pickVoice([v('en-US')]), null);
// Cantidades en pesos colombianos: se dicen en palabras, nunca como dólares.
const dice = (t) => spokenText(t);
assert.equal(dice('Usted envió $550.000 COP hoy.'), 'Usted envió quinientos cincuenta mil pesos colombianos hoy.');
assert.equal(dice('$350.000 COP'), 'trescientos cincuenta mil pesos colombianos');
assert.equal(dice('el reenvío de $4.900 COP.'), 'el reenvío de cuatro mil novecientos pesos colombianos.');
assert.equal(dice('compras por $890.000 COP.'), 'compras por ochocientos noventa mil pesos colombianos.');
assert.equal(dice('$1.250.000 COP'), 'un millón doscientos cincuenta mil pesos colombianos');
assert.equal(dice('$2.000.000 COP'), 'dos millones de pesos colombianos');
assert.equal(dice('$21.000 COP'), 'veintiún mil pesos colombianos');
assert.equal(dice('$100.000 COP'), 'cien mil pesos colombianos');
assert.equal(dice('Sin dinero aquí.'), 'Sin dinero aquí.');
assert.equal(numberToWords(1999), 'mil novecientos noventa y nueve');
console.log('Lector: oraciones, voces y pesos colombianos correctos.');
