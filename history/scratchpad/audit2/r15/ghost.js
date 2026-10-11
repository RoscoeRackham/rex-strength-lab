global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = 9.80665;
let t0=Date.now();
let f = P.fly({ v0: 11186, thetaDeg: 89, Cd: 0, m: 1, A: 1 });
console.log('ghost 11186@89', JSON.stringify({landed:f.landed, esc:f.escaped, to:f.timedOut, apexkm:f.apex/1e3, years:f.time/86400/365.25, rangekm:f.range/1e3}), Date.now()-t0,'ms');
t0=Date.now();
f = P.fly({ v0: 11186, thetaDeg: 89, Cd: 0, m: 1, A: 1, record: true });
console.log('with record', f.path && f.path.length, Date.now()-t0,'ms');
function ctx(st) {
  const body = P.makeBody({ H: 2, m: 180 });
  const surface = D.surfaces.find((s) => s.id === 'concrete');
  return { F: Math.pow(10, st.logKg) * g, mode: 'comic', body, surface, groundHolds: false, anchor: st.anchor };
}
// find a slider-grid state with vac ghost beyond Hill radius and drag flight landed
const objs = D.objects.filter(o => !o.noThrow);
const hits=[];
for (const anchor of ['friction','bolted']) for (const o of objs) for (const ang of [30,45,60]) {
  const at = (lk) => P.throwObject(ctx({logKg: lk, anchor}), o, ang);
  const vAt = (lk)=>{ const r=at(lk); return r.canMove? r.v:0; };
  if (vAt(34) < 11100) continue;
  let lo=1, hi=34;
  for (let i=0;i<50;i++){ const mid=(lo+hi)/2; if (vAt(mid)>=11150) hi=mid; else lo=mid; }
  for (let i=Math.floor(hi*100)-1; i<=Math.floor(hi*100)+3; i++) {
    const lk=i/100; const r=at(lk); if(!r.canMove) continue;
    const body = P.makeBody({H:2,m:180});
    const vac = P.fly({ v0: r.v, thetaDeg: ang, h0: body.releaseHeight, m: o.m, A: o.area, Cd: 0 });
    if (vac.landed && vac.apex > 1.5e9 && r.flight.landed) hits.push({anchor,o:o.id,ang,lk,v:r.v.toFixed(1),vacApexKm:Math.round(vac.apex/1e3),vacYears:+(vac.time/86400/365.25).toFixed(2),vacRangeKm:Math.round(vac.range/1e3),fRangeKm:Math.round(r.flight.range/1e3), ratio:+(r.flight.range/vac.range).toFixed(3)});
  }
}
console.log(hits.length); console.log(JSON.stringify(hits.slice(0,15),null,0));
