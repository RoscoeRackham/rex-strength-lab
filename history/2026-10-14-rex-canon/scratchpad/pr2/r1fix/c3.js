// code-3: where the throw's own-recoil plaster credit fires (the page's offPlasterHim), and copy-3: the bolted pull's time
global.window = global;
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'), D = window.DINO_DATA, g = P.K.g;
const body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const M = P.RESTRAINT.MOVES.throw, H = P.RESTRAINT.HAZARDS.find((h) => h.id === 'plaster');
const hits = [];
for (const sid of ['concrete', 'asphalt', 'granite', 'gravel', 'sand', 'clay']) for (const oid of ['semi', 'bus', 'loco', 'pickup', 'car']) for (const th of [0, 15, 30, 45]) for (const lg of [5, 6, 7, 8]) {
  const surface = D.surfaces.find((x) => x.id === sid); if (!surface) continue;
  const obj = D.objects.find((x) => x.id === oid);
  const c = Object.assign({ F: Math.pow(10, lg) * g, mode: 'comic', body, surface, anchor: 'friction' }, ON);
  const p = P.RESTRAINT.planNow('throw', c, { obj, angle: th, target: 30, near: 5 });
  if (!p.result('hazard:plaster').never) continue;
  const c0 = Object.assign({}, c, { ownRecoil: false }), o0 = Object.assign({}, p.opt, { ownRecoil: false }), r0 = M.run(c0, o0);
  if (H.test(M, r0, o0) && M.shakeFrom(r0, o0) === 'him') hits.push([sid, oid, th, lg].join(' '));
}
console.log('credit fires:', hits);
for (const lg of [Math.log10(100 * 907.18474), 9]) {
  const c = { F: Math.pow(10, lg) * g, mode: 'comic', body, surface: D.surfaces.find((x) => x.id === 'concrete'), anchor: 'bolted', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: false };
  const r = P.pull(c, D.objects.find((x) => x.id === 'car'));
  console.log('bolted pull, own recoil off, 10^' + lg.toFixed(2), 't10m', r.t10m, 'rope', r.ropeT, 'J', r.ropeT * r.t10m);
}
