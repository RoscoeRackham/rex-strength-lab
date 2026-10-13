// groundHolds (Comic ground) vs unbreakable (5c) in the working-tree engine: where do they differ?
global.window = {};
const ROOT = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(ROOT + '/src/engine.js'); require(ROOT + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const C = (x) => Object.assign({ F: 1e6 * g, mode: 'comic', body: rex, surface: surf('sand'), anchor: 'friction' }, x);
const f = (x) => (typeof x === 'number' ? Number(x.toPrecision(4)) : x);
for (const [lab, x] of [['groundHolds', { groundHolds: true }], ['unbreakable', { unbreakable: true }], ['off', {}]]) {
  const pr = P.presence(rex, surf('sand'), Object.assign({ pace: 'walk', effort: 0.5 }, x));
  const st = P.stomp(C(x)), j = P.jump(C(x)), I = P.instantGrowth(rex, 4.2e23, 0.5, Object.assign({ surface: surf('concrete') }, x));
  const pl = P.RESTRAINT.planNow('stomp', C(x), {});
  console.log(lab.padEnd(12), JSON.stringify({ walkPrint: pr.step.footprint && [pr.step.footprint.kind, f(pr.step.footprint.depth)], ppv5_mm: f(pr.ppv(5) * 1e3), stompHole: f(st.holeDepth), stompQuake: f(st.quake), jumpV: f(j.v), jumpEground: f(j.Eground), growGives: I.gives, growEground: f(I.Eground), growRise: f(I.rise), stompCeilingBy: pl.ceiling().by }));
}
