const R='/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/verify-physics/repo/rex-strength-lab';
const P = require(R+'/src/engine.js'); global.window = {}; require(R+'/src/data.js'); const D = window.DINO_DATA;
const o = D.objects.find(x=>x.passenger), g = P.K.g;
const surface = D.surfaces.find(s => s.id === 'concrete');
const mk = (b, lk, air) => ({ F: Math.pow(10, lk)*g, mode: 'comic', body: P.makeBody({ build: b, ...P.DEFAULT_BODIES[b] }), surface, anchor: 'friction', airAbsorb: air, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true });
const L = Math.cbrt(6*o.m/(Math.PI*(o.rho||1000)));
for (const [lk, ld, air] of [[8, 2, 0], [Math.log10(100*907.18474), 1, 0], [Math.log10(100*907.18474), 1, 1]]) {
  const cR = mk('rex', lk, air), cO = mk('ollie', lk, air);
  const Dd = Math.max(P.catchMinD(cR.body, cO.body, o), Math.pow(10, ld));
  const a = P.catchLeg(cR, cO, o, Dd, 'hard');
  const fm = P.flyTo({ v0: a.aim.vE, thetaDeg: a.aim.thetaDeg, h0: a.h0, hStop: 0, m: o.m, A: o.area, Cd: o.Cd, CdSup: o.CdSup, Rn: undefined, dragK: air < 1 ? 1 - air : undefined });
  const lg = P.PASSENGER.landGround(o, a.miss.vImpact, surface);
  const th = fm.impactAngleDeg*Math.PI/180;
  console.log('lk', lk.toFixed(2), 'air', air, 'h0', a.h0.toFixed(2), 'miss v', a.miss.vImpact.toFixed(2), 'rebuilt v', fm.vImpact.toFixed(2), 'impAng', fm.impactAngleDeg.toFixed(2), 'vdown', (fm.vImpact*Math.sin(th)).toFixed(2), 'gives', lg.gives, 'push/bear', (lg.push/lg.bear).toFixed(3), 'Jsin/T/bear', (lg.push*Math.sin(th)/lg.bear).toFixed(3));
}
