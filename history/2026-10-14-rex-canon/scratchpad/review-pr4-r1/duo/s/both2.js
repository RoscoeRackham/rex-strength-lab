const { P, D, g, rex, ollie, surf, ON, OFF, ctx, DIAL } = require('./env.js');
for (const kg of [2570, 9000, DIAL, 1e6, 1e9]) {
  const cR = ctx(kg, rex, Object.assign({}, ON, { anchor: 'bolted' })), cO = ctx(kg, ollie, Object.assign({}, ON));
  const r = P.shoveBoth(cR, cO);
  const s1 = P.shove(cO, cR);
  const src = (x) => x ? P.impulseSource(cR.surface, x.J, Math.max(1e-9, x.T)) : null;
  console.log(kg, 'shover', r.shover, 'toGround', JSON.stringify(r.toGround), 'toGroundA', JSON.stringify(r.toGroundA), 'toGroundB', JSON.stringify(r.toGroundB), 'plasterA', r.toGroundA ? P.plasterOver([src(r.toGroundA)], 5) : null, 'single shove Ollie->bolted Rex toGroundB', JSON.stringify(s1.toGroundB), s1.toGroundB ? P.plasterOver([src(s1.toGroundB)], 5) : null);
}
