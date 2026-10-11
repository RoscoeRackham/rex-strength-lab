global.window = global.window || {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA; const K=P.K;
const S = (id) => D.surfaces.find((s) => s.id === id);
for (const m of [5.201e7, 5.205e7, 5.21e7, 5.215e7]) { const b=P.makeBody({H:2,m}); const w=P.weight({F:K.g*1e3, mode:'real', body:b, surface:S('granite'), groundHolds:false, anchor:'friction'}); console.log(m, w.ground.regime, JSON.stringify(w.fall && w.fall.stuck), w.energyJ); }
for (const m of [5.201e7, 5.21e7]) { const b=P.makeBody({H:2,m}); const w=P.weight({F:K.g*1e3, mode:'real', body:b, surface:S('granite'), groundHolds:false, anchor:'friction'}); const f=w.fall; console.log(m, f.t, f.steps, f.stillSinking, f.rEnd, JSON.stringify(f.firstPass), JSON.stringify(w.settle)); }
