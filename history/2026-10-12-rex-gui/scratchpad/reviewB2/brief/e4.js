global.window = {}; const P = require('./repo/rex-strength-lab/src/engine.js'); require('./repo/rex-strength-lab/src/data.js'); const D = window.DINO_DATA; const g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }); const obj = (id) => D.objects.find((o) => o.id === id);
const M = P.RESTRAINT.MOVES;
for (const [oid, lk, ang] of [['car', 11, 45], ['car', 9, 30], ['baseball', 7, 30], ['shot', 8, 20], ['car', 7, 45], ['baseball', 5, 45], ['piano', 8, 45]]) {
  const row = [];
  for (const s of [0, 0.25, 0.5, 0.75, 0.9, 1]) {
    const c = { F: Math.pow(10, lk) * g, mode: 'comic', body: rex, surface: D.surfaces.find((x) => x.id === 'concrete'), anchor: 'bolted', airAbsorb: s };
    const r = P.throwObject(c, obj(oid), ang);
    const f = r.flight;
    row.push((s*100)+'%: airE ' + (f.air ? f.air.E.toPrecision(3) : (f.dragLoss||r.dragLoss||0).toPrecision(3)) + ' dragLoss ' + (r.dragLoss != null ? r.dragLoss.toPrecision(3) : '-') + ' blast ' + M.throw.blastParts(r, { airAbsorb: s, obj: obj(oid), angle: ang, body: rex }).path.toPrecision(3) + ' range ' + (f.landed ? f.range.toPrecision(3) : 'away'));
  }
  console.log(oid, lk, ang, '\n  ' + row.join('\n  '));
}
