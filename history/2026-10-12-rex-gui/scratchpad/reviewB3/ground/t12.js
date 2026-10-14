const { P, D, g, surf, obj, rex, ollie, M, ctxOf, sig } = require('./common.js');
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
for (const kg of [9.07e4]) {
  const cA = Object.assign(ctxOf(kg*g, Object.assign({surface: surf('sand')}, ON)), { body: ollie }), cB = ctxOf(kg*g, Object.assign({ anchor: 'friction', surface: surf('sand') }, ON));
  const r = P.collide(cA, cB, { source: 'jump' });
  const s = P.impulseSource(cB.surface, r.toGround.J, r.toGround.T);
  const anc = P.anchorCapacity({ body: rex, surface: surf('sand'), theta: 0, anchor: 'friction', mA: rex.m });
  console.log('Collide jump onto standing Rex on sand', sig(kg), 'kg: held', r.held, 'hold.why', r.hold.why, 'J', sig(r.toGround.J), 'T', sig(r.toGround.T), 'mean force', sig(r.toGround.J/r.toGround.T), 'sand bears (Nmax - mg)', sig(anc.Nmax - rex.m*g), 'ppv5', sig(P.ppvAt(s,5)), 'plaster reach', sig(P.plasterReach(s)));
  const cB0 = Object.assign({}, cB, { unbreakable: false }); const cA0 = Object.assign({}, cA, { unbreakable: false });
  const r0 = P.collide(cA0, cB0, { source: 'jump', toGround: true });
  const s0 = r0.toGround ? P.impulseSource(cB.surface, r0.toGround.J, r0.toGround.T) : null;
  console.log('  same on real sand (toGround option): held', r0.held, r0.toGround && r0.toGround.how, 'J', r0.toGround && sig(r0.toGround.J), 'ppv5', sig(P.ppvAt(s0,5)), 'plaster reach', sig(P.plasterReach(s0)), 'sinks', r0.after && r0.after.splat && sig(r0.after.splat.depth));
}
