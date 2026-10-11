global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
const Pf = require(__dirname + '/engine_fix.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const b = P.makeBody({ H: 2 });
const f = x => typeof x === 'number' ? x.toPrecision(3) : String(x);
console.log('objects:', D.objects.map(o => o.id + ':' + o.m).join(' '));
for (const s of D.surfaces) {
  const Nmax = s.qult * 2 * b.footArea;
  const over = D.objects.filter(o => (b.m + o.m) * g >= Nmax).map(o => o.id);
  console.log(s.id, 'Nmax', f(Nmax), 'overloaded objects:', over.join(','));
}
// sweep strengths for overloaded combos at 45 deg (UI default) and 0/1 deg
const tiers = D.tiers.map(t => [t.id, t.kg]);
console.log('tiers', JSON.stringify(D.tiers.map(t => [t.id, t.kg || t.liftKg || t.lift])));
for (const [sid, oid] of [['sand','car'],['clay','car'],['asphalt','tank'],['sand','bus'],['asphalt','bus']]) {
  const s = D.surfaces.find(x => x.id === sid), o = D.objects.find(x => x.id === oid);
  if (!o) continue;
  for (const kg of [511, 1000, 3000, 1e4, 3e4, 1e5, 1e6]) for (const deg of [1, 45]) {
    const c = { F: kg * g, mode: 'comic', body: b, surface: s, groundHolds: false, anchor: 'friction' };
    const r = P.throwObject(c, o, deg), q = Pf.throwObject(c, o, deg);
    if (r.v === q.v && r.recoilV === q.recoilV) continue;
    console.log(sid, oid, kg, deg + 'deg', '| orig R', f(r.anchor.R), 'v', f(r.v), 'rec', f(r.recoilV), 'canMove', r.canMove, '| fix R', f(q.anchor.R), 'v', f(q.v), 'rec', f(q.recoilV), 'canMove', q.canMove, '| v ratio', f(q.v / r.v));
  }
}
