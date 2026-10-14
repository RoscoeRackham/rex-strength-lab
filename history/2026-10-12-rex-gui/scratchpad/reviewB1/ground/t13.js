const { P, D, g, surf, obj, rex, ollie, ctxOf, ON, sig, M } = require('./common.js');
let zeros = [];
for (const kg of [1e4, 1e5, 1e6, 1e8]) for (const oid of ['baseball', 'car', 'bus', 'piano']) for (const Dd of [10, 30, 100]) for (const style of ['easy', 'hard']) for (const ex of [ON, { unbreakable: true }]) {
  const cR = ctxOf(kg, ex), cO = Object.assign({}, cR, { body: ollie });
  const L = P.catchLeg(cR, cO, obj(oid), Dd, style);
  if (L.toGroundT && !(L.toGroundT.J > 0)) zeros.push(['T', kg, oid, Dd, style, JSON.stringify(ex).slice(0, 12), L.result].join(' '));
  if (L.toGroundC && !(L.toGroundC.J > 0)) zeros.push(['C', kg, oid, Dd, style, JSON.stringify(ex).slice(0, 12), L.result, 'uAfter', sig(L.catch.uAfter, 3), 'vArr', sig(L.vArrive, 3)].join(' '));
  if (L.toGroundC && L.toGroundC.J > 0) { const pin = P.vToMomentum(L.vArrive, obj(oid).m); if (L.toGroundC.J > pin * 1.0001) zeros.push('C>pin ' + kg + oid); }
}
console.log(zeros.length, zeros.slice(0, 20).join('\n'));
// arm wrestle zero? and throwPartner
for (const kg of [1e4, 1e6]) { const cR = ctxOf(kg, { unbreakable: true }), cO = Object.assign({}, cR, { body: ollie }); const t = P.throwPartner(cR, cO, 45); console.log('throwPartner', kg, t.r && t.r.toGround && sig(t.r.toGround.J, 4)); }
