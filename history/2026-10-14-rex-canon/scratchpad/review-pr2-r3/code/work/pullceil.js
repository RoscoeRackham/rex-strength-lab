// courtesy ceiling and plaster/rattle presets for friction and bolted pulls: main vs branch, all four powers on
const path = require('path');
const load = (dir) => { global.window = {}; const e = path.join(dir, 'src/engine.js'), d = path.join(dir, 'src/data.js'); delete require.cache[require.resolve(e)]; delete require.cache[require.resolve(d)]; const P = require(e); require(d); return { P, D: window.DINO_DATA }; };
const A = load(process.argv[2]), B = load(process.argv[3]);
const run = ({ P, D }, oid, kg, anchor, surfId) => {
  const g = P.K.g, body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
  const c = { F: kg * g, mode: 'comic', body, surface: D.surfaces.find((s) => s.id === surfId), anchor, airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: false, silentStrike: false, softLanding: false };
  const p = P.RESTRAINT.plan('pull', c, { near: 5, target: 10, obj: D.objects.find((o) => o.id === oid) });
  const ce = p.ceiling(); const pr = Object.fromEntries(p.presets().map((x) => [x.id, x.never ? 'never' : Math.round(x.use / g)]));
  return { ceil: ce.by ? Math.round(ce.below / g) + ' (' + ce.by + ')' : 'none', rattle: pr.rattle, plaster: pr.plaster };
};
const objs = A.D.objects.filter((o) => !o.noPull && o.m > 0).map((o) => o.id);
const list = process.argv[4] ? process.argv[4].split(',') : ['car', 'bus', 'semi', 'locomotive', 'tank', 'ruyi', 'piano', 'bar511'];
for (const anchor of ['friction', 'bolted']) for (const surf of ['concrete', 'sand']) for (const lg of [5, 6, 8, 10]) for (const oid of list) {
  if (!A.D.objects.find((o) => o.id === oid)) continue;
  const a = run(A, oid, Math.pow(10, lg), anchor, surf), b = run(B, oid, Math.pow(10, lg), anchor, surf);
  if (JSON.stringify(a) !== JSON.stringify(b)) console.log(anchor, surf, '1e' + lg, oid, 'main', JSON.stringify(a), 'branch', JSON.stringify(b));
}
console.log('done');
