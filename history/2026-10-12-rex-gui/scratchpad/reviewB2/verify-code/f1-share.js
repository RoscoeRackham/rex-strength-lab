global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const B = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
const g = 9.80665;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const PW = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
let mx = 0, at = null;
for (let e = 16; e <= 23; e += 0.25) { const mO = Math.pow(10, e);
  const R = Object.assign({ F: 1.81e23 * g, mode: 'comic', body: B.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface: surf('concrete'), anchor: 'bolted' }, PW);
  const O = Object.assign({ F: 1.81e23 * g, mode: 'comic', body: B.makeBody({ build: 'ollie', H: 3.048, m: mO }), surface: surf('concrete'), anchor: 'bolted' }, PW);
  const L = B.catchLeg(R, O, obj('baseball'), 100, 'hard'); const k = L.catch; if (!k) continue;
  if (Math.abs(k.firstShare - 1) > Math.abs(mx - 1)) { mx = k.firstShare; at = mO; }
}
console.log('worst firstShare', mx, 'at Ollie mass', at.toExponential(2));
