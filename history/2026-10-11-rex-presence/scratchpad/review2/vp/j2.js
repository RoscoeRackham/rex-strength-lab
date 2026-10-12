const { P, D, g, surf, obj, rex, ctxOf } = require('./lib.js');
const show = (label, mv, c, o) => {
  const p = P.RESTRAINT.planNow(mv, c, o);
  const M = P.RESTRAINT.MOVES[mv];
  const ra = p.run(undefined);
  const gl = p.goal();
  console.log('==', label, 'lo', (p.lo/g).toPrecision(3));
  console.log(' goal', gl.never ? 'never' : (gl.use/g).toPrecision(3), 'goal all-out?', M.goal(ra, p.opt));
  console.log(' haz', p.hazards().map(h => h.id + ':' + (h.never ? 'never' : (h.use / g).toPrecision(3))).join(' '));
  console.log(' presets', p.presets().map(h => h.id + ':' + (h.never ? 'never' : (h.use / g).toPrecision(3))).join(' '));
  console.log(' ceiling', p.ceiling().by);
  console.log(' allout haz', P.RESTRAINT.HAZARDS.filter(h => h.test(M, ra, p.opt)).map(h => h.id).join(','), 'presets on', P.RESTRAINT.PRESETS.filter(h => h.test(M, ra, p.opt)).map(h => h.id).join(','));
  return p;
};
let p = show('jump concrete 1e7', 'jump', ctxOf(1e7), { target: 3, near: 5 });
for (let e = 1.5; e <= 7; e += 0.5) { const r = p.run(Math.pow(10, e) * g); console.log('  ', e, r.v.toPrecision(5), r.heldBack ? 'held' : '', r.groundFails ? 'gf' : '', r.landing && r.landing.ratio && r.landing.ratio.toFixed(2)); }
p = show('throw loco concrete 1e12', 'throw', ctxOf(1e12), { obj: obj('loco'), angle: 45, target: 30, near: 5 });
for (let e = 1.5; e <= 12; e += 0.5) { const r = p.run(Math.pow(10, e) * g); console.log('  ', e, r.canMove, r.v && r.v.toPrecision(5), r.heldBack ? 'held' : '', r.flight && r.flight.range && r.flight.range.toPrecision(3)); }
