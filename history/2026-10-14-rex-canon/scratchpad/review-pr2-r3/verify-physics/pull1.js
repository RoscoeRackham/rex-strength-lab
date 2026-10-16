const R = process.env.R || (__dirname + '/repo/rex-strength-lab');
const P = require(R + '/src/engine.js'); global.window = {}; require(R + '/src/data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const surf = D.surfaces.find(s => s.id === 'concrete');
const objs = (D.objects || D.loads || []);
console.log('keys', Object.keys(D).join(','));
const F = 90718.474 * P.K.g;
function ctx(over) { return Object.assign({ F, mode: 'comic', body, surface: surf, anchor: 'bolted', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, over); }
for (const id of ['car', 'person', 'baseball', 'bus', 'pickup', 'motorcycle']) {
  const o = objs.find(x => x.id === id); if (!o) { console.log('no', id); continue; }
  for (const own of [true, false]) {
    const r = P.pull(ctx({ ownRecoil: own }), o);
    const legs = r.walkPush ? r.walkPush.J / r.walkPush.T : NaN;
    const KE = 0.5 * body.m * r.vEnd ** 2;
    console.log(id, o.m, 'own', own, 't', r.t10m.toPrecision(4), 'vEnd', r.vEnd.toPrecision(5), 'legs N', legs.toPrecision(4), 'x dial', (legs / F).toPrecision(4), 'accel g', (r.accel / P.K.g).toPrecision(4), 'bodyKE', KE.toPrecision(4), 'F*10', (F * 10).toPrecision(4));
  }
}
