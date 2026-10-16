const R = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r1/verify-copy/repo/rex-strength-lab';
const P = require(R + '/src/engine.js'); global.window = {}; require(R + '/src/data.js'); const D = window.DINO_DATA;
const rex = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const surface = D.surfaces.find(s => s.id === 'concrete');
const car = D.objects.find(o => o.id === 'car');
for (const kg of [90718.474, 1e9]) for (const own of [false, true]) {
  const ctx = { F: kg * P.K.g, mode: 'comic', body: rex, surface, anchor: 'bolted', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: own, use: kg * P.K.g };
  const r = P.pull(ctx, car);
  const rope = car.m * r.accel + r.resist, J = rope * r.t10m;
  const ppv = P.ppvAt && P.impulseSource ? P.ppvAt(P.impulseSource(surface, J, r.t10m), 5) : 'n/a';
  console.log('kg', kg, 'own', own, 't10m', r.t10m, 'rope N', rope.toFixed(0), 'J', J.toFixed(0), 'ppv@5m mm/s', typeof ppv === 'number' ? (ppv*1000).toFixed(3) + ' (raw ' + ppv + ')' : ppv, 'recoilAbsorbed', r.recoilAbsorbed && r.recoilAbsorbed.J.toFixed(0), 'toGround', JSON.stringify(r.toGround));
}
console.log(Object.keys(P).filter(k => /ppv|impulse|shake|rattle|PLASTER|RATTLE/i.test(k)));
