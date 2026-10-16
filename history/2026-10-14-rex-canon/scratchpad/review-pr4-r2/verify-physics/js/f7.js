const { P, g, R3, O3, dial, c3 } = require('./common.js');
const FO = 2000 * g;
console.log('moveCheck(2000 kgf, 3000 kg)', JSON.stringify(P.moveCheck(FO, 3000)));
// Collide steady push: Ollie (pusher, 2 t) pushes Rex (dial)
const s = P.standoff(c3(FO, O3), c3(dial, R3));
console.log('standoff on: outcome', s.outcome, 'DA', s.DA.toFixed(0), 'HB', s.HB.toFixed(0), 'drive vB', s.drive && s.drive.vB.toFixed(3), 'slide', s.drive && s.drive.slideB.toFixed(3));
const s0 = P.standoff(c3(FO, O3, { ownRecoil: false }), c3(dial, R3, { ownRecoil: false }));
console.log('standoff off: outcome', s0.outcome, 'DA', s0.DA.toFixed(0), 'contact', s0.contact.toFixed(0), 'pusherSlips', s0.pusherSlips);
// shoving match with same strengths
const m = P.pushMatch(c3(dial, R3), c3(FO, O3));
console.log('pushMatch on: outcome', m.outcome, 'DA(Rex)', m.DA.toFixed(0), 'DB(Ollie)', m.DB.toFixed(0), 'HB', m.HB.toFixed(0));
// threshold of stand
let lo = 100, hi = 5000; for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (P.moveCheck(mid * g, 3000).stand) hi = mid; else lo = mid; } console.log('stand threshold kgf', hi.toFixed(1));
