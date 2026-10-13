const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const car = D.objects.find(o => o.id === 'car');
const surface = D.surfaces.find(s => s.id === 'concrete');
for (const F of [1e34 * g, Infinity]) {
  const r = P.throwObject({ F, mode: 'comic', body: rex, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, car, 90);
  console.log('F', F, 'push.t', r.push && r.push.t, 'limbPulse', P.limbPulse(rex), 'toGround', r.toGround, 'sinkRatioRaw', r.sinkRatioRaw);
}
