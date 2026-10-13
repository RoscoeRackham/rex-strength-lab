global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const pullable = D.objects.filter(o => !o.noPull);
console.log('pullable:', pullable.map(o => o.id + ':' + o.m).join(', '));
function run(m, surf, objId, logKg, own) {
  const body = P.makeBody({ build: 'rex', H: 3.048, m });
  const ctx = { F: Math.pow(10, logKg) * P.K.g, mode: 'comic', body, surface: D.surfaces.find(s => s.id === surf), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: own };
  const o = D.objects.find(x => x.id === objId);
  const r = P.pull(ctx, o);
  const rope = r.canMove ? o.m * r.accel + r.resist : 0;
  const branchFooting = !r.canMove || rope >= r.anchor.R * (1 - 1e-6);
  return { m, surf, objId, own, R: r.anchor.R, usable: r.usable, resist: r.resist, canMove: r.canMove, accel: r.accel, rope, ropeT: r.ropeT, bodyMa: m * r.accel, t10m: r.t10m, binds: r.usable >= r.anchor.R * (1 - 1e-9), branch: branchFooting ? 'footing-caps' : 'what-the-load-takes' };
}
for (const [m, surf, obj] of [[3007, 'granite', 'loco'], [3007, 'concrete', 'loco'], [3007, 'sand', 'loco'], [3007, 'granite', 'car'], [3007, 'granite', 'bus'], [3e9, 'granite', 'loco']]) {
  console.log(JSON.stringify(run(m, surf, obj, 14, false)));
  console.log(JSON.stringify(run(m, surf, obj, 14, true)));
}
