global.window = {};
const A = require('/home/user/dino-strength-sim/src/engine.js');
const B = require('./engine_fix.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = A.K.g;
const body = A.makeBody({});
const surface = D.surfaces.find((s) => s.id === 'concrete');
for (const oid of ['piano', 'baseball']) for (const lg of [5, 7, 9, 12, Infinity]) {
  const F = lg === Infinity ? Infinity : Math.pow(10, lg) * g;
  const c = { F, mode: 'real', body, surface, groundHolds: false, anchor: 'friction' };
  const o = D.objects.find((x) => x.id === oid);
  const a = A.throwObject(c, o, 60), b = B.throwObject(c, o, 60);
  console.log(oid, lg, 'v', a.v.toPrecision(5), 'R', a.anchor.R.toPrecision(4), 'held', a.heldBack, 'sink cur', a.sinkRatio.toPrecision(3), 'fix', b.sinkRatio.toPrecision(3), 'meanF', (a.push.work/(a.push.xA+a.push.xB)).toPrecision(4), 'recoil', a.recoilV.toPrecision(3), 'xA', a.push.xA.toPrecision(3));
}
