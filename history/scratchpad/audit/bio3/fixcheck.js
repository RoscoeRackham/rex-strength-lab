const fs = require('fs');
const src = fs.readFileSync('/home/user/dino-strength-sim/src/engine.js', 'utf8');
global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
function load(push, whip) {
  let s = src.replace("throwPush: { vmax: 55, forceFrac: 0.3 }", `throwPush: { vmax: ${push.vmax}, forceFrac: ${push.ff} }`)
             .replace("throwWhip: { vmax: 55, forceFrac: 0.3 }", `throwWhip: { vmax: ${whip.vmax}, forceFrac: ${whip.ff} }`);
  if (s === src && !(push.vmax === 55 && push.ff === 0.3 && whip.vmax === 55 && whip.ff === 0.3)) throw new Error('patch failed');
  const m = { exports: {} };
  new Function('module', 'exports', 'self', s)(m, m.exports, undefined);
  return m.exports;
}
const shot = D.objects.find(o => o.id === 'shot'), ball = D.objects.find(o => o.id === 'baseball');
const surf = D.surfaces.find(s => s.id === 'concrete');
function report(tag, P) {
  const body = P.makeBody({});
  const c = (kg, mode) => ({ F: kg * P.K.g, mode, body, surface: surf, groundHolds: false, anchor: 'friction' });
  const row = [];
  for (const mode of ['real', 'comic']) {
    const s = P.throwObject(c(511, mode), shot, 37), b = P.throwObject(c(511, mode), ball, 0);
    row.push(`${mode}@511: shot ${s.v.toFixed(2)} m/s ${s.flight.range.toFixed(2)} m, ball ${b.v.toFixed(2)}`);
  }
  console.log(tag, row.join(' | '), '| comicFrac push', P.MUSCLE.throwPush.comicFrac.toFixed(4), 'whip', P.MUSCLE.throwWhip.comicFrac.toFixed(4));
  for (const [nm, kg] of [['spidey', 10 * 907.18474], ['thing', 100 * 907.18474], ['hulkSW', 150e9 * 907.18474], ['inf', Infinity]]) {
    const out = [];
    for (const mode of ['real', 'comic']) {
      const s = P.throwObject(c(kg, mode), shot, 45), b = P.throwObject(c(kg, mode), ball, 45);
      const car = P.throwObject(c(kg, mode), D.objects.find(o => o.id === 'car'), 45);
      out.push(`${mode}: ball ${b.v.toPrecision(4)} shot ${s.v.toPrecision(4)} car ${car.v.toPrecision(4)}`);
    }
    console.log('   ', nm.padEnd(7), out.join(' | '));
  }
}
report('ORIGINAL  ', load({ vmax: 55, ff: 0.3 }, { vmax: 55, ff: 0.3 }));
report('BIO-3 FIX ', load({ vmax: 55, ff: 0.358 }, { vmax: 84.5, ff: 0.3 }));
