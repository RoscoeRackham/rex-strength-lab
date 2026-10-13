global.window = {}; const P = require('./repo/rex-strength-lab/src/engine.js'); require('./repo/rex-strength-lab/src/data.js'); const D = window.DINO_DATA; const g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ol = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const conc = D.surfaces.find((s) => s.id === 'concrete'); const obj = (id) => D.objects.find((o) => o.id === id);
const R = P.RESTRAINT.R;
for (const oid of ['baseball', 'shot', 'piano', 'car']) for (const Dd of [30, 100, 300]) for (const lk of [6, 7, 8]) {
  const res = [];
  for (const s of [0, 1]) {
    const mk = (b) => ({ F: Math.pow(10, lk) * g, mode: 'comic', body: b, surface: conc, anchor: 'friction', unbreakable: true, keepForm: true, ownRecoil: true, airAbsorb: s });
    const L = P.catchLeg(mk(rex), mk(ol), obj(oid), Dd, 'hard');
    const E = L.result === 'fireball' ? L.fireball.E : L.result === 'hits-ground' ? L.hitsGround.E : L.aim && L.aim.vL >= P.K.a0 && L.drag ? (1 - s) * (L.drag.E || 0) : 0;
    res.push({ s, r: L.result, v: L.aim && L.aim.vL, E, win: P.blastRadius(E, R.DP_WINDOWS) >= R.STREET });
  }
  if (res[0].win && !res[1].win) console.log(oid, Dd, lk, JSON.stringify(res));
}
