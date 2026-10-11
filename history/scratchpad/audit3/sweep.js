global.window = {};
const eng = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const P = window.REX_ENGINE || eng || Object.values(window).find(v => v && v.jump);
const D = window.DINO_DATA;
const g = 9.80665;
for (const surf of ['concrete', ...D.surfaces.map(s=>s.id).filter(x=>x!=='concrete')]) for (const mode of ['comic','real']) {
  let prev = null;
  for (let L = 25; L <= 40.001; L += 0.05) {
    const c = { F: Math.pow(10, L) * g, mode, body: P.makeBody({H:2,m:180}), surface: D.surfaces.find(s=>s.id===surf), groundHolds:false, anchor:'friction' };
    const r = P.jump(c), s = P.stomp(c);
    const key = [r.groundDisrupts, r.relativistic, s.disrupts, r.groundFails].join();
    if (key !== prev) { console.log(surf, mode, L.toFixed(2), 'jumpDisrupt', r.groundDisrupts, 'rel', r.relativistic, 'v/c', (r.v/2.998e8).toPrecision(3), 'Eg', r.Eground.toExponential(2), 'stompDisrupt', s.disrupts, 'Es', s.E.toExponential(2), 'sink', r.sink, 'fails', r.groundFails, 'esc', r.flight.escaped); prev = key; }
  }
  const c = { F: Infinity, mode, body: P.makeBody({H:2,m:180}), surface: D.surfaces.find(s=>s.id===surf), groundHolds:false, anchor:'friction' };
  const r = P.jump(c); console.log(surf, mode, 'INF', r.groundDisrupts, r.relativistic, r.Eground, r.sink, r.groundFails);
}
