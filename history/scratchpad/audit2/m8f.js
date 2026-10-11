global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const A = require('/home/user/dino-strength-sim/src/engine.js');
const B = require('./engine_m8.js');
console.log('comicFrac orig', A.MUSCLE.stomp.comicFrac, 'patched', B.MUSCLE.stomp.comicFrac);
const g = A.K.g;
const s = D.surfaces.find((x) => x.id === 'concrete');
for (const P of [A, B]) {
  const body = P.makeBody({ H: 2, m: 180 });
  const out = [];
  for (const mode of ['comic', 'real']) for (const kg of [511, 90718.474, 1e9]) {
    const r = P.stomp({ F: kg * g, mode, body, surface: s, groundHolds: false, anchor: 'friction' });
    out.push(mode + ' ' + kg + ' vFoot ' + r.vFoot.toFixed(3) + ' vBody ' + r.vBody.toFixed(3) + ' E ' + r.E.toExponential(4));
  }
  console.log(out.join('\n'));
  console.log('---');
}
// calibration-context check: real mode, bolted, groundHolds
for (const [nm, P] of [['orig', A], ['patched', B]]) {
  const body = P.makeBody({});
  const surface = { qult: 1e9, mu: 0.8, shear: 1e7, rho: 2400 };
  const base = { F: P.CAL_LIFT_KG * g, body, surface, groundHolds: true, anchor: 'bolted' };
  console.log(nm, 'real cal stomp vFoot', P.stomp(Object.assign({}, base, { mode: 'real' })).vFoot, 'comic', P.stomp(Object.assign({}, base, { mode: 'comic' })).vFoot);
}
