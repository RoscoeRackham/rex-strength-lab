const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const objById = (id) => D.objects.find((o) => o.id === id);
function ctx(kg, mode, surfId, anchor, H, m) {
  const body = P.makeBody({ H: H || 2, m: m || 180 });
  const surface = D.surfaces.find((s) => s.id === (surfId || 'concrete'));
  return { F: kg * g, mode, body, surface, groundHolds: false, anchor: anchor || 'friction' };
}
console.log('comicFrac:', Object.fromEntries(Object.entries(P.MUSCLE).filter(([k,v])=>v&&v.comicFrac).map(([k,v])=>[k,v.comicFrac.toFixed(4)])));
for (const surf of ['concrete','granite','sand','clay','asphalt']) {
  for (const anchor of ['friction','braced','bolted']) {
    const row = [];
    for (const mode of ['comic','real']) {
      const s = P.throwObject(ctx(511, mode, surf, anchor), objById('shot'), 37);
      const b = P.throwObject(ctx(511, mode, surf, anchor), objById('baseball'), 0);
      row.push(`${mode}: shot ${s.v.toFixed(2)} m/s ${s.flight.range.toFixed(2)} m, pitch ${b.v.toFixed(2)}`);
    }
    console.log(surf.padEnd(9), anchor.padEnd(9), row.join(' | '));
  }
}
console.log('--- sweep over strength (concrete, friction)');
for (const kg of [50,100,200,300,400,511,600,1000,5000,1e5]) {
  const r=[];
  for (const mode of ['comic','real']) {
    const s = P.throwObject(ctx(kg, mode), objById('shot'), 37);
    const b = P.throwObject(ctx(kg, mode), objById('baseball'), 0);
    const p = P.punch(ctx(kg, mode)); const j = P.jump(ctx(kg, mode));
    r.push(`${mode} shot ${s.v.toFixed(2)} pitch ${b.v.toFixed(2)} punch ${p.vFist.toFixed(2)} jump ${j.v.toFixed(2)}`);
  }
  console.log(String(kg).padStart(6), r.join(' | '));
}
