global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const B = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
const g = 9.80665, c = 299792458;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const PW = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
for (const mO of [1e18, 1e20, 1e22]) {
  const R = Object.assign({ F: 1e14 * g, mode: 'comic', body: B.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface: surf('concrete'), anchor: 'bolted' }, PW);
  const O = Object.assign({ F: 1e14 * g, mode: 'comic', body: B.makeBody({ build: 'ollie', H: 3.048, m: mO }), surface: surf('concrete'), anchor: 'bolted' }, PW);
  const L = B.catchLeg(R, O, obj('baseball'), 100, 'hard');
  const k = L.catch || {};
  const m = 0.145, mh = k.mh;
  const gam = 1 / Math.sqrt(1 - (L.vArrive / c) ** 2);
  const Ein = (gam - 1) * m * c * c;
  const M1 = Math.sqrt(m * m + mh * mh + 2 * gam * m * mh);
  const E1exact = 2 * (gam - 1) * m * mh * c * c / (M1 + m + mh);
  console.log('mO', mO, 'res', L.result, 'fast', L.fast, 'v', (L.vArrive / c * 100).toFixed(3) + '%c', 'mh', mh && mh.toExponential(3), 'E1', k.E1, 'Ecatch', k.Ecatch && k.Ecatch.toExponential(3), 'F', k.F && k.F.toExponential(3), 'firstShare', k.firstShare, '| Ein', Ein.toExponential(3), 'E1 exact', E1exact.toExponential(3));
}
