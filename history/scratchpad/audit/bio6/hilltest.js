// Hill (1950) premise: muscle STRESS constant across sizes => force ~ s^2. Does the engine,
// with its linear vmax, then give size-independent jump height / limb speed (Hill's result)?
global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = P.K.g;
const surf = D.surfaces.find(s => s.id === 'concrete');
function ctx(F, mode, H) { const m = 180 * (H/2)**3; return { F, mode, body: P.makeBody({ H, m }), surface: surf, groundHolds: true, anchor: 'bolted' }; }
for (const base of [511, 2000]) {
  console.log(`-- stress held constant: strength = ${base} kg x s^2`);
  for (const H of [0.4, 1, 2, 5, 10, 50]) {
    const s = H/2;
    for (const vexp of [1, 0.5, 0]) {
      // emulate alternative exponents by temporarily patching vmax table (restore after)
      const keys = ['punch','clap','jump','stomp','throwPush','throwWhip'];
      const save = keys.map(k => P.MUSCLE[k].vmax);
      keys.forEach(k => P.MUSCLE[k].vmax = P.MUSCLE[k].vmax * Math.pow(s, vexp - 1));
      const c = ctx(base*g*s*s, 'real', H);
      const j = P.jump(c), p = P.punch(c);
      keys.forEach((k,i) => P.MUSCLE[k].vmax = save[i]);
      process.stdout.write(`  H ${String(H).padEnd(4)} vmax~s^${vexp}: jump v ${j.v.toFixed(2)} m/s, vac apex ${j.vacuumApex.toFixed(2)} m, punch ${p.vFist.toFixed(2)} m/s\n`);
    }
  }
}
