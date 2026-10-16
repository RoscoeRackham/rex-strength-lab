const { P, D, g, R3, O3, c3, dial, sig, surf, conc } = require('./h.js');
const a = P.shove(c3(dial, R3), c3(dial, O3, { anchor: 'bolted' }));
const b = P.shove(c3(dial, O3, { anchor: 'bolted' }), c3(dial, R3));
const u = P.shove(c3(dial, R3), c3(dial, O3));
console.log('Rex->bolted Ollie: stalled', a.stalled, 'Fdrive', sig(a.Fdrive), 'basis', a.basis, '| Ollie(bolted)->Rex: Fdrive', sig(b.Fdrive), 'basis', b.basis, 'push.t', sig(b.push.t), 'vB', sig(b.vB), '| unbolted Rex->Ollie Fdrive', sig(u.Fdrive), u.basis, sig(u.vB));
const bo = P.shoveBoth(c3(dial, R3), c3(dial, O3, { anchor: 'bolted' }));
console.log('both, Ollie bolted: toGroundB', bo.toGroundB && sig(bo.toGroundB.J), 'T', bo.toGroundB && sig(bo.toGroundB.T), 'vA', sig(bo.vA), 'vB', sig(bo.vB), 'Fdrive', sig(bo.Fdrive));
// what a full-strength static push on bolts over the same time would be
console.log('full F x t', sig(dial * b.push.t));
