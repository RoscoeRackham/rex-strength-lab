const { P, D, g, R3, O3, c3, dial, sig, surf, conc } = require('./h.js');
const cl = P.K.c;
const ch = (F, o, xR, xO) => P.collide(c3(F, O3, xO), c3(F, R3, xR), o);
const pr = (...a) => console.log(...a.map((x) => (typeof x === 'number' ? sig(x) : x)));
let r = ch(dial, { source: 'sprint' });
pr('sprint carried v', r.carry.v, 'slide', r.after.splat.slide, 'moved', r.after.splat.moved, 'supplied', r.carry.supplied, 'gain', r.carry.pGain, 'foot', r.carry.footJ, 'Q', r.Q, 'F', r.carry.F, 'T', r.carry.T, 'soft', r.contact.soft.F);
r = ch(4260 * g, { source: 'sprint' });
pr('least 4260: F', r.carry.F, 'soft', r.contact.soft.F, 'v', r.carry.v, 'T', r.carry.T, 'Q', r.Q, 'moved', r.after.splat.moved);
r = ch(dial, { source: 'set', gb: 1 / cl });
pr('1 m/s: supplied', r.carry.supplied, 'gain', r.carry.pGain, 'foot', r.carry.footJ, 'F', r.carry.F, 'Q', r.Q);
r = ch(dial, { source: 'jump' }, { unbreakable: false }, { unbreakable: false });
pr('jump real ground: supplied', r.carry.supplied, 'gain', r.carry.pGain, 'foot', r.carry.footJ, 'F', r.carry.F, 'Q', r.Q, 'depth', r.after.splat.depth, 'v', r.carry.v);
r = ch(dial, { source: 'jump' }, { unbreakable: false, surface: surf('granite') }, { unbreakable: false, surface: surf('granite') });
pr('jump real granite: supplied', r.carry.supplied, 'F', r.carry.F, 'Q', r.Q, 'depth', r.after.splat && r.after.splat.depth, r.outcome);
r = ch(dial, { source: 'sprint', bounce: true });
pr('bounce: vB', r.carry.vB, 'slideB', r.after.bounce.slideB, 'supplied', r.carry.supplied);
for (const [F, src] of [[1e9 * g, 'jump'], [1e9 * g, 'stomp']]) { r = ch(F, { source: src }); pr(src, '10^9', r.outcome, r.v0); }
r = ch(dial, { source: 'set', gb: 0.001 / Math.sqrt(1 - 1e-6) });
pr('0.1% c: vB', r.carry.vB, 'supplied', r.carry.supplied, 'Q', r.Q, 'Eair', r.carry.Eair, 'KE', P.momentumToKE(r.carry.pGain, R3.m), 'slide', r.after.splat.slide, 'Elocal', r.Elocal);
r = ch(dial, { source: 'set', gb: 0.001 / Math.sqrt(1 - 1e-6), bounce: true });
pr('0.1% c bounce: vB', r.carry.vB, 'supplied', r.carry.supplied);
r = ch(dial, { source: 'set', gb: 100 / cl });
pr('100 m/s: moved', r.after.splat.moved, 'F', r.carry.F, 'T', r.carry.T, 'supplied', r.carry.supplied, 'Q', r.Q);
r = ch(dial, { source: 'sprint' }, { anchor: 'bolted', unbreakable: false }, { unbreakable: false });
pr('bolted real rock: tear', r.carry.tear, 'F', r.carry.F, 'supplied', r.carry.supplied, 'foot', r.carry.footJ, 'Q', r.Q);
// steady push
let s = P.standoff(c3(dial, O3), c3(dial, R3));
pr('steady: DA', s.DA, 'HB', s.HB, 'vB', s.drive.vB, 'slide', s.drive.slideB, 'd', s.drive.d, 'rec', s.recoilAbsorbed.J);
// shoving match
let m = P.pushMatch(c3(dial, R3), c3(dial, O3));
pr('match: vA', m.vA, 'vB', m.vB, 'slideA', m.slideA, 'slideB', m.slideB, 'xA', m.xA, 'xB', m.xB);
m = P.pushMatch(c3(2570 * g, R3), c3(2570 * g, O3));
pr('match 2570: vA', m.vA, 'slide', m.slideA, m.outcome);
m = P.pushMatch(c3(dial, R3), c3(1000 * g, O3));
pr('walkout: push', m.walkPush, 't', m.t, 'v', m.v, 'J', m.recoilAbsorbedA.J, m.outcome);
m = P.pushMatch(c3(dial, R3, { anchor: 'bolted' }), c3(dial, O3));
pr('bolted Rex: vB', m.vB, 'slideB', m.slideB, m.outcome);
// both at once
let b = P.shoveBoth(c3(dial, R3), c3(dial, O3));
pr('both: vA', b.vA, 'vB', b.vB, 'slideA', b.slideA, 'slideB', b.slideB);
// arm
let a = P.armWrestle(c3(dial, R3, { keepForm: false }), c3(1000 * g, O3, { keepForm: false }));
pr('arm: pad', a.padLoad, 'loserPad', a.loserPadLoad, 'tableLat', a.tableLat, 'pin v', a.pin && a.pin.v, 'elbow', a.loserElbow, 'RB', a.RB, a.outcome, a.tableBreaksBy);
a = P.armWrestle(c3(dial, R3, { keepForm: false, ownRecoil: false }), c3(1000 * g, O3, { keepForm: false, ownRecoil: false }));
pr('arm off: pad', a.padLoad, 'pin v', a.pin && a.pin.v, a.outcome, a.tableBreaksBy);
a = P.armWrestle(c3(dial, R3, { keepForm: false }), c3(dial, O3, { keepForm: false }));
pr('arm equal: ', a.outcome, a.contact, a.draggedA, a.draggedB);
