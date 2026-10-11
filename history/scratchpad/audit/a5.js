const { P, D, g, S, O, T, ctx } = require('./common');
const fmt = (x) => x.toPrecision(3);
for (const sid of ['sand', 'concrete', 'granite']) for (const t of D.tiers) {
  const c = ctx(t.liftKg, { surface: sid });
  const r = P.stomp(c);
  const m = c.body.legEff, A = c.body.footArea, q = S[sid].qult, rho = S[sid].rho;
  const v = r.vFoot;
  const pon = (k) => (m / (2 * k * rho * A)) * Math.log1p(k * rho * v * v / q);
  console.log(sid.padEnd(8), t.id.padEnd(10), 'vFoot', fmt(v), 'E', fmt(r.E), 'holeDepth(engine)', fmt(r.holeDepth), 'm', '| Poncelet k=1', fmt(pon(1)), 'k=0.5', fmt(pon(0.5)), '| crater D', fmt(r.crater), '| ratio eng/Pon(k=1)', fmt(r.holeDepth / pon(1)));
}
