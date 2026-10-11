const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K, g = K.g;
const D = (function(){ const window = {}; eval(require('fs').readFileSync('/home/user/dino-strength-sim/src/data.js','utf8')); return window.DINO_DATA; })();
for (const [v, tMax] of [[8000, 4 * 86400], [8000, undefined], [9000, 4 * 86400]]) {
  const t0 = Date.now();
  const e = P.fly({ v0: v, thetaDeg: 0, h0: 1.8, m: 1, A: 1, Cd: 0, tMax });
  console.log(`vacuum horizontal v=${v} tMax=${tMax || '30 d'}: steps ${e.steps} time ${(e.time / 86400).toFixed(3)} d timedOut=${e.timedOut} escaped=${e.escaped} vImpact=${e.vImpact} range ${(e.range / 1e3).toFixed(0)} km  [${Date.now() - t0} ms]`);
}
// UI path: throw at 0 deg where launch speed is 7.9-11.2 km/s; ghost uses Cd 0, tMax 4 d
const body = P.makeBody({});
const ctx = (kg) => ({ F: kg * g, mode: 'comic', body, surface: D.surfaces.find(s => s.id === 'concrete'), groundHolds: false, anchor: 'friction' });
for (const id of ['tank', 'shot']) {
  const o = D.objects.find(x => x.id === id);
  const kg = P.threshold((F) => P.throwObject(ctx(F / g), o, 0).v >= 9000, 1e2, 1e40) / g;
  const lk = Math.ceil(Math.log10(kg) * 100) / 100;
  const r = P.throwObject(ctx(10 ** lk), o, 0);
  const t0 = Date.now();
  const ghost = !r.flight.escaped && r.flight.range < 5e6 ? P.fly({ v0: r.v, thetaDeg: 0, h0: body.releaseHeight, m: o.m, A: o.area, Cd: 0, record: true, tMax: 4 * 86400 }) : null;
  console.log(`${id} 0deg logKg ${lk}: v ${r.v.toFixed(0)} drag range ${(r.flight.range / 1e3).toFixed(1)} km; ghost steps ${ghost && ghost.steps} timedOut ${ghost && ghost.timedOut} range ${ghost && (ghost.range / 1e3).toFixed(0)} km [${Date.now() - t0} ms per render]`);
}
