const { P, D, rex, surf, ctx } = require('./common.js');
for (const kg of [1e5, 1e6]) {
  for (const unb of [true, false]) {
    const c = ctx({ F: kg * P.K.g, surface: surf('sand'), unbreakable: unb });
    const r = P.jumpOnce(c);
    const RBreal = P.qultFor(c.surface, rex.footB) * 2 * rex.footArea;
    const o = Object.assign({}, c, { near: 5, m: rex.m });
    const sh = P.MOVES ? null : null;
    console.log(`kg=${kg} unb=${unb} v=${r.v.toFixed(1)} F=${(r.F/1e3).toFixed(0)}kN RB=${r.groundLimitForce} RBreal=${(RBreal/1e3).toFixed(1)}kN groundLimitReal=${r.groundLimitReal} pushOff=${JSON.stringify(r.pushOff)} pushT=${r.push && r.push.t}`);
    if (r.pushOff) {
      const full = P.impulseSource(c.surface, r.pushOff.J, r.pushOff.T);
      const capJ = Math.min(r.pushOff.J, (r.groundLimitReal) * r.pushOff.T);
      const cap = P.impulseSource(c.surface, capJ, r.pushOff.T);
      console.log(`  full J=${r.pushOff.J.toFixed(0)} ppv5=${(P.ppvAt(full,5)*1e3).toFixed(2)}mm/s plasterReach=${P.plasterReach(full).toFixed(1)}m ; bearing-capped J=${capJ.toFixed(0)} ppv5=${(P.ppvAt(cap,5)*1e3).toFixed(2)}mm/s plasterReach=${P.plasterReach(cap).toFixed(1)}m`);
    }
  }
}
