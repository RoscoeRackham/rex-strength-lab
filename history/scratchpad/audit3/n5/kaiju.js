global.window = {};
const E = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = 9.80665;
const H = 50, m = 180 * Math.pow(H / 2, 3);
const body = E.makeBody({ H, m });
const surface = D.surfaces.find((s) => s.id === 'concrete');
const mk = (kg) => ({ F: kg * g, mode: 'comic', body, surface, groundHolds: false, anchor: 'friction' });
for (const fn of ['punch', 'clap', 'stomp', 'jump']) {
  let lo = null, hi = null;
  for (let lk = 1; lk <= 14; lk += 0.25) {
    const r = E[fn](mk(10 ** lk));
    if (r.basis === 'real') { if (lo == null) lo = lk; hi = lk; }
  }
  console.log('kaiju', fn, 'basis real from 10^' + lo + ' to 10^' + hi);
}
const r = E.punch(mk(1e6)); const rc = E.punchOnce(mk(1e6));
console.log('kaiju punch 1e6 kg: blended vFist', r.vFist, 'F', r.F, 'basis', r.basis, '| comic-only vFist', rc.vFist, 'F', rc.F);
