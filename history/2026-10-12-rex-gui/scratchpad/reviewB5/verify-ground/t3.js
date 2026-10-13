const { P, D, rex, surf, obj, ctxOf } = require('./common.js');
const ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const g = P.K.g;
for (const sid of ['sand', 'softclay', 'gravel', 'stiffclay', 'concrete']) {
  const s = surf(sid);
  const cA = Object.assign(ctxOf({ F: 1e5 * g, surface: s }), { body: ollie }), cB = ctxOf({ F: 1e5 * g, surface: s });
  const r = P.collide(cA, cB, { source: 'jump' });
  const Nmax = P.qultFor(s, rex.footB) * 2 * rex.footArea;
  const tg = r.toGround;
  const capFix = Math.max(0, Nmax - (rex.m + ollie.m) * g) * tg.T;
  const Jfix = Math.min(tg.whole || tg.J, capFix);
  const pp = (J) => P.ppvAt(J > 0 ? P.impulseSource(s, J, tg.T) : null, 5) * 1000;
  console.log(`${sid}: held=${r.held} why=${r.hold && r.hold.why} Nmax=${Nmax.toFixed(0)} W_rex=${(rex.m*g).toFixed(0)} W_both=${((rex.m+ollie.m)*g).toFixed(0)} toGround J=${tg.J.toFixed(0)} whole=${tg.whole&&tg.whole.toFixed(0)} T=${(tg.T*1000).toFixed(1)}ms (Nmax-mB g)T=${((Nmax-rex.m*g)*tg.T).toFixed(0)}  ppv5=${pp(tg.J).toFixed(2)}  | with both weights: J=${Jfix.toFixed(0)} ppv5=${pp(Jfix).toFixed(2)}`);
}
