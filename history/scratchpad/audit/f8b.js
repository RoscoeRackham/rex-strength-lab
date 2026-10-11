const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {}; require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const K = P.K, g = K.g;
const body = P.makeBody({H:2,m:180});
console.log('legEff', body.legEff, 'footArea', body.footArea);
const tiers = D.tiers.filter(t=>isFinite(t.liftKg));
for (const sid of ['sand','concrete','granite']) {
  const surface = D.surfaces.find(s=>s.id===sid);
  for (const t of tiers) {
    const r = P.stomp({F:t.liftKg*g, mode:'comic', body, surface, groundHolds:false, anchor:'friction'});
    // Poncelet rigid penetrator (nonrelativistic): m dv/dx = -A (q + 0.5 rho v^2)
    const m = body.legEff, A = body.footArea, q = surface.qult, rho = surface.rho;
    const v = r.vFoot;
    const pon = (m/(rho*A))*Math.log(1 + rho*v*v/(2*q));
    console.log(sid.padEnd(9), t.id.padEnd(11), 'logKg', Math.log10(t.liftKg).toFixed(2), 'vFoot', v.toExponential(3), 'holeDepth(engine) m', r.holeDepth.toExponential(3), '| /2R_E', (r.holeDepth/(2*K.R_E)).toExponential(2), '| Poncelet m', pon.toExponential(3), 'ratio', (r.holeDepth/pon).toExponential(2), 'quake', r.quake.toFixed(2));
  }
}
