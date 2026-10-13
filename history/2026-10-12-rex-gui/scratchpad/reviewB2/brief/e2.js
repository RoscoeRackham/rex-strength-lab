global.window = {}; const P = require('./repo/rex-strength-lab/src/engine.js'); require('./repo/rex-strength-lab/src/data.js'); const D = window.DINO_DATA; const g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ol = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const car = D.objects.find((o) => o.id === 'car');
for (const air of [1, 0.5, 0]) for (const lk of [7, 9]) {
  const c = (b) => ({ F: Math.pow(10, lk) * g, mode: 'comic', body: b, surface: D.surfaces.find((s) => s.id === 'concrete'), anchor: 'friction', unbreakable: true, keepForm: true, ownRecoil: true, airAbsorb: air });
  const L = P.catchLeg(c(rex), c(ol), car, 1000, 'hard');
  const Eair = L.result === 'fireball' ? L.fireball.E : L.result === 'hits-ground' ? L.hitsGround.E : L.aim && L.aim.vL >= P.K.a0 && L.drag ? P.dragFactor(c(rex)) * (L.drag.E || 0) : 0;
  console.log('air', air, '1e' + lk, L.result, 'vL', L.aim && L.aim.vL.toPrecision(4), 'dragE', L.drag && L.drag.E && L.drag.E.toPrecision(3), 'Eair', Eair.toPrecision(3), 'windows R', P.blastRadius(Eair, P.RESTRAINT.R.DP_WINDOWS).toPrecision(3), 'street', P.RESTRAINT.R.STREET);
}
