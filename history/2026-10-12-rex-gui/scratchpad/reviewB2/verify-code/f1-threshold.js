global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const B = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
const g = 9.80665, c = 299792458;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const PW = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
for (const mO of [3007, 1e6, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13, 1e14, 1e15]) {
  const R = Object.assign({ F: 1e14 * g, mode: 'comic', body: B.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface: surf('concrete'), anchor: 'bolted' }, PW);
  const O = Object.assign({ F: 1e14 * g, mode: 'comic', body: B.makeBody({ build: 'ollie', H: 3.048, m: mO }), surface: surf('concrete'), anchor: 'bolted' }, PW);
  const L = B.catchLeg(R, O, obj('baseball'), 100, 'hard');
  const k = L.catch || {};
  if (!k.mh) { console.log(mO, L.result); continue; }
  const m = 0.145, mh = k.mh;
  const gam = 1 / Math.sqrt(1 - (L.vArrive / c) ** 2);
  const M1 = Math.sqrt(m * m + mh * mh + 2 * gam * m * mh);
  const E1exact = 2 * (gam - 1) * m * mh * c * c / (M1 + m + mh);
  console.log('mO', mO.toExponential(0), 'res', L.result, 'E1', k.E1.toExponential(4), 'exact', E1exact.toExponential(4), 'rel err', ((k.E1 - E1exact) / E1exact).toExponential(2));
}
