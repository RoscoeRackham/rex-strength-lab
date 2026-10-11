global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const obj = (id) => D.objects.find((o) => o.id === id);
const surf = D.surfaces.find(s=>s.id==='concrete');
const defB = () => P.makeBody({H: P.DEFAULT_BODIES.rex.H, m: P.DEFAULT_BODIES.rex.m});
const defO = () => P.makeBody({H: P.DEFAULT_BODIES.ollie.H, m: P.DEFAULT_BODIES.ollie.m, build:'ollie'});
const F = 100*907.18474*g;
for (const [id, st, Dd] of [['baseball','easy',10],['baseball','hard',10],['bowling','easy',10],['car','easy',10],['baseball','easy',100]]) {
  const r = P.catchLeg({F, mode:'comic', body: defB(), surface: surf, groundHolds:false, anchor:'friction'}, {F, mode:'comic', body: defO(), surface: surf, groundHolds:false, anchor:'friction'}, obj(id), Dd, st);
  const k = r.catch; if (!k) { console.log(id, st, r.result); continue; }
  const o = obj(id), mS = o.m + k.mh, sinG = Math.sin(r.angleDeg*Math.PI/180);
  // integrate: mS dv/dt = -(F - m g sinG) (clean, his feet hold)
  const aNet = (k.F - o.m*g*sinG)/mS;
  const tPhys = k.v1 / aNet, dPhys = k.v1*k.v1/(2*aNet);
  console.log(id, st, Dd, r.result, 'angle', r.angleDeg.toFixed(1), 'F', k.F.toPrecision(4), 'v1', k.v1.toPrecision(4), 'tStroke', k.tStroke.toPrecision(4), 'tPhys(F const, gravity along stroke)', tPhys.toPrecision(4), 'over d', dPhys.toPrecision(3), 'stroke', k.stroke.toPrecision(3), 'clean', k.clean, 'slips', k.slips);
}
const g2 = P.catchGame ? 1:0;
