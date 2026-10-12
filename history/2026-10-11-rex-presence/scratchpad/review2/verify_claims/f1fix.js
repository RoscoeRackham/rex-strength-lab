global.window = {};
const P = require('./engine_fix1.js');
require('./head/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
for (const [oid, sid, lk] of [['tank', 'concrete', 8], ['semi', 'concrete', 7], ['tank', 'granite', 8]]) {
  const c = { F: Math.pow(10, lk) * g, mode: 'comic', body: rex, surface: surf(sid), groundHolds: false, anchor: 'friction' };
  const o = { near: 5, target: 30, obj: obj(oid), angle: 45 };
  const M = P.RESTRAINT.MOVES.throw;
  const opt = Object.assign({ near: 5, groundHolds: false, m: 3007, body: rex, surface: c.surface }, o);
  const pl = P.RESTRAINT.planNow('throw', c, o);
  console.log('===', oid, sid, lk, 'lo', pl.lo / g, 'hi', pl.hi / g);
  for (let i = 0; i <= 2 * Math.log10(pl.hi / pl.lo) + 1; i++) {
    const u = Math.min(pl.hi, pl.lo * Math.pow(10, i / 2));
    const r = pl.run(u);
    console.log((u / g).toExponential(2), 'speed', M.speed(r).toPrecision(6), 'goal', M.goal(r, opt), 'range', r.range != null ? r.range.toFixed(1) : '-');
  }
  const ra = pl.run(Infinity === 0 ? 0 : pl.hi);
  console.log('allout speed', M.speed(ra), 'goal', M.goal(ra, opt));
  console.log('goal()', JSON.stringify(pl.goal()));
  console.log('ceiling()', JSON.stringify(pl.ceiling()));
  console.log('hazards at allout', P.RESTRAINT.HAZARDS.filter((h) => h.test(M, ra, opt)).map((h) => h.id));
  console.log('hazard results', JSON.stringify(pl.hazards()));
}
