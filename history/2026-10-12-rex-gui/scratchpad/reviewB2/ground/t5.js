const { P, D, rex, surf, obj, ctx, ON, K } = require('./h.js');
const R = P.RESTRAINT;
const M = (move, c, o) => { const opt = Object.assign({ near: 5, body: c.body, surface: c.surface, anchor: c.anchor, m: c.body.m, unbreakable: !!c.unbreakable, ownRecoil: !!c.ownRecoil, airAbsorb: c.airAbsorb, keepForm: !!c.keepForm }, o); const r = move === 'throw' ? P.throwObject(c, o.obj, o.angle) : P[move](c); const rr = R.reach(move, r, opt); return { r, ppv5: (()=>{ const src = null; return rr; })() }; };
function shake(move, c, o) {
  const opt = Object.assign({ near: 5, body: c.body, surface: c.surface, anchor: c.anchor, m: c.body.m, unbreakable: !!c.unbreakable, ownRecoil: !!c.ownRecoil, airAbsorb: c.airAbsorb, keepForm: !!c.keepForm }, o || {});
  const r = move === 'throw' ? P.throwObject(c, opt.obj, opt.angle) : P[move](c);
  const pl = R.plan(move, c, o || {});
  // use plan's own shake via reach
  const rr = R.reach(move, r, opt);
  return { r, plaster: rr.plaster, rattle: rr.rattle, feel: rr.feel };
}
for (const sid of ['sand','concrete']) {
  for (const kg of [3e3, 1e4, 1e5, 1e6, 1e8]) {
    for (const move of ['stomp','jump']) {
      const c0 = ctx({ F: kg*K.g, surface: surf(sid) });
      const a = shake(move, c0), b = shake(move, Object.assign({}, c0, { unbreakable: true }));
      const extra = move === 'stomp' ? ` hole off ${a.r.holeDepth.toFixed(2)} on ${b.r.holeDepth.toFixed(2)} realBreaks ${b.r.realBreaks}` : ` v off ${a.r.v.toFixed(1)} on ${b.r.v.toFixed(1)} groundFails off ${a.r.groundFails} landRatio off ${a.r.landing.ratio.toFixed(2)} on-real ${b.r.landRatioReal.toFixed(2)} pushOff ${!!b.r.pushOff}`;
      console.log(sid, kg.toExponential(0), move, 'plaster reach off', a.plaster.toFixed(2), 'on', b.plaster.toFixed(2), 'feel off', a.feel.toFixed(1), 'on', b.feel.toFixed(1), extra);
    }
  }
}
