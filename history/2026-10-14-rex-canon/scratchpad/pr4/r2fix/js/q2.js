const root = process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab';
const { P, g, R3, O3, dial, c3, on, sig, surf } = require('./common.js')(root);
const aw = (FR, FO, xR, xO) => P.armWrestle(c3(FR, R3, on(xR)), c3(FO, O3, on(xO || xR)));
let r = aw(dial, 1000 * g, { keepForm: false });
console.log('arm dial vs 1t keepForm off', r.outcome, r.tableBreaksBy, 'loserPad', sig(r.loserPadLoad), 'loserElbow', sig(r.loserElbow), 'RB', sig(r.RB), 'loserSlides', r.loserSlides, 'winnerSlides', r.winnerSlides);
r = P.armWrestle(c3(1e7 * g, R3, on({ keepForm: false, unbreakable: false })), c3(1000 * g, O3, on({ keepForm: false, unbreakable: false, anchor: 'bolted' })));
console.log('arm 1e7 vs bolted 1t real rock', r.outcome, 'loserElbow', sig(r.loserElbow), 'tearB', sig(r.tearB), 'loserSlides', r.loserSlides);
r = P.armWrestle(c3(1e6 * g, R3, on({ keepForm: false, unbreakable: false })), c3(dial, O3, on({ keepForm: false, unbreakable: false, anchor: 'bolted' })));
console.log('arm 1e6 vs bolted dial real rock', r.outcome, 'loserElbow', sig(r.loserElbow), 'tearB', sig(r.tearB), 'PB', sig(r.PB));
r = aw(Infinity, Infinity, { keepForm: false, anchor: 'bolted' }, { keepForm: false });
console.log('arm inf Rex bolted', r.outcome, r.clash, r.oneSided, r.noAnswer, r.draggedA, r.draggedB, r.tearA, r.tearB);
r = aw(Infinity, Infinity, { keepForm: false, anchor: 'bolted' });
console.log('arm inf both bolted', r.outcome, r.clash, r.oneSided, r.noAnswer, r.draggedA, r.draggedB);
r = aw(Infinity, 1000 * g, { keepForm: false });
console.log('arm inf vs 1t', r.outcome, 'elbow', r.loserElbow, 'slides', r.loserSlides, 'tearB', r.tearB);
// walk-out
const pm = (FR, FO, xR, xO) => P.pushMatch(c3(FR, R3, on(xR)), c3(FO, O3, on(xO)));
r = pm(dial, 1000 * g);
console.log('walkOut', r.outcome, 'walkPush', sig(r.walkPush), 'contact', sig(r.contact), 't', sig(r.t), 'v', sig(r.v), 'rA', r.recoilAbsorbedA && sig(r.recoilAbsorbedA.J), 'rB', r.recoilAbsorbedB && sig(r.recoilAbsorbedB.J), 'walkPush*t', sig(r.walkPush * r.t), 'vCap', sig(r.vCap));
const gr = surf('gravel');
r = pm(dial, 2200 * g, { surface: gr }, { surface: gr });
console.log('walkOut gravel', r.outcome, 'walkPush', sig(r.walkPush), 'rA', r.recoilAbsorbedA && sig(r.recoilAbsorbedA.J), 'rB', r.recoilAbsorbedB && sig(r.recoilAbsorbedB.J), 'DB', sig(r.DB), 'v', sig(r.v), 'vCap', sig(r.vCap));
r = pm(dial, dial);
console.log('bothShoved', r.outcome, 'xA', sig(r.xA), 'xB', sig(r.xB), 'slideA', sig(r.slideA));
// steady push lying
r = P.standoff(c3(2000 * g, O3, on()), c3(dial, R3, on()));
console.log('standoff lying', r.outcome, r.DA, r.cantStand, r.contact);
r = P.standoff(c3(dial, O3, on({ mode: 'real' })), c3(dial, R3, on({ mode: 'real' })));
console.log('standoff real', r.outcome, sig(r.drive.vB), r.drive.realUpper);
// both at once bolts
for (const [lab, xR, xO, F] of [['Ollie bolted dial', {}, { anchor: 'bolted' }, dial], ['Rex bolted dial', { anchor: 'bolted' }, {}, dial], ['Rex bolted 1e6', { anchor: 'bolted' }, {}, 1e6 * g], ['Ollie bolted 90.7t', {}, { anchor: 'bolted' }, 90718 * g]]) {
  const b = P.shoveBoth(c3(F, R3, on(xR)), c3(F, O3, on(xO)));
  console.log('both', lab, b.shover, 'vA', sig(b.vA), 'vB', sig(b.vB), 'tgA', b.toGroundA && [sig(b.toGroundA.J), sig(b.toGroundA.T)], 'tgB', b.toGroundB && [sig(b.toGroundB.J), sig(b.toGroundB.T)]);
}
