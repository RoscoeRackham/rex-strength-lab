const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = global; require('/home/user/dino-strength-sim/src/data.js'); const data = global.DINO_DATA;
const K = P.K, g = K.g, c = K.c;
function keP(p, m) { const mc2 = m*c*c, pc = p*c; return pc*pc/(Math.hypot(mc2, pc)+mc2); }
const stats = { total:0, nan:0, inf:0, err1:0, err10:0, vGtC:0 }; const ex = {};
let firstInf = {};
for (const o of data.objects.filter(o=>!o.noThrow)) for (const H of [0.5,2,10,50,200,500]) for (const sid of ['sand','concrete','granite']) for (const anchor of ['friction','braced','bolted']) for (const th of [0,30,45,60,90]) for (let lg = 1; lg <= 34.0001; lg += 0.25) {
  const body = P.makeBody({ H });
  const surface = data.surfaces.find(s=>s.id===sid);
  const ctx = { F: Math.pow(10, lg)*g, mode: 'comic', body, surface, groundHolds: false, anchor };
  const r = P.throwObject(ctx, o, th);
  if (!r.canMove) continue;
  stats.total++;
  const mB = o.m + r.hands * (r.style === 'whip' ? body.whipEff : body.handEff);
  const Et = keP(r.push.pB * o.m / mB, o.m);
  if (r.v > c) { stats.vGtC++; ex.vGtC = ex.vGtC || {o:o.id,H,sid,anchor,th,lg, v:r.v, Eobj:r.Eobj}; }
  if (Number.isNaN(r.Eobj)) { stats.nan++; ex.nan = ex.nan || {o:o.id,H,sid,anchor,th,lg, v:r.v, Et}; }
  else if (!isFinite(r.Eobj)) { stats.inf++; const k=o.id+'/H'+H; if (!(k in firstInf) || lg < firstInf[k]) firstInf[k]=lg; }
  else { const e = Math.abs(r.Eobj-Et)/Et; if (e>0.01) { stats.err1++; ex.err1 = ex.err1 || {o:o.id,H,sid,anchor,th,lg,Eobj:r.Eobj,Et}; } if (e>0.1) { stats.err10++; if (!ex.err10 || e > ex.err10.e) ex.err10 = {o:o.id,H,sid,anchor,th,lg,Eobj:r.Eobj,Et,e}; } }
}
console.log(stats); console.log(ex); console.log('lowest lgKg giving Infinity per object/size:', firstInf);
// also infinite-strength toggle (F=Infinity): Eobj
const body = P.makeBody({}); const surface = data.surfaces.find(s=>s.id==='concrete');
const r = P.throwObject({ F: Infinity, mode:'comic', body, surface, groundHolds:false, anchor:'friction' }, data.objects[0], 0);
console.log('F=Inf: v', r.v, 'Eobj', r.Eobj);
// UI behaviour: what the relativistic item shows for the inf case
