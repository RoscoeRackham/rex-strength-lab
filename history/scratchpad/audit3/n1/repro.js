global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const E = window.ROAR_PHYSICS || P;
const D = window.DINO_DATA;
const g = 9.80665;
console.log(D.tiers.map(t => t.id + ':' + t.liftKg).join(' '));
const body = (E.makeBody||P.makeBody)({ H: 2, m: 180 });
function run(surfId, objId, ang, kg, mode, anchor) {
  const surface = D.surfaces.find(s => s.id === surfId);
  const c = { F: kg === Infinity ? Infinity : kg * g, mode, body, surface, groundHolds: false, anchor, record: true };
  const r = E.throwObject(c, D.objects.find(o => o.id === objId), ang);
  return r;
}
for (const [s,o,a,an] of [['concrete','tank',30,'friction'],['concrete','car',45,'friction'],['granite','bus',45,'braced'],['sand','tank',30,'friction']]) {
  console.log('---', s, o, a, an);
  for (const kg of [1e4, 1e5, 1e6, Math.pow(10,6.2), 1e8, 1e12, 1e20, 1e34, 1e300, Infinity]) {
    const r = run(s,o,a,kg,'real',an);
    console.log(kg, 'v', r.v && r.v.toFixed(3), 'dist', r.flight && r.flight.range != null ? r.flight.range : (r.flight && Object.keys(r.flight).slice(0,8).join(',')), 'held', r.heldBack, 'recoilV', r.recoilV && r.recoilV.toFixed(2), 'sink', r.sinkRatio, 'basis', r.basis);
  }
}
