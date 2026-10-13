const { P, D, body, surf, ctx } = require('./eng.js');
const o = D.objects.find((x) => x.id === 'baseball');
const c = ctx(1e9, { airAbsorb: 0.3 });
// find the windows effort through the engine's RESTRAINT plan
const opt = Object.assign({}, c, { obj: o, angle: 0, near: P.RESTRAINT.R.NEAR });
let r;
for (const kg of [2.2e8, 2.3e8, 2.32e8, 2.35e8]) {
  const cc = Object.assign({}, c, { use: kg * P.K.g });
  r = P.throwObject(cc, o, 0);
  const f = r.flight;
  console.log(kg.toExponential(3), 'Eobj', r.Eobj.toPrecision(5), 'air.E', f.air && f.air.E.toPrecision(5), 'Eimpact', r.Eimpact && r.Eimpact.toPrecision(4), 'dragLoss', r.dragLoss && r.dragLoss.toPrecision(5), 'air+land/Eobj', ((f.air.E + (r.Eimpact || 0)) / r.Eobj).toFixed(4), 'landed', f.landed);
}
