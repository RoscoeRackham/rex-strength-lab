const { P, body, ctx, obj, K } = require('./common');
const M = P.RESTRAINT.MOVES;
function run(id, kg, ang) {
  const o = obj(id), res = {};
  for (const s of [0, 0.5]) {
    const c = ctx(kg, { airAbsorb: s, anchor: 'bolted' });
    const r = P.throwObject(c, o, ang);
    const op = { obj: o, angle: ang, body, airAbsorb: s, anchor: 'bolted', surface: c.surface, keepForm: true, unbreakable: true, ownRecoil: true };
    res[s] = { v: r.v, vImp: r.flight.vImpact, landed: r.flight.landed, dragLoss: r.dragLoss, Eobj: r.Eobj, parts: M.throw.blastParts(r, op), blast: M.throw.blast(r, op) };
  }
  const a = res[0], b = res[0.5];
  console.log(id, kg.toExponential(1), ang + 'deg', 'v', a.v.toFixed(0), '/', b.v.toFixed(0), 'm/s; vImpact', a.vImp && a.vImp.toFixed(0), '/', b.vImp && b.vImp.toFixed(0),
    '; dragLoss 0%', a.dragLoss.toExponential(3), '50% flight', b.dragLoss.toExponential(3), '(ratio', (b.dragLoss / a.dragLoss).toFixed(3) + ')',
    '; path blast 0%', a.parts.path.toExponential(3), '50%', b.parts.path.toExponential(3), 'ratio', (b.parts.path / a.parts.path).toFixed(3), '; land', a.parts.land.toExponential(2), b.parts.land.toExponential(2), '; blast ratio', (b.blast / a.blast).toFixed(3));
}
run('nimitz', 1e12, 45);
run('esb', Math.pow(10, 12.5), 45);
run('ruyi', 1e8, 10);
run('car', 1e6, 45);
run('baseball', 1e5, 45);
console.log('--- heavier / scan');
run('pyramid', 1e14, 45);
run('pyramid', 3e14, 45);
run('loco', 1e9, 45);
run('titanic', 1e12, 30);
