const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const K = P.K;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surface = D.surfaces.find(s => s.id === 'concrete');
const o = D.objects.find(x => x.id === 'esb');
for (const share of [0.85, 0.86]) {
  const c = (kg) => ({ F: kg * K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true });
  let lo = 1, hi = 1e40;
  for (let i = 0; i < 200; i++) { const mid = Math.sqrt(lo * hi); const r = P.throwObject(c(mid), o, 0); if (r.v < 0.0102 * K.c) lo = mid; else hi = mid; }
  const r = P.throwObject(c(hi), o, 0);
  const fa = P.fastAir(o, r.Eobj, 0, 1 - share);
  console.log('share', share, 'dial log10 kg', Math.log10(hi).toFixed(4), 'v/c', (r.v / K.c).toFixed(5), 'vOut km/s', (fa.vOut / 1e3).toFixed(1));
}
// worst/best case thresholds from the page's own figures
const es = D.escape, vSun = 240e3, vE = es.sun * Math.SQRT1_2;
const worst = Math.hypot(Math.hypot(es.galaxyHi + vSun, es.sun) + vE, es.earth), best = Math.hypot(Math.hypot(es.galaxyLo - vSun, es.sun) - vE, es.earth);
console.log('page worst threshold', (es.galaxyHi + vSun) / 1e3, 'km/s; with Earth orbit and wells', (worst / 1e3).toFixed(1));
console.log('page depends-on-direction from', (es.galaxyLo - vSun) / 1e3, 'km/s; best case from surface', (best / 1e3).toFixed(1));
