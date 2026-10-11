global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = 9.80665;
console.log('g const', P.K.g);
for (const k of ['throwPush','throwWhip','punch','clap','jump','stomp']) console.log(k, 'forceFrac', P.MUSCLE[k].forceFrac, 'comicFrac', P.MUSCLE[k].comicFrac);
const objs = D.objects || D.objs;
const ob = (id) => (objs.find(o => o.id === id));
const body = P.makeBody({});
const surf = (D.surfaces||[]).find(s => s.id === 'concrete');
function run(kg, mode, id, ang, extra) {
  const c = Object.assign({ F: kg * P.K.g, mode, body, surface: surf, groundHolds: false, anchor: 'friction' }, extra||{});
  const r = P.throwObject(c, ob(id), ang);
  return { canHold: r.canHold, canMove: r.canMove, Fdrive: r.Fdrive, F: r.F, needed: r.needed, W: ob(id).m*P.K.g, range: r.flight && r.flight.range, v: r.v };
}
for (const [kg, id] of [[90718.474,'tank'],[9071.8474,'ruyi']]) {
  for (const mode of ['comic','real']) for (const ang of [0, 30, 40, 45, 60]) {
    console.log(id, mode, ang, JSON.stringify(run(kg, mode, id, ang)));
  }
}
