const { P, ctx } = require('./common.js');
const body = P.makeBody({ H: 50 });
let lo = 20000, hi = 22000; // bracket the escape boundary
for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; const f = P.fly({ v0: m, thetaDeg: 90, h0: 0, m: body.m, A: body.topArea, Cd: body.Cd, CdSup: 1.75 }); if (f.escaped) hi = m; else lo = m; }
console.log('escape boundary v0 ~', lo, hi);
for (const dv of [-200, -50, -20, -5, -1, -0.2]) {
  const v0 = lo + dv; const t0 = Date.now();
  const f = P.fly({ v0, thetaDeg: 90, h0: 0, m: body.m, A: body.topArea, Cd: body.Cd, CdSup: 1.75 });
  console.log('v0', v0.toFixed(1), 'land', f.landed, 'TO', f.timedOut, 'apex km', (f.apex / 1e3).toExponential(3), 't days', (f.time / 86400).toFixed(1), 'vImp', f.vImpact.toFixed(0), 'steps', f.steps, 'ms', Date.now() - t0);
}
