global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const B = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
const g = 9.80665, c = 299792458;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const PW = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
for (const mO of [3007, 1e12, 1e16, 1e18, 1e20]) {
  const R = Object.assign({ F: 1.81e23 * g, mode: 'comic', body: B.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface: surf('concrete'), anchor: 'bolted' }, PW);
  const O = Object.assign({ F: 1.81e23 * g, mode: 'comic', body: B.makeBody({ build: 'ollie', H: 3.048, m: mO }), surface: surf('concrete'), anchor: 'bolted' }, PW);
  const L = B.catchLeg(R, O, obj('baseball'), 100, 'hard');
  const k = L.catch || {};
  console.log('mO', mO, 'res', L.result, 'mh', k.mh && k.mh.toExponential(3), 'E1', k.E1 && k.E1.toExponential(4), 'Ecatch', k.Ecatch && k.Ecatch.toExponential(4), 'firstShare', k.firstShare, 'pIn', k.pIn);
}
