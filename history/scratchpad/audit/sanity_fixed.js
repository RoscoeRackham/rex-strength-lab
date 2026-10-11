const P = require('/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit/engine_f12fix.js');
const g = P.K.g;
const body = P.makeBody({});
const surf = { qult: 30e6, mu: 0.7, shear: 5e6, rho: 2400 };
const ctx = (L, mode, extra) => Object.assign({ F: L * g, mode, body, surface: surf, groundHolds: false, anchor: 'friction' }, extra || {});
const shot = { m: 7.26, area: Math.PI * 0.06 ** 2, Cd: 0.47, crush: 200e6, rho: 7800 };
const ball = { m: 0.145, area: Math.PI * 0.0369 ** 2, Cd: 0.35, crush: 5e6, rho: 700 };
for (const mode of ['real', 'comic']) {
  const s = P.throwObject(ctx(511, mode), shot, 37);
  const b = P.throwObject(ctx(511, mode), ball, 0);
  const j = P.jump(ctx(511, mode));
  const p = P.punch(ctx(511, mode));
  const st = P.stomp(ctx(511, mode));
  console.log(mode, 'shot v', s.v.toFixed(2), 'range', s.flight.range.toFixed(2),
    '| ball v', b.v.toFixed(1), '| jump v', j.v.toFixed(2), 'apex', j.flight.apex.toFixed(2),
    '| punch v', p.vFist.toFixed(1), 'E', p.E.toFixed(0), '| stomp vfoot', st.vFoot.toFixed(1), 'E', st.E.toFixed(0));
}
// energy & momentum checks
const r = P.pushApart({ F: 1e4, d: 1, mA: 100, mB: 10, RA: 0, RB: 0, mode: 'comic' });
console.log('classical: EA+EB', (r.EA + r.EB).toFixed(3), 'expect', 1e4, 'pA', r.pA.toExponential(6), 'pB', r.pB.toExponential(6));
const r2 = P.pushApart({ F: 1e30, d: 1, mA: 100, mB: 1, RA: Infinity, RB: 0, mode: 'comic' });
console.log('relativistic: EB', r2.EB.toExponential(6), 'expect', (1e30).toExponential(6), 'vB/c', r2.vB / P.K.c, 'xB', r2.xB);
// vacuum flight
const v = P.fly({ v0: 100, thetaDeg: 45, h0: 0, m: 1, A: 1, Cd: 0 });
console.log('vacuum 100 m/s 45deg range', v.range.toFixed(2), 'expect', (100 * 100 / g).toFixed(2), 'apex', v.apex.toFixed(2), 'expect', (100 * 100 / 4 / g).toFixed(2), 'steps', v.steps);
for (const vv of [11000, 11300]) { const e = P.fly({ v0: vv, thetaDeg: 90, m: 1, A: 1, Cd: 0 }); console.log('vertical vac', vv, 'escaped', e.escaped, 'apex km', (e.apex / 1000).toFixed(0), 'steps', e.steps); }
console.log('KG 1kg@10m Pa', P.overpressureAt(4.184e6, 10).toFixed(0));
console.log('blast radius 1 kt @ 6.9 kPa (m)', P.blastRadius(4.184e12, 6900).toFixed(0));
console.log('seismic M for 4.184e15 J', P.seismicMagnitude(4.184e15).toFixed(2));
