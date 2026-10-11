const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const objById = (id) => D.objects.find((o) => o.id === id);
const body = P.makeBody({});
const ctx = (mode) => ({ F: 511 * g, mode, body, surface: D.surfaces.find(s=>s.id==='concrete'), groundHolds: false, anchor: 'friction' });
// release speed needed for 23.56 m at 37 deg from the dino's 1.8 m release height (with the engine's drag model)
function vFor(range){ let lo=5,hi=30; for(let i=0;i<60;i++){const m=(lo+hi)/2; const f=P.fly({v0:m,thetaDeg:37,h0:body.releaseHeight,m:7.26,A:0.0113,Cd:0.47}); if(f.range<range) lo=m; else hi=m;} return (lo+hi)/2; }
console.log('v needed for 23.56 m from h0=1.8 m @37deg:', vFor(23.56).toFixed(2));
function tune(key, objId, ang, metric, target){
  const orig = P.MUSCLE[key].forceFrac;
  let lo=0.05, hi=5;
  for(let i=0;i<50;i++){ const m=Math.sqrt(lo*hi); P.MUSCLE[key].forceFrac=m; const r=P.throwObject(ctx('real'), objById(objId), ang); const val = metric==='range'? r.flight.range : r.v; if(val<target) lo=m; else hi=m; }
  const res=Math.sqrt(lo*hi); P.MUSCLE[key].forceFrac=orig; return res;
}
console.log('throwPush forceFrac for 23.56 m (vmax 55):', tune('throwPush','shot',37,'range',23.56).toFixed(3));
console.log('throwWhip forceFrac for 47.3 m/s (vmax 55):', tune('throwWhip','baseball',0,'speed',47.3).toFixed(3));
