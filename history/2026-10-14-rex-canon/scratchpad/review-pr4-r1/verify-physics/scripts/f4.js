const { P, g, R3, O3, ON, dial, c3, sig } = require('./common.js');
const on = (x) => Object.assign({}, ON, x || {});
const r = P.pushMatch(c3(dial, R3, on({ anchor: 'bolted', unbreakable: false })), c3(dial, O3, on({ unbreakable: false })));
console.log({ outcome: r.outcome, winner: r.winner, DA: sig(r.DA), DB: sig(r.DB), HA: r.HA, HB: sig(r.HB), vA: r.vA, vB: sig(r.vB), footA: sig(r.footA), tornA: r.tornA, keys: Object.keys(r).filter(k => /tear|torn|rock/i.test(k)) });
console.log('groundTear Rex on concrete', sig(require('./common.js').conc.shear * R3.digArea), 'ratio', sig(r.DB / (require('./common.js').conc.shear * R3.digArea)));
