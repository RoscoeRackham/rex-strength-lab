const dir = __dirname + '/../repo/rex-strength-lab/src';
const P = require(dir + '/engine.js'); global.window = {}; require(dir + '/data.js'); const D = window.DINO_DATA;
const g = P.K.g, body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
const car = D.objects.find((o) => o.id === 'car'), conc = D.surfaces.find((s) => s.id === 'concrete');
for (const kg of [90718.474, 1e6, 1e9]) {
  const c = { F: kg * g, mode: 'comic', body, surface: conc, anchor: 'bolted', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const r = P.pull(c, car);
  const pBody = P.vToMomentum ? P.vToMomentum(r.vEnd, body.m) : body.m * r.vEnd;
  const src = P.impulseSource(conc, pBody, r.t10m);
  console.log(kg, 't10m', r.t10m.toPrecision(3), 'vEnd', r.vEnd.toPrecision(3), 'steps p', pBody.toPrecision(3), 'force', (pBody / r.t10m).toPrecision(3), 'ppv5 mm/s', (P.ppvAt(src, 5) * 1000).toPrecision(3), 'rope J', r.recoilAbsorbed.J.toPrecision(3), 'plasterReach m', P.RESTRAINT && src ? '' : '');
}
