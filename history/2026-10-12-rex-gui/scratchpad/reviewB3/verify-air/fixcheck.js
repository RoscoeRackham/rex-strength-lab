global.window = {};
const P = require('./engine-fix.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g, c = P.K.c;
const obj = (id) => D.objects.find((x) => x.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const sig = (x) => Number(x).toPrecision(3);
for (const [dial, share] of [[1.81e23, 0.5], [1.81e23, 0.99], [1.81e23, 0.9999], [1.81e23, 1], [1e27, 1], [1e30, 1], [Infinity, 1]]) {
  const cR = { F: dial * g, mode: 'comic', body: rex, surface: D.surfaces.find(s => s.id === 'concrete'), anchor: 'friction', airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true };
  const cO = Object.assign({}, cR, { body: ollie, anchor: 'bolted' });
  const L = P.catchLeg(cR, cO, obj('baseball'), 1000, 'hard');
  const k = L.catch;
  const E0 = L.sheath ? L.sheath.E / L.sheath.share : P.catchReleaseTable(cR, obj('baseball')).E0;
  console.log('dial', dial, 'share', share, L.result, 'Ecatch/E', k ? sig(k.Ecatch / E0) : '-', 'Ecatch', k && sig(k.Ecatch), 'toGroundC', L.toGroundC && sig(L.toGroundC.J));
}
