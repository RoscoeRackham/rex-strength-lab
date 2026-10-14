const P = require('../lab/src/engine.js'); global.window = {}; require('../lab/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), bO = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const surf = D.surfaces.find((s) => s.id === 'concrete');
const base = { F: 1e5 * 0.90718474 * g, mode: 'comic', body, surface: surf, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
for (const use of [undefined, 34.4e3 * g]) {
  const c = Object.assign({}, base, use ? { use } : {});
  const t = P.tossPartner(c, bO, 'Ollie', 'easy', 10, 'friction');
  console.log('use', use, t.result, 'v', t.v, 'F', t.catch && t.catch.F, 'tStroke', t.catch && t.catch.tStroke, 'clean', t.catch && t.catch.clean, 'TgT', JSON.stringify(t.toGroundT), 'TgC', JSON.stringify(t.toGroundC));
  const src = t.toGroundC && P.impulseSource(surf, t.toGroundC.J, t.toGroundC.T);
  const srcT = t.toGroundT && P.impulseSource(surf, t.toGroundT.J, t.toGroundT.T);
  console.log('  ppv5 C', src && P.ppvAt ? P.ppvAt(src, 5) : '', 'T', srcT && P.ppvAt ? P.ppvAt(srcT, 5) : '');
  const t0 = P.tossPartner(Object.assign({}, c, { airAbsorb: 0 }), bO, 'Ollie', 'easy', 10, 'friction');
  console.log('  real air', t0.result, t0.flight && t0.flight.vImpact);
}
console.log(Object.keys(P).filter(k=>/ppv|reach|plaster|impulse/i.test(k)));
