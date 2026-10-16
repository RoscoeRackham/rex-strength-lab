const R='/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/verify-physics/repo/rex-strength-lab';
const P = require(R+'/src/engine.js'); global.window = {}; require(R+'/src/data.js'); const D = window.DINO_DATA;
const o = D.objects.find(x=>x.passenger), g = P.K.g;
const body = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const surface = D.surfaces.find(s => s.id === 'concrete');
const L = Math.cbrt(6*o.m/(Math.PI*(o.rho||1000)));
for (const [lk, ang] of [[5.5,0],[6,0],[7,0],[5.5,10],[5.5,45],[6,45],[5.2,45]]) {
  const c = { F: Math.pow(10, lk)*g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true };
  const r = P.throwObject(c, o, ang), f = r.flight;
  const lg = P.PASSENGER.landGround(o, f.vImpact, surface);
  const th = f.impactAngleDeg*Math.PI/180, vd = f.vImpact*Math.sin(th);
  const downPushTv = o.m*f.vImpact*Math.sin(th)/lg.T; // J sin / T (T = L/v)
  const downPushOwn = o.m*vd*vd/L;                     // vertical stop over own size, L/vd
  console.log(`logKg ${lk} ang ${ang}: v0 ${r.v.toFixed(1)} vImp ${f.vImpact.toFixed(1)} apex ${f.apex.toFixed(2)} impAng ${f.impactAngleDeg.toFixed(2)} vdown ${vd.toFixed(2)} gives ${lg.gives} push/bear ${(lg.push/lg.bear).toFixed(3)} Jsin/T/bear ${(downPushTv/lg.bear).toFixed(3)} m vd^2/L /bear ${(downPushOwn/lg.bear).toFixed(4)}`);
}
console.log('45deg slab threshold with sin split', 101.9/Math.sqrt(Math.sin(Math.PI/4)));
