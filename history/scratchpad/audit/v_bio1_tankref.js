const P0 = require('/home/user/dino-strength-sim/src/engine.js');
const P1 = require('./engine_patched.js');
const P2 = require('./engine_v_bio1_fix.js');
const { refPush } = require('./v_bio1_ref.js');
const g = 9.80665;
const S = { concrete: { qult: 10e6, mu: 0.8, shear: 2e6, rho: 2400 }, granite: { qult: 400e6, mu: 0.7, shear: 20e6, rho: 2700 } };
const tank = { m: 66800, area: 15, Cd: 1, crush: 1e9, rho: 1200 };
for (const [H, sn, anchor, gh, lk] of [[0.4, 'concrete', 'braced', true, 5.25], [2, 'granite', 'braced', false, 8.25]]) {
  const body = P0.makeBody({ H, m: 180 * Math.pow(H / 2, 3) }), surface = S[sn], F = Math.pow(10, lk) * g, th = Math.PI / 4;
  const anc = P0.anchorCapacity({ body, surface, theta: th, anchor, groundHolds: gh, extraMass: tank.m });
  const arm = 2 * body.handEff, mB = tank.m + arm;
  const r = refPush({ F: 0.3 * F, d: body.strokes.throw, mA: body.m - arm, mB, RA: anc.R, RB: mB * g * Math.SQRT1_2, vmax: 55 * body.s, N: 400000 });
  const c = { F, mode: 'real', body, surface, groundHolds: gh, anchor };
  console.log(`H=${H} ${sn} ${anchor} gh=${gh} 1e${lk} tank: reference ${r.vB.toFixed(4)} | original ${P0.throwObject(c, tank, 45).v.toFixed(4)} | other patch ${P1.throwObject(c, tank, 45).v.toFixed(4)} | implicit fix ${P2.throwObject(c, tank, 45).v.toFixed(4)}`);
}
