global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA; const K = P.K;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const surf = D.surfaces.find(s => s.id === 'concrete');
const objs = D.objects || D.throwables;
function run(logKg, Dd, air, objId, style) {
  const base = { F: Math.pow(10, logKg) * K.g, mode: 'comic', surface: surf, anchor: 'friction', airAbsorb: air, keepForm: true, unbreakable: true, ownRecoil: true };
  const cR = Object.assign({ body: rex }, base), cO = Object.assign({ body: ollie }, base);
  const o = objs.find(x => x.id === objId);
  const a = P.catchLeg(cR, cO, o, Dd, style);
  return a;
}
const cases = [[15, 1000, 0.5, 'baseball'], [13.30103, 11500, 0, 'baseball'], [17, 62, 0.5, 'baseball']];
for (const [lk, Dd, air, ob] of cases) {
  const a = run(lk, Dd, air, ob, 'hard');
  const k = a.catch;
  console.log({ lk, Dd, air, ob, result: a.result, vArrive: a.vArrive, vArrive_c: a.vArrive / K.c, sheath: !!a.sheath, sheathShare: a.sheath && a.sheath.share, krel: k && k.relativistic, vL: a.vL || (a.aim && a.aim.vL), keys: Object.keys(a).join(',') });
}
