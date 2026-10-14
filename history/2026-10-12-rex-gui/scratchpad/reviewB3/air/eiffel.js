const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const K = P.K;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surface = D.surfaces.find(s => s.id === 'concrete');
const o = D.objects.find(x => x.id === 'eiffel');
for (const vt of [0.0101, 0.0105, 0.012]) {
  let lo = 1, hi = 1e40;
  for (let i = 0; i < 200; i++) { const mid = Math.sqrt(lo * hi); const r = P.throwObject({ F: mid * K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 0, keepForm: true, unbreakable: true, ownRecoil: true }, o, 0); if (r.v < vt * K.c) lo = mid; else hi = mid; }
  const r = P.throwObject({ F: hi * K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 0, keepForm: true, unbreakable: true, ownRecoil: true }, o, 0);
  const fa = P.fastAir(o, r.Eobj, 0, 1);
  console.log('dial kg', hi.toExponential(4), 'log', Math.log10(hi).toFixed(4), 'v/c', r.v / K.c, 'x', fa.x.toFixed(1), 'keep', fa.keep.toExponential(3), 'vOut km/s', (fa.vOut / 1e3).toFixed(2));
}
