const { P, D, rex, surf, obj, ctx, ON, K } = require('./h.js');
const b = rex();
console.log('whipEff', b.whipEff, 'handEff', b.handEff, 'limbPulse', P.limbPulse(b));
for (const [oid, kg] of [['baseball', 90718], ['baseball', 1e6], ['baseball', 1e8], ['shot', 1e6], ['bowling', 1e6], ['car', 1e6], ['bus', 1e6]]) {
  const c = Object.assign(ctx({ F: kg*K.g }), ON);
  const r = P.throwObject(c, obj(oid), 45);
  const pObj = P.vToMomentum(r.v, obj(oid).m);
  const s1 = P.impulseSource(c.surface, r.toGround.J, r.toGround.T), s2 = P.impulseSource(c.surface, pObj, r.toGround.T);
  console.log(oid, kg.toExponential(0), 'v', r.v.toFixed(1), 'push.t', r.push.t.toExponential(2), 'J', r.toGround.J.toExponential(2), 'p_obj', pObj.toExponential(2), 'ratio', (r.toGround.J/pObj).toFixed(1), '| plaster reach with J', P.plasterReach(s1).toFixed(1), 'with p_obj', P.plasterReach(s2).toFixed(1), '| feel reach', P.ppvReach(s1, P.VIB.TH.feel).toFixed(1), P.ppvReach(s2, P.VIB.TH.feel).toFixed(1));
}
