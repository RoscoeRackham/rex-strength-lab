global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = 9.80665;
function ctx(st) {
  const body = P.makeBody({ H: st.H||2, m: st.m||180 });
  const surface = D.surfaces.find((s) => s.id === (st.surface||'concrete'));
  return { F: Math.pow(10, st.logKg) * g, mode: 'comic', body, surface, groundHolds: false, anchor: st.anchor };
}
const objs = D.objects.filter(o => !o.noThrow);
const anchors = process.argv[2] ? [process.argv[2]] : ['friction','bolted'];
const angStep = Number(process.argv[3]||5);
const hits = [];
let n=0;
for (const anchor of anchors) for (const o of objs) for (let ang=0; ang<=90; ang+=angStep) {
  // coarse grid to find first escape index
  let first = null;
  const at = (lk) => P.throwObject(ctx({logKg: lk, anchor}), o, ang);
  // find region where v crosses 11 km/s
  let lo=1, hi=34;
  const vAt = (lk)=>{ const r=at(lk); return r.canMove? r.v:0; };
  // bisection on v >= 11000 (assume monotone-ish)
  if (vAt(34) < 11000) continue;
  for (let i=0;i<50;i++){ const mid=(lo+hi)/2; if (vAt(mid)>=11000) hi=mid; else lo=mid; }
  const start = Math.floor(hi*100);
  for (let i=start; i<start+300 && i<=3400; i++) {
    const lk=i/100; const r=at(lk); n++;
    if (!r.canMove) continue;
    const f=r.flight;
    if (f.escaped || f.relativistic) break;
    if (f.landed && f.apex > 3.844e8) hits.push({anchor,o:o.id,ang,lk,v:Math.round(r.v),apexkm:Math.round(f.apex/1e3),days:+(f.time/86400).toFixed(1),rangekm:Math.round(f.range/1e3), hill: f.apex>1.5e9});
  }
}
console.log('evaluated',n,'hits',hits.length,'beyondHill',hits.filter(h=>h.hill).length);
console.log(JSON.stringify(hits.filter(h=>h.hill).slice(0,40)));
console.log(JSON.stringify(hits.slice(0,10)));
