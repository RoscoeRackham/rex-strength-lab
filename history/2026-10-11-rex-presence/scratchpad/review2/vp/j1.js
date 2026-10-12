const { P, D, g, surf, obj, rex, ctxOf } = require('./lib.js');
console.log(D.surfaces.map(s=>s.id).join(','));
const c = ctxOf(1e12, { surface: surf('ice') });
const p = P.RESTRAINT.planNow('jump', c, { target: 3, near: 5 });
for (let e = 4; e <= 12; e += 0.5) {
  const r = p.run(Math.pow(10, e) * g);
  const haz = P.RESTRAINT.HAZARDS.filter(h => h.test(P.RESTRAINT.MOVES.jump, r, p.opt)).map(h => h.id);
  console.log(e, r.v.toPrecision(5), r.heldBack ? 'held' : '', r.groundFails ? 'gf' : '', haz.join(','));
}
console.log('ceiling', p.ceiling());
console.log('haz', p.hazards().map(h => h.id + ':' + (h.never ? 'never' : (h.use / g).toPrecision(3))));
console.log('presets', p.presets().map(h => h.id + ':' + (h.never ? 'never' : (h.use / g).toPrecision(3))));
const ra = p.run(undefined);
console.log('allout v', ra.v, 'haz', P.RESTRAINT.HAZARDS.filter(h => h.test(P.RESTRAINT.MOVES.jump, ra, p.opt)).map(h => h.id));
