const { P, D, g, surf, obj, rex, ollie, ON, ctxOf, sig } = require('./base.js');
const S = (o) => o ? JSON.stringify(Object.fromEntries(Object.entries(o).filter(([k, v]) => typeof v !== 'object' && typeof v !== 'function').map(([k, v]) => [k, sig(v)]))) : '-';
for (const kg of [90718.474, 1e9, 1e12]) for (const [lab, ex] of [['off', {}], ['on', ON], ['UB only', { unbreakable: true }]]) for (const src of ['sprint', 'jump']) for (const bounce of [false, true]) {
  const cA = Object.assign(ctxOf(kg, ex), { body: ollie }), cB = ctxOf(kg, ex);
  const r = P.collide(cA, cB, { source: src, bounce });
  if (!r.h) { console.log('COLLIDE', sig(kg), lab, src, bounce, r.outcome, r.why); continue; }
  const mA = ollie.m, mB = rex.m;
  const pin = r.pA;
  let after;
  if (r.held) after = bounce ? P.vToMomentum(Math.abs(r.h.el.vA), mA) * Math.sign(r.h.el.vA) : 0;
  else after = bounce ? mA * r.h.el.vA + mB * r.h.el.vT : (mA + mB) * r.h.inel.V;
  const tg = r.toGround, gw = tg ? (tg.whole != null ? tg.whole : tg.J) : (r.partial ? r.partial.Jearth : null);
  console.log('COLLIDE', sig(kg), lab, src, bounce ? 'bounce' : 'splat', r.outcome, 'held', r.held, 'pA', sig(pin), 'after', sig(after), 'toGround', S(tg), 'partial.Jearth', r.partial ? sig(r.partial.Jearth) : '-', 'resid', sig((pin - after - (gw || 0)) / pin), 'why', r.hold && r.hold.why);
}
// instant growth
for (const E of [1e6, 1e15, 4.2e23]) for (const [lab, gnd] of [['off', { surface: surf('concrete') }], ['UB', { surface: surf('concrete'), unbreakable: true }], ['none', undefined], ['sand off', { surface: surf('sand') }]]) {
  const I = P.instantGrowth(rex, E, 0.5, gnd);
  console.log('GROW', sig(E), lab, 'gives', I.gives, 'Pocean', sig(I.Pocean), 'm vSole', sig(I.grown.m * I.vSole), '(F-mg)tau', sig((I.Fground - I.grown.m * g) * I.tau), 'toGround', S(I.toGround));
}
