global.window = {};
const R = __dirname + '/repo/src/';
const P = require(R + 'engine.js'); require(R + 'data.js'); const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const out = [];
for (const oid of ['car', 'baseball', 'bus', 'shot', 'piano', 'person']) for (const ang of [0, 45, 90]) for (const lg of [6, 8, 10]) {
  const base = { F: Math.pow(10, lg) * g, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction', keepForm: true, unbreakable: true, ownRecoil: true };
  const o = { obj: obj(oid), angle: ang, target: 30, near: 5 };
  const r = {};
  for (const s of [1, 0]) { const p = P.RESTRAINT.planNow('throw', Object.assign({ airAbsorb: s }, base), o); for (const e of ['windows', 'houses', 'block']) r[e + s] = p.result('preset:' + e).never; }
  const hints = ['windows', 'houses', 'block'].filter((e) => r[e + '1'] && !r[e + '0']);
  if (hints.length) out.push(oid + ' ' + ang + ' 1e' + lg + ': hint for ' + hints.join(','));
}
console.log(out.join('\n') || 'none');
