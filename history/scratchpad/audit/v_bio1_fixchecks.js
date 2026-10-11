const P0 = require('/home/user/dino-strength-sim/src/engine.js');
const P2 = require('./engine_v_bio1_fix.js');
const g = 9.80665, a0 = P0.K.a0;
const concrete = { qult: 10e6, mu: 0.8, shear: 2e6, rho: 2400 };
const objs = { baseball: { m: 0.145, area: 0.00434, Cd: 0.35, rho: 683 }, car: { m: 1360, area: 4, Cd: 1.0, crush: 1e6, rho: 300 } };
const acts = { punch: (P, c) => P.punch(c).vFist, clap: (P, c) => P.clap(c).vHand, stomp: (P, c) => P.stomp(c).vFoot, jump: (P, c) => P.jump(c).v, baseball: (P, c) => P.throwObject(c, objs.baseball, 45).v, car: (P, c) => P.throwObject(c, objs.car, 45).v };
for (const H of [0.4, 2, 50]) {
  const body = P0.makeBody({ H, m: 180 * Math.pow(H / 2, 3) });
  const mk = (kg) => ({ F: kg * g, mode: 'real', body, surface: concrete, groundHolds: false, anchor: 'friction' });
  const rows = [];
  for (const [an, f] of Object.entries(acts)) {
    let prev = -1, drops = [0, 0];
    for (const P of [P0, P2]) { prev = -1; let dr = 0; for (let lk = 1; lk <= 34; lk += 0.05) { const v = f(P, mk(Math.pow(10, lk))); if (v < prev * (1 - 1e-6)) dr++; prev = v; } drops[P === P0 ? 0 : 1] = dr; }
    const inf = { F: Infinity, mode: 'real', body, surface: concrete, groundHolds: false, anchor: 'friction' };
    rows.push(`${an}: drops orig ${drops[0]} fix ${drops[1]}; v(1e20kg) orig ${f(P0, mk(1e20)).toFixed(3)} fix ${f(P2, mk(1e20)).toFixed(3)}; v(inf) orig ${f(P0, inf).toFixed(3)} fix ${f(P2, inf).toFixed(3)}`);
  }
  console.log('H=' + H + '\n  ' + rows.join('\n  '));
}
// Kaiju ladder threshold with fix
const body = P0.makeBody({ H: 50, m: 180 * Math.pow(25, 3) });
const at = (kg) => ({ F: kg * g, mode: 'real', body, surface: concrete, groundHolds: false, anchor: 'friction' });
let t0 = Date.now();
const th2 = P2.threshold((F) => P2.punch(at(F / g)).vFist >= a0, 10, 1e34) / g;
console.log('Kaiju sound-barrier threshold: fixed engine', th2.toExponential(4), 'kg (reference 6.5569e+8), time', Date.now() - t0, 'ms');
t0 = Date.now();
const body2 = P0.makeBody({ H: 2, m: 180 });
for (let i = 0; i < 1000; i++) P2.punch({ F: Math.pow(10, 1 + i * 0.033) * g, mode: 'real', body: body2, surface: concrete, groundHolds: false, anchor: 'friction' });
console.log('1000 real punches, fixed engine:', Date.now() - t0, 'ms');
t0 = Date.now();
for (let i = 0; i < 1000; i++) P0.punch({ F: Math.pow(10, 1 + i * 0.033) * g, mode: 'real', body: body2, surface: concrete, groundHolds: false, anchor: 'friction' });
console.log('1000 real punches, original engine:', Date.now() - t0, 'ms');
