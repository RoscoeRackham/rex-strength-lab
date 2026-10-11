const P = require('./engine_f3.js');
const K = P.K;
const body = P.makeBody({ H: 2, m: 180 });
global.window = {}; require('/home/user/dino-strength-sim/src/data.js');
const surface = window.DINO_DATA.surfaces.find(s => s.id === 'concrete');
for (const lk of [Math.log10(511), 6, 9, 10, 10.97, 11.06, 11.07, 14.13]) {
  const r = P.jump({ F: 10 ** lk * K.g, mode: 'comic', body, surface, groundHolds: false, anchor: 'friction' });
  const ref = r.v < 25000 ? P.fly({ v0: r.v, thetaDeg: 90, m: 180, A: 1, Cd: 0 }) : null;
  console.log('logKg', lk.toFixed(3), 'v', r.v.toPrecision(6), 'fixed vacuumApex m', r.vacuumApex.toPrecision(7), '| fly(Cd=0)', ref ? (ref.escaped ? 'escaped' : ref.apex.toPrecision(7)) : 'n/a');
}
