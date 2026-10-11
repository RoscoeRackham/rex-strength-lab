global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const surf = D.surfaces.find(s=>s.id==='concrete');
for (const [H,m] of [[2,4.986e8],[3.048,1.765e9],[3.048,7.06e9],[2,3e7],[3.048,1e8],[3.048,5e10],[2,1e12]]) {
  const b = P.makeBody({H,m});
  const t0=Date.now();
  const w = P.weight({F: 1e5*g, body:b, surface:surf, groundHolds:false});
  const sr = w.stuckRange;
  console.log(H, m, 'regime', w.ground.regime, 'stuck', w.fall && w.fall.stuck && (w.fall.stuck.r/1e3).toFixed(2)+'km', 'range', sr && (sr.rMin/1e3).toFixed(2)+'-'+(sr.rMax/1e3).toFixed(2)+'km swings '+sr.swings, 'static weak', (P.settle(b,undefined,{sigma:0.1e9}).rStop/1e3).toFixed(2), 'firstPass', !!(w.fall&&w.fall.firstPass), 'ms', Date.now()-t0);
  // independent: weak rock full run
  const f2 = P.fallThrough(b, {sigma:0.1e9, k:0.5, full:true, tMax: 4*86400});
  console.log('   weak full run: stuck', f2.stuck && (f2.stuck.r/1e3).toFixed(2), 't', f2.t.toFixed(0), 'firstPass', !!f2.firstPass);
  const f3 = P.fallThrough(b, {sigma:0.1e9, k:0.5, full:true, tMax: 40*86400});
  console.log('   weak full run 40d: stuck', f3.stuck && (f3.stuck.r/1e3).toFixed(2), 't', f3.t.toFixed(0));
}
