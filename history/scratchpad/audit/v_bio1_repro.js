const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = 9.80665;
const concrete = { id: 'concrete', short: 'concrete', qult: 10e6, mu: 0.8, shear: 2e6, rho: 2400 };
const baseball = { id: 'baseball', m: 0.145, area: 0.00434, Cd: 0.35, rho: 683 };
const shot = { id: 'shot', m: 7.26, area: 0.0113, Cd: 0.47, crush: 250e6, rho: 7200 };
const car = { id: 'car', m: 1360, area: 4, Cd: 1.0, crush: 1e6, rho: 300, crr: 0.012 };
function ctx(kg, mode, H) {
  const body = P.makeBody({ H: H || 2, m: H ? undefined : 180 });
  return { F: kg * g, mode: mode || 'real', body, surface: concrete, groundHolds: false, anchor: 'friction' };
}
for (const lk of [3, 5, 6, 6.5, 7, 8, 9, 10, 11, 12, 13]) {
  const kg = Math.pow(10, lk);
  const c = ctx(kg);
  const pu = P.punch(c), cl = P.clap(c), st = P.stomp(c), j = P.jump(c);
  const bb = P.throwObject(c, baseball, 45), sh = P.throwObject(c, shot, 45);
  console.log(`1e${lk} kg: punch ${pu.vFist.toFixed(3)} (stall ${pu.push.stalled}, sat ${pu.push.saturated}) clap ${cl.vHand.toFixed(3)} stomp ${st.vFoot.toFixed(3)} jump ${j.v.toFixed(3)} baseball ${bb.v.toFixed(3)} canMove ${bb.canMove} shot ${sh.v.toFixed(3)}`);
}
