const root = process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab';
const { P, g, R3, O3, dial, conc, c3, on, sig } = require('/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr4/r2fix/js/common.js')(root);
const pick = (r, ks) => Object.fromEntries(ks.map((k) => [k, r[k]]));
const b7 = P.armWrestle(c3(1e7 * g, R3, on({ keepForm: false, unbreakable: false })), c3(1000 * g, O3, on({ keepForm: false, unbreakable: false, anchor: 'bolted' })));
console.log('b7', pick(b7, ['outcome', 'loserElbow', 'tearB', 'tornB', 'holdAfterB', 'loserSlides', 'winnerSlides']));
const e65 = P.armWrestle(c3(Math.pow(10, 6.5) * g, R3, on({ keepForm: false, unbreakable: false })), c3(Math.pow(10, 6.5) * g, O3, on({ keepForm: false, unbreakable: false, anchor: 'bolted' })));
console.log('e65', pick(e65, ['outcome', 'contact', 'tearB', 'tornB', 'holdAfterB', 'draggedA', 'draggedB']));
const bw7 = P.armWrestle(c3(1e7 * g, R3, on({ keepForm: false, unbreakable: false, anchor: 'bolted' })), c3(Math.pow(10, 6.4) * g, O3, on({ keepForm: false, unbreakable: false })));
console.log('bw7', pick(bw7, ['outcome', 'winner', 'tearA', 'tornA', 'holdAfterA', 'winnerSlides', 'loserSlides']));
// collide bounce: travel during the contact
const ch = (F, o) => P.collide(c3(F, O3, on()), c3(F, R3, on()), o);
const b = ch(3310 * g, { source: 'sprint', bounce: true });
console.log('bounce 3310', sig(b.vRel), sig(b.after.bounce.during), sig(b.after.bounce.slideB), sig(b.after.bounce.moved), sig(Math.PI * b.contact.s));
let lo = 3001, hi = 4260; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; const r = ch(m * g, { source: 'sprint', bounce: true }); if (r.after.bounce.moved > 5) hi = m; else lo = m; }
console.log('bounce moved reaches 5 m at', sig(lo, 5), 'kgf');
// walk-out
const pm = (FR, FO, xR, xO) => P.pushMatch(c3(FR, R3, on(xR)), c3(FO, O3, on(xO)));
const w2 = pm(dial, 1000 * g);
console.log('w2', pick(w2, ['outcome', 'v', 'x', 'slideL', 'endL', 'walkPush', 'vCap']));
const w3 = pm(3500 * g, 1000 * g);
console.log('w3', pick(w3, ['outcome', 'v', 'vCap', 'x', 'slideL', 'endL', 'walkPush', 'aLoser', 'aFeet']), w3.recoilAbsorbedA);
for (const kg of [2600, 2800, 3000, 3050, 3200, 3300, 3400, 3500, 3544, 3600]) { const r = pm(kg * g, 1000 * g); console.log(kg, r.outcome, sig(r.v || r.vB), r.endL != null ? sig(r.endL) : (r.xB != null ? sig(r.xB + r.slideB) : '-'), r.walkPush ? sig(r.walkPush) : '', r.aLoser != null ? (r.aLoser < r.aFeet ? 'loser-paced' : 'feet-paced') : ''); }
