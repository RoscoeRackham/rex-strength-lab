const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const esc = (v0) => P.fly({ v0, thetaDeg: 90, h0: 0, m: body.m, A: body.topArea, Cd: body.Cd, CdSup: 1.75 }).escaped;
let lo = 30000, hi = 91000;
for (let i = 0; i < 30; i++) { const mid = (lo + hi) / 2; if (esc(mid)) hi = mid; else lo = mid; }
const vesc = Math.sqrt(2 * P.K.GM / P.K.R_E);
console.log('threshold v0', hi, 'vesc', vesc, 'air share of KE at threshold >=', 1 - (vesc / hi) ** 2, 'velocity ratio', vesc/hi);
