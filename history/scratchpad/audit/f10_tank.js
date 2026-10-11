const fs = require('fs'), vm = require('vm');
const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K, g = K.g;
const win = {}; vm.runInNewContext(fs.readFileSync('/home/user/dino-strength-sim/src/data.js','utf8'), { window: win });
const D = win.DINO_DATA;
const body = P.makeBody({}); const surf = D.surfaces.find(s=>s.id==='concrete');
const tank = D.objects.find(o=>o.id==='tank'); const t = D.tiers.find(x=>x.id==='secretwars');
for (let i=0;i<2;i++){ const r = P.throwObject({F:t.liftKg*g, mode:'comic', body, surface:surf, groundHolds:false, anchor:'friction'}, tank, 45);
console.log('v', r.v, 'range', r.flight.range, 'apex', r.flight.apex, 'steps', r.flight.steps); }
for (const v of [4800, 4850, 4860, 4862, 4863, 4864, 4870, 4900, 5000]) { const f = P.fly({v0:v, thetaDeg:45, h0:1.8, m:tank.m, A:tank.area, Cd:1}); console.log('fly v', v, 'range km', (f.range/1e3).toFixed(2), 'apex km', (f.apex/1e3).toFixed(2), 'vImp', f.vImpact.toFixed(0), 'steps', f.steps); }
