const P0 = require('/home/user/dino-strength-sim/src/engine.js');
const P1 = require('./engine_patched.js');
const P2 = require('./engine_v_bio1_fix.js');
const g = 9.80665;
const surfaces = { sand: { qult: 150e3, mu: 0.5, shear: 20e3, rho: 1600 }, concrete: { qult: 10e6, mu: 0.8, shear: 2e6, rho: 2400 }, granite: { qult: 400e6, mu: 0.7, shear: 20e6, rho: 2700 } };
const objs = { shot: { m: 7.26, area: 0.0113, Cd: 0.47, crush: 250e6, rho: 7200 }, car: { m: 1360, area: 4, Cd: 1.0, crush: 1e6, rho: 300 }, bus: { m: 11500, area: 15, Cd: 1, crush: 1e6, rho: 150 }, tank: { m: 66800, area: 15, Cd: 1, crush: 1e9, rho: 1200 } };
// Use the implicit-fix engine (validated to 3.3e-4 vs reference) as the yardstick for the other patch.
const stats = {};
for (const H of [0.4, 2, 50]) for (const [sn, surface] of Object.entries(surfaces)) for (const anchor of ['friction', 'braced']) for (const gh of [false, true]) {
  const body = P0.makeBody({ H, m: 180 * Math.pow(H / 2, 3) });
  for (let lk = 2; lk <= 16; lk += 0.25) {
    const c = { F: Math.pow(10, lk) * g, mode: 'real', body, surface, groundHolds: gh, anchor };
    const pairs = [['jump', (P) => P.jump(c).v], ...Object.entries(objs).map(([n, o]) => ['throw:' + n, (P) => P.throwObject(c, o, 45).v])];
    for (const [an, f] of pairs) {
      const ref = f(P2); if (ref < 0.05) continue;
      const e = Math.abs(f(P1) - ref) / ref, key = 'H=' + H;
      const s = stats[key] = stats[key] || { n: 0, over1pct: 0, worst: 0, at: '' };
      s.n++; if (e > 0.01) s.over1pct++; if (e > s.worst) { s.worst = e; s.at = `${sn} ${anchor} gh=${gh} 1e${lk} ${an}: other-patch ${f(P1).toFixed(3)} vs ${ref.toFixed(3)}`; }
    }
  }
}
for (const [k, s] of Object.entries(stats)) console.log(k, `cases ${s.n}, >1% error ${s.over1pct}, worst ${(s.worst * 100).toFixed(1)}% at ${s.at}`);
// exact window edges, original engine, defaults
const body = P0.makeBody({ H: 2, m: 180 }), conc = surfaces.concrete;
const mk = (kg) => ({ F: kg * g, mode: 'real', body, surface: conc, groundHolds: false, anchor: 'friction' });
const fns = { punch: (c) => P0.punch(c).vFist, clap: (c) => P0.clap(c).vHand, stomp: (c) => P0.stomp(c).vFoot, jump: (c) => P0.jump(c).v, baseball: (c) => P0.throwObject(c, { m: 0.145, area: 0.00434, Cd: 0.35, rho: 683 }, 45).v, shot: (c) => P0.throwObject(c, objs.shot, 45).v, car: (c) => P0.throwObject(c, objs.car, 45).v, bus: (c) => P0.throwObject(c, objs.bus, 45).v };
for (const [n, f] of Object.entries(fns)) {
  let first = null, last = null;
  for (let lk = 3; lk <= 14; lk += 0.01) { const z = !(f(mk(Math.pow(10, lk))) > 0); if (z && first == null) first = lk; if (z) last = lk; }
  console.log(`${n}: zero window 1e${first && first.toFixed(2)} .. 1e${last && last.toFixed(2)} kg = ${(Math.pow(10, first)).toExponential(2)} .. ${(Math.pow(10, last)).toExponential(2)}`);
}
