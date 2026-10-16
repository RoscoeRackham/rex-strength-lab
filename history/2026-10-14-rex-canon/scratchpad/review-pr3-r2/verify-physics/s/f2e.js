const R='/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/verify-physics/repo/rex-strength-lab';
const P = require(R+'/src/engine.js'); global.window = {}; require(R+'/src/data.js'); const D = window.DINO_DATA;
const o = D.objects.find(x=>x.passenger), g = P.K.g;
const body = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const surface = D.surfaces.find(s => s.id === 'concrete');
const L = Math.cbrt(6*o.m/(Math.PI*(o.rho||1000)));
const ratio = (lk) => { const c = { F: Math.pow(10, lk)*g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true };
  const r = P.throwObject(c, o, 45), f = r.flight, lg = P.PASSENGER.landGround(o, f.vImpact, surface);
  return { v: f.vImpact, full: lg.push/lg.bear, down: lg.push*Math.sin(f.impactAngleDeg*Math.PI/180)/lg.bear }; };
let lo = 5, hi = 6; for (let i = 0; i < 50; i++) { const m = (lo+hi)/2; if (ratio(m).down > 1) hi = m; else lo = m; }
console.log('45deg split threshold dial kg', Math.pow(10, lo).toFixed(0), ratio(lo));
lo = 5; hi = 6; for (let i = 0; i < 50; i++) { const m = (lo+hi)/2; if (ratio(m).full > 1) hi = m; else lo = m; }
console.log('45deg current threshold dial kg', Math.pow(10, lo).toFixed(0), ratio(lo));
