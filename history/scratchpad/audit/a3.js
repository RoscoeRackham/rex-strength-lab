// Jump on yielding ground: engine vs momentum-conserving version of its own model
const { P, D, g, S, O, T, ctx } = require('./common');
const fmt = (x) => (typeof x === 'number' ? x.toPrecision(4) : x);
for (const sid of ['sand', 'concrete']) {
  for (const kg of [511, 1000, 1376, 1500, 2000, 5000, 9072, 90718, 1e6, 1.36e11, 1.8e20, Infinity]) {
    const c = ctx(kg, { surface: sid });
    const r = P.jump(c);
    const b = c.body;
    const pA = r.push.pA, pB = r.push.pB;
    const vEng = r.v;
    const vMom = Math.max(0, (pA - pB)) / b.m; // inelastic lock at full leg extension
    console.log(sid, 'liftKg', fmt(kg), 'Fjump', fmt(r.F), 'RB', fmt(r.groundLimitForce), 'fails', r.groundFails,
      '| t', fmt(r.push.t), 'pA', fmt(pA), 'pB', fmt(pB), '| vEng', fmt(vEng), 'apexEng', fmt(r.flight.apex),
      '| v(momentum-conserving)', fmt(vMom), 'vacApex', fmt(vMom*vMom/2/g), 'sink', fmt(r.sink));
  }
}
