global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = P.K.g; const S = Object.fromEntries(D.surfaces.map(s => [s.id, s]));
const body = P.makeBody({});
for (const t of D.tiers.filter(t => ['secretwars', 'allstar'].includes(t.id))) {
  const j = P.jump({ F: t.liftKg * g, mode: 'real', body, surface: S.concrete, groundHolds: false, anchor: 'friction' });
  const f = P.fly({ v0: 29.13, thetaDeg: 90, h0: 0, m: body.m, A: body.topArea, Cd: body.Cd });
  console.log(`${t.id}: engine takeoff ${j.v.toFixed(3)} m/s apex ${(j.flight.apex * 100).toFixed(1)} cm groundFails=${j.groundFails} | correct takeoff 29.13 m/s apex ${f.apex.toFixed(1)} m`);
}
