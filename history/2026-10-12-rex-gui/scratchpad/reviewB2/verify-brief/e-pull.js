const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surface = D.surfaces.find((s) => s.id === 'concrete');
console.log('objects', D.objects.filter(o=>/777|boeing/i.test(o.id+o.name)).map(o=>o.id+' '+o.m));
const obj = D.objects.find((o) => /777/.test(o.id));
console.log('VIB.TH', JSON.stringify(P.VIB.TH));
for (const kg of [1e7, 1e9, 1e12]) for (const own of [true, false]) {
  const c = { F: kg * g, mode: 'comic', surface, anchor: 'friction', airAbsorb: 1, keepForm: true, ownRecoil: own, unbreakable: true, body: P.makeBody({ build: 'rex', H: 3.048, m: 3007 }) };
  const r = P.pull(c, obj);
  const J = P.vToMomentum(r.vEnd, obj.m) + r.resist * r.t10m;
  const src = isFinite(r.t10m) ? P.impulseSource(surface, J, r.t10m) : null;
  console.log('kg', kg.toExponential(0), 'own', own, 'canMove', r.canMove, 'accel', r.accel.toFixed(3), 't10m', r.t10m.toFixed(3), 'J', J.toExponential(3),
    src ? ['ppv@1m', (P.ppvAt(src, 1) * 1000).toFixed(2), '@2m', (P.ppvAt(src, 2) * 1000).toFixed(2), '@3m', (P.ppvAt(src, 3) * 1000).toFixed(2), '@5m', (P.ppvAt(src, 5) * 1000).toFixed(2), 'plaster@1m', P.plasterOver(src, 1), 'plaster@5m', P.plasterOver(src, 5)].join(' ') : '');
}
const M = P.RESTRAINT.MOVES.pull; console.log('MOVES.pull keys', Object.keys(M));
