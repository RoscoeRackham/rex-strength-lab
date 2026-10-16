const { P, ctx, octx, K, g } = require('./h.js');
const j = (r) => JSON.stringify(r, (k, v) => typeof v === 'number' ? +v.toPrecision(4) : (k === 'grav' ? undefined : v));
const pm = (lab, a, b) => { const r = P.pushMatch(a, b); console.log(lab, j({ outcome: r.outcome, DA: r.DA, DB: r.DB, HA: r.HA, HB: r.HB, t: r.t, vA: r.vA, vB: r.vB, slideA: r.slideA, slideB: r.slideB, pA: r.pA, pB: r.pB, footA: r.footA, footB: r.footB, rA: r.recoilAbsorbedA, rB: r.recoilAbsorbedB, winner: r.winner, accel: r.accel, aLoser: r.aLoser, aFeet: r.aFeet, contact: r.contact, v: r.v, tear: r.tear, clash: r.clash, torn: [r.tornA, r.tornB] })); return r; };
const r = pm('default', ctx(), octx());
// ledger: B's gain + B's feet = A's push x t
console.log('ledger B: DA*t', r.DA * r.t, 'pB + footB', r.pB + r.footB, ' A: DB*t', r.DB * r.t, 'pA+footA', r.pA + r.footA);
pm('least 2570', ctx({ F: 2570 * g }), octx({ F: 2570 * g }));
pm('9060', ctx({ F: 9060 * g }), octx({ F: 9060 * g }));
pm('bolted rex', ctx({ anchor: 'bolted' }), octx());
pm('bolted rex real', ctx({ anchor: 'bolted', unbreakable: false }), octx({ unbreakable: false }));
pm('off', ctx({ ownRecoil: false }), octx({ ownRecoil: false }));
pm('ollie weaker 1800 kgf', ctx(), octx({ F: 1800 * g }));
pm('ollie 1500 kgf (H=F)', ctx(), octx({ F: 1500 * g }));
pm('inf vs bolted unbr', ctx({ F: Infinity }), octx({ anchor: 'bolted' }));
pm('inf vs bolted real', ctx({ F: Infinity, unbreakable: false }), octx({ anchor: 'bolted', unbreakable: false }));
pm('inf vs inf standing', ctx({ F: Infinity }), octx({ F: Infinity }));
pm('inf vs finite standing', ctx({ F: Infinity }), octx());
pm('ice default', ctx({ surface: require('./h.js').surf('ice') }), octx({ surface: require('./h.js').surf('ice') }));
// both at once
const sb = P.shoveBoth(ctx(), octx());
console.log('both', j({ shover: sb.shover, vA: sb.vA, vB: sb.vB, slideA: sb.slideA, slideB: sb.slideB, both: sb.both, clash: sb.clash }));
const sb0 = P.shoveBoth(ctx({ ownRecoil: false }), octx({ ownRecoil: false }));
console.log('both off', j({ shover: sb0.shover, vA: sb0.vA, vB: sb0.vB, slideA: sb0.slideA, slideB: sb0.slideB }));
