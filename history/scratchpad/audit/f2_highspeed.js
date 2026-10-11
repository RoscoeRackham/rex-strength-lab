global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = global.window.DINO_DATA;
const K = P.K, g = K.g;
const objById = (id) => D.objects.find((o) => o.id === id);
function ctx(state) {
  const body = P.makeBody({ H: 2, m: 180 });
  const surface = D.surfaces.find((s) => s.id === 'concrete');
  return { F: Math.pow(10, state.logKg) * g, mode: state.mode, body, surface, groundHolds: false, anchor: 'friction' };
}
function run(state, objId, angle) {
  const c = ctx(state); const o = objById(objId);
  const r = P.throwObject(c, o, angle);
  const f = r.flight;
  if (!r.canMove || f.relativistic) { console.log(objId, state.mode, 'logKg', state.logKg, 'ang', angle, 'canMove', r.canMove, 'rel', f.relativistic); return; }
  const shown = f.range < 0.2 * (r.v * r.v / g);
  const claim = Math.min(r.v * r.v / g, 2e7);
  const t0 = Date.now();
  const vac = P.fly({ v0: r.v, thetaDeg: angle, h0: c.body.releaseHeight, m: o.m, A: o.area, Cd: 0, tMax: 30 * 86400 });
  console.log(objId.padEnd(8), state.mode.padEnd(5), 'logKg', state.logKg.toFixed(2), 'ang', String(angle).padStart(2), 'v', r.v.toExponential(3),
    '| drag range km', (f.range / 1e3).toFixed(3), f.escaped ? 'ESC' : '', '| shown', shown, '| claim km', (claim / 1e3).toFixed(1),
    '| vacuum', vac.escaped ? 'ESCAPED' : vac.timedOut ? 'TIMEOUT(orbit?) range km ' + (vac.range / 1e3).toFixed(0) : 'km ' + (vac.range / 1e3).toFixed(1), (Date.now() - t0) + 'ms');
}
for (const L of [6, 8, 10, 11, 11.5, 12, 12.04, 12.2, 13, 14]) for (const mode of ['comic', 'real']) run({ logKg: L, mode }, 'car', 45);
// find logKg giving ~8 km/s and ~20 km/s comic car 45
for (const mode of ['comic']) {
  for (const target of [3000, 8000, 10000, 20000]) {
    let lo = 3, hi = 16;
    for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; const v = P.throwObject(ctx({ logKg: m, mode }), objById('car'), 45).v; if (v < target) lo = m; else hi = m; }
    run({ logKg: lo, mode }, 'car', 45);
  }
}
