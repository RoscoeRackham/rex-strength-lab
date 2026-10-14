const { P, D, g, surf, rex, ollie, ON, ctxOf } = require('./setup.js');
const obj = (id) => D.objects.find(o => o.id === id);
const M = P.RESTRAINT.MOVES;
for (const [oid, kg, ang] of [['car', 1e7, 45], ['car', 1e9, 30], ['baseball', 1e7, 30], ['shot', 1e8, 20]]) {
  const row = [];
  for (const s of [0, 0.25, 0.5, 0.75, 0.9, 0.99, 1]) {
    const r = P.throwObject(ctxOf(kg, { airAbsorb: s, anchor: 'bolted' }), obj(oid), ang);
    const f = r.flight;
    row.push(s + ': dragLoss ' + (r.dragLoss == null ? 'null' : r.dragLoss.toExponential(2)) + ' air ' + (f.air ? f.air.E.toExponential(2) : '-') + ' blast ' + M.throw.blastParts(r, { airAbsorb: s }).path.toExponential(2) + (f.landed ? '' : ' (no landing)'));
  }
  console.log(oid, kg, ang, '\n  ' + row.join('\n  '));
}
