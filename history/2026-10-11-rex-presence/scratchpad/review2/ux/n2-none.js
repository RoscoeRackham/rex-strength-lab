global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g, R = P.RESTRAINT;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surf = (id) => D.surfaces.find((s) => s.id === id);
console.log(D.surfaces.map((s) => s.id).join(','));
for (const sfc of D.surfaces.map((s) => s.id)) for (const o of D.objects.filter((x) => !x.noThrow)) {
  const c = { F: 90718.474 * g, mode: 'comic', body: rex, surface: surf(sfc), groundHolds: false, anchor: 'friction' };
  try {
    const p = R.plan('throw', c, { near: 5, obj: o, angle: 45, target: 30 });
    let k = 0; while (!p.step() && k++ < 100000);
    const ce = p.ceiling();
    if (ce.by && !(ce.below > 0)) console.log('throw', o.id, sfc, 'nothing harmless: by', ce.by);
  } catch (e) {}
}
