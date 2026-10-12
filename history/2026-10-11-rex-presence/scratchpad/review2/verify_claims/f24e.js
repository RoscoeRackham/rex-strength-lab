global.window = {};
const P = require('./head/engine.js');
require('./head/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
for (const [oid, gh, gentle] of [['loco', false, false], ['loco', true, true], ['tank', true, true]]) {
  const c = { F: 1e9 * g, mode: 'comic', body: rex, surface: surf('concrete'), groundHolds: gh, anchor: 'friction', gentleHold: gentle };
  const o = { near: 5, target: 30, obj: obj(oid), angle: 45, gentleHold: gentle };
  const pl = P.RESTRAINT.planNow('throw', c, o);
  const ra = pl.run(pl.hi);
  console.log('==', oid, 'comicGround', gh, 'gentle', gentle, 'allout obj v', ra.v.toFixed(0), 'recoil', JSON.stringify(Object.keys(ra).filter(k => /recoil|vBody|vR/i.test(k)).map(k => [k, ra[k]])).slice(0, 300));
  const ce = pl.ceiling(); console.log(' ceiling by', ce.by, 'use kg', (ce.below / g).toPrecision(3));
  for (let lk = 5; lk <= 9; lk += 0.5) { const r = pl.run(Math.pow(10, lk) * g); console.log('  ', lk, 'obj v', r.v && r.v.toFixed(1), 'recoilV', r.recoilV != null ? r.recoilV.toFixed(1) : r.recoil && r.recoil.v); }
}
