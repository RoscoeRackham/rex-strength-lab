const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surface = D.surfaces.find(s => s.id === 'concrete');
console.log(Object.keys(D).join(','));
const objs = D.objects || D.throwables;
const car = objs.find(o => /car/i.test(o.id) || /car/i.test(o.name||''));
console.log('car', car && car.id, car && car.m);
for (const kg of [Infinity, 1e30, 1e20]) {
  const ctx = { F: kg * P.K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const r = P.throwObject(ctx, car, 90);
  console.log(kg, JSON.stringify(r.toGround), 'sinkRatioRaw', r.sinkRatioRaw);
}
