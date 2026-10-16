const { P, D, L, body, ctx } = require('./setup.js');
const obj = (id) => D.objects.find((x) => x.id === id);
const cases = [['baseball', 10, 14, 'hard'], ['baseball', 1000, 13, 'hard'], ['person', 31600, 12, 'hard'], ['baseball', 300, 8, 'hard'], ['car', 10000, 9, 'hard']];
for (const [id, Dd, lk, style] of cases) {
  const A = ctx(Math.pow(10, lk), body('rex'), { noKnockback: true }), B = ctx(Math.pow(10, lk), body('ollie'), { noKnockback: true });
  const o = obj(id);
  const la = P.catchLeg(A, B, o, Dd, style);
  const tb = P.RESTRAINT.takenBack('catch', { a: la, b: la }, { A, B, whoA: 'rex', obj: o });
  const vA = la.aim && la.aim.vE;
  console.log(id, Dd, 'm 1e' + lk, la.result, 'fast', !!la.fast, 'vE', vA, 'vArrive', la.vArrive, 'Ecatch', la.catch && la.catch.Ecatch, 'keFromV(vArrive)', la.vArrive && P.keFromV ? P.keFromV(la.vArrive, o.m) : '?', '| rex parts', JSON.stringify(tb.by.rex.parts));
}
