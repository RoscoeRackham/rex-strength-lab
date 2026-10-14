global.window = {};
const R = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(R + '/src/engine.js'); require(R + '/src/data.js'); const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const ON = { keepForm: true, unbreakable: true, ownRecoil: true };
for (const [oid, ang] of [['car', 0], ['car', 45], ['baseball', 0], ['baseball', 30], ['bus', 0]]) for (const lg of [6, 7, 8, 9, 10, 11]) {
  const res = {};
  for (const s of [1, 0]) {
    const c = Object.assign({ F: Math.pow(10, lg) * g, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction', airAbsorb: s }, ON);
    const p = P.RESTRAINT.planNow('throw', c, { obj: obj(oid), angle: ang, target: 30, near: 5 });
    res[s] = ['rattle', 'windows', 'houses', 'block'].map((e) => p.result('preset:' + e).never ? 'N' : 'y').join('');
  }
  console.log(oid, ang, lg, '100%:', res[1], ' 0%:', res[0]);
}
