global.window = {};
const B = require('./engine_fix.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = B.K.g;
const body = B.makeBody({});
for (const [sid, oid, ang, lg, mode] of [['concrete','baseball',30,6,'real'],['concrete','baseball',30,Infinity,'real'],['concrete','baseball',2,Infinity,'real'],['concrete','baseball',45,5.2,'real'],['sand','car',30,6,'real'],['sand','car',45,9,'real'],['concrete','car',45,9,'real'],['concrete','baseball',30,6,'comic']]) {
  const surface = D.surfaces.find((s) => s.id === sid), o = D.objects.find((x) => x.id === oid);
  const F = lg === Infinity ? Infinity : Math.pow(10, lg) * g;
  const r = B.throwObject({ F, mode, body, surface, groundHolds: false, anchor: 'friction' }, o, ang);
  console.log(sid, oid, ang, lg, mode, 'v', r.v.toPrecision(4), 'sink(fixed)', r.sinkRatio.toPrecision(3));
}
