const P0 = require('/home/user/dino-strength-sim/src/engine.js');
const P2 = require('./engine_v_bio1_fix.js');
const { refPush } = require('./v_bio1_ref.js');
const g = 9.80665;
const concrete = { qult: 10e6, mu: 0.8, shear: 2e6, rho: 2400 };
const car = { m: 1360, area: 4, Cd: 1.0, crush: 1e6, rho: 300 };
const acts = { punch: (P, c) => P.punch(c).vFist, stomp: (P, c) => P.stomp(c).vFoot, jump: (P, c) => P.jump(c).v, car: (P, c) => P.throwObject(c, car, 45).v };
for (const [H, list] of [[0.4, ['car']], [2, ['punch', 'stomp', 'car']], [50, ['jump']]]) {
  const body = P0.makeBody({ H, m: 180 * Math.pow(H / 2, 3) });
  const mk = (kg) => ({ F: kg * g, mode: 'real', body, surface: concrete, groundHolds: false, anchor: 'friction' });
  for (const an of list) for (const [nm, P] of [['orig', P0], ['fix', P2]]) {
    let prev = -1, worst = 0, at = 0;
    for (let lk = 1; lk <= 34; lk += 0.05) { const v = acts[an](P, mk(Math.pow(10, lk))); if (prev > 0 && v < prev) { const r = (prev - v) / prev; if (r > worst) { worst = r; at = lk; } } prev = v; }
    console.log(`H=${H} ${an} ${nm}: largest drop ${(worst * 100).toFixed(4)}% at 1e${at.toFixed(2)} kg (v ${acts[an](P, mk(Math.pow(10, at - 0.05))).toFixed(4)} -> ${acts[an](P, mk(Math.pow(10, at))).toFixed(4)})`);
  }
}
