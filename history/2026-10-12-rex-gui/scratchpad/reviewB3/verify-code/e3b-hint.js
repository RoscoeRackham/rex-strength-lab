const R = __dirname + '/repo/rex-strength-lab/';
const P = require(R + 'src/engine.js'); global.window = {}; require(R + 'src/data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const obj = (id) => D.objects.find((o) => o.id === id);
for (const share of [1, 0.5, 0.01, 0]) {
  const c = { F: 7e7 * P.K.g, mode: 'comic', body, surface: D.surfaces.find((s) => s.id === 'concrete'), anchor: 'friction', airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true };
  const p = P.RESTRAINT.planNow('throw', c, { near: 5, target: 30, obj: obj('baseball'), angle: 0 });
  const w = p.result('preset:windows');
  console.log('dial 7e7 kg share', share, 'windows', w.never ? 'never' : (w.use / P.K.g).toExponential(3) + ' kg');
}
