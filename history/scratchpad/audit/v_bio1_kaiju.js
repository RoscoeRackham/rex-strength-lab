const P = require('/home/user/dino-strength-sim/src/engine.js');
const { refPush } = require('./v_bio1_ref.js');
const g = 9.80665, a0 = P.K.a0;
const concrete = { qult: 10e6, mu: 0.8, shear: 2e6, rho: 2400 };
const H = 50, body = P.makeBody({ H, m: 180 * Math.pow(H / 2, 3) });
const at = (kg) => ({ F: kg * g, mode: 'real', body, surface: concrete, groundHolds: false, anchor: 'friction' });
// App ladder: th(pred) = P.threshold(F => pred(F/g), 10, 1e34) -- note app passes 10^LMIN and 10^LMAX as F bounds
const engTh = P.threshold((F) => P.punch(at(F / g)).vFist >= a0, Math.pow(10, 1), Math.pow(10, 34)) / g;
console.log('engine ladder threshold (kg):', engTh.toExponential(4));
// scan engine vFist along the dial
for (const lk of [6, 7, 8, 8.5, 8.8, 9, 10, 11, 12, 13, 14, 15, 16]) console.log('  1e' + lk, 'eng vFist', P.punch(at(Math.pow(10, lk))).vFist.toFixed(2));
// reference threshold
const anc = P.anchorCapacity({ body, surface: concrete, theta: 0, anchor: 'friction' });
const refV = (kg) => refPush({ F: 0.3 * kg * g, d: body.strokes.punch, mA: body.m - body.handEff, mB: body.handEff, RA: anc.R, RB: 0, vmax: 17 * body.s, N: 100000 }).vB;
let lo = 1e7, hi = 1e10;
console.log('  ref at 1e7', refV(1e7).toFixed(2), ' ref at 1e10', refV(1e10).toFixed(2));
for (let i = 0; i < 40; i++) { const m = Math.sqrt(lo * hi); if (refV(m) >= a0) hi = m; else lo = m; }
console.log('reference threshold (kg):', hi.toExponential(4), ' ratio engine/ref =', (engTh / hi).toExponential(3));
// is engine accurate just below its onset? compare at 3e8
console.log('  at 3e8: eng', P.punch(at(3e8)).vFist.toFixed(3), 'ref', refV(3e8).toFixed(3));
