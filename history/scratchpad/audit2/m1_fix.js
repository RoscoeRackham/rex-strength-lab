global.window = {};
const E = require('./engine_m1.js');
const E0 = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const S = window.DINO_DATA.surfaces;
const list = Array.isArray(S) ? S : Object.values(S);
let diffs = 0;
for (const H of [0.3, 2, 50, 2000]) {
 const body = E.makeBody({H});
 for (const surf of list) for (const gh of [false,true]) for (const mode of ['real','comic']) {
  for (const lk of [2, 3, 6, 12, 20, 34, Infinity]) {
    const F = isFinite(lk) ? Math.pow(10, lk)*9.80665 : Infinity;
    const ctx = { F, body, surface: surf, groundHolds: gh, anchor: 'friction', mode };
    const a = E.jump(ctx), b = E0.jump(ctx);
    const same = a.v === b.v && a.Eground === b.Eground && a.Ebody === b.Ebody;
    if (!same) { diffs++; if (diffs < 12) console.log('DIFF H',H,(surf.id),'gh',gh,mode,'lk',lk,'old v',b.v,'new v',a.v,'old Eg',b.Eground,'new Eg',a.Eground, 'new apex', a.flight.apex); }
  }
  // convergence check: real mode inf vs 1e34
  const ri = E.jump({ F: Infinity, body, surface: surf, groundHolds: gh, anchor:'friction', mode:'real' });
  const r34 = E.jump({ F: 1e34*9.80665, body, surface: surf, groundHolds: gh, anchor:'friction', mode:'real' });
  if (mode==='real' && Math.abs(ri.v - r34.v) > 1e-9*r34.v) console.log('NONCONV', H, surf.id, gh, ri.v, r34.v);
 }
}
console.log('total diffs', diffs);
