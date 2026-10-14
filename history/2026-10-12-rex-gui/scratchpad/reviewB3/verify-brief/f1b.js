const { P, D, rex, surf, ctx } = require('./common.js');
for (const s of ['concrete','asphalt','sand','gravel','softclay','rock']) {
  if (!surf(s)) { console.log('no', s); continue; }
  for (const kg of [90718, 1e6, 1e8]) {
    const c = ctx({ F: kg * P.K.g, surface: surf(s) });
    const r = P.jumpOnce(c);
    if (!r.pushOff) { console.log(s, kg, 'no pushOff'); continue; }
    const full = P.impulseSource(c.surface, r.pushOff.J, r.pushOff.T);
    const capJ = Math.min(r.pushOff.J, r.groundLimitReal * r.pushOff.T);
    const cap = P.impulseSource(c.surface, capJ, r.pushOff.T);
    console.log(`${s} ${kg} F/RBreal=${(r.F/r.groundLimitReal).toFixed(2)} J=${r.pushOff.J.toExponential(2)} capJ=${capJ.toExponential(2)} plaster full=${P.plasterReach(full).toFixed(1)}m cap=${P.plasterReach(cap).toFixed(1)}m`);
  }
}
console.log(D.surfaces.map(s=>s.id).join(','));
