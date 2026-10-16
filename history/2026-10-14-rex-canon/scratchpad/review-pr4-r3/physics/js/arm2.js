const { P, D, g, R3, O3, c3, dial, sig, surf, conc } = require('./h.js');
const pick = (r) => ({ outcome: r.outcome, winner: r.winner, tableBreaks: r.tableBreaks, by: r.tableBreaksBy, AA: sig(r.AA), AB: sig(r.AB), RA: sig(r.RA), RB: sig(r.RB), tearA: sig(r.tearA), tearB: sig(r.tearB), loserElbow: sig(r.loserElbow), loserSlides: r.loserSlides, winnerSlides: r.winnerSlides, draggedA: r.draggedA, draggedB: r.draggedB, pinv: r.pin && sig(r.pin.v) });
const x = { keepForm: false, unbreakable: false };
console.log('b7 Rex 1e7 vs Ollie 1t bolted real', JSON.stringify(pick(P.armWrestle(c3(1e7 * g, R3, x), c3(1000 * g, O3, Object.assign({ anchor: 'bolted' }, x))))));
console.log('equal 1e6.5 both bolted real', JSON.stringify(pick(P.armWrestle(c3(Math.pow(10, 6.5) * g, R3, Object.assign({ anchor: 'bolted' }, x)), c3(Math.pow(10, 6.5) * g, O3, Object.assign({ anchor: 'bolted' }, x))))));
console.log('equal 1e6.5 Ollie bolted real', JSON.stringify(pick(P.armWrestle(c3(Math.pow(10, 6.5) * g, R3, x), c3(Math.pow(10, 6.5) * g, O3, Object.assign({ anchor: 'bolted' }, x))))));
console.log('power off: b7', JSON.stringify(pick(P.armWrestle(c3(1e7 * g, R3, Object.assign({ ownRecoil: false }, x)), c3(1000 * g, O3, Object.assign({ anchor: 'bolted', ownRecoil: false }, x))))));
// Compare shoving match torn rule
const m = P.pushMatch(c3(Math.pow(10, 6.5) * g, R3, x), c3(Math.pow(10, 6.5) * g, O3, Object.assign({ anchor: 'bolted' }, x)));
console.log('shoving match same', m.outcome, m.tornB, sig(m.vB), sig(m.holdAfterB));
