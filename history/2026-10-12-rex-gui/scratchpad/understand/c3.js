global.window = {};
global.performance = require('perf_hooks').performance;
const P = require('./head/engine.js'); require('./head/data.js'); const D = window.DINO_DATA;
const g = 9.80665, K = P.K;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const objById = (id) => D.objects.find((o) => o.id === id);
const S = { F: 100 * 907.18474 * g, sid: 'concrete', anchor: 'friction', oAnchor: 'friction', gh: false, near: 5 };
const mkR = (u) => ({ F: Math.min(S.F, u), mode: 'comic', body: P.makeBody({ H: 3.048, m: 3007, build: 'rex' }), surface: surf(S.sid), groundHolds: S.gh, anchor: S.anchor });
const mkO = (u) => Object.assign(mkR(u), { body: P.makeBody({ H: 3.048, m: 3007, build: 'ollie' }), anchor: S.oAnchor });
const need = (m) => P.W8.WALK_LOAD * m * g / P.MUSCLE.jump.forceFrac;
const lo = need(3007), hi = S.F;
console.log('lo', (lo / g).toFixed(1), 'kg-force; hi', (hi / g).toFixed(0), 'kg; grid points', Math.ceil(2 * Math.log10(hi / lo)) + 1);
const runs = {
  arm: (u) => P.armWrestle(mkR(u), mkO(u)),
  shove: (u) => P.shove(mkR(u), mkO(u)),
  throwP: (u) => P.throwPartner(mkR(u), mkO(u), 45),
  catch: (u) => [P.catchLeg(mkR(u), mkO(u), objById('baseball'), 10, 'easy'), P.catchLeg(mkO(u), mkR(u), objById('baseball'), 10, 'easy')],
  catchCar: (u) => [P.catchLeg(mkR(u), mkO(u), objById('car'), 30, 'hard'), P.catchLeg(mkO(u), mkR(u), objById('car'), 30, 'hard')],
  collide: (u) => P.collide(mkO(u), mkR(u), { source: 'sprint' }),
};
for (const [k, fn] of Object.entries(runs)) {
  // time 5 probes across the effort range
  const us = [lo, Math.sqrt(lo * hi), hi, hi * 0.5, lo * 3];
  const t0 = performance.now();
  for (const u of us) fn(u);
  console.log(k.padEnd(8), 'ms/probe', ((performance.now() - t0) / us.length).toFixed(1));
}
