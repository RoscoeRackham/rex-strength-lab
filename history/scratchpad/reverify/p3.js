global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const obj = (id) => D.objects.find((o) => o.id === id);
const surf = D.surfaces.find(s=>s.id==='concrete');
const defB = () => P.makeBody({H: P.DEFAULT_BODIES.rex.H, m: P.DEFAULT_BODIES.rex.m});
const defO = () => P.makeBody({H: P.DEFAULT_BODIES.ollie.H, m: P.DEFAULT_BODIES.ollie.m, build:'ollie'});
const mk = (lk, anchor, body) => ({ F: Math.pow(10, lk) * g, mode: 'comic', body, surface: surf, groundHolds: false, anchor });
for (const [id, lk, Dd, st] of [['shot',7,10,'hard'],['shot',6,10,'hard'],['shot',8,10,'hard'],['car',8,10,'hard'],['pyramid',12,1e7,'hard']]) {
  for (const bodies of ['2m','def']) {
    const bT = bodies==='2m'? P.makeBody({H:2,m:180}) : defB(), bC = bodies==='2m'? P.makeBody({H:2,m:180}) : defO();
    const r = P.catchLeg(mk(lk,'bolted',bT), mk(lk,'bolted',bC), obj(id), Dd, st);
    const k = r.catch || {};
    console.log(id, lk, Dd, st, bodies, r.result, 'launchRatio', r.launchRatio && r.launchRatio.toPrecision(3), 'wholeFront', k.wholeFront && k.wholeFront.toPrecision(3), 'F1', k.F1 && k.F1.map(x=>x.toPrecision(3)), 'area', obj(id).area, 'crush', obj(id).crush);
  }
}
// sweep: any 'caught' where first-contact force over area exceeds crush?
let n=0, bad=0, res={};
const ids = D.objects.filter(o=>!o.noThrow && o.crush).map(o=>o.id);
for (const id of ids) for (const lk of [3,4,5,6,7,8,9,10,12]) for (const Dd of [10,100,1000]) for (const st of ['easy','hard']) for (const anc of ['friction','bolted']) {
  let r; try { r = P.catchLeg(mk(lk,anc,defB()), mk(lk,anc,defO()), obj(id), Dd, st); } catch(e) { console.log('ERR', id, lk, Dd, st, e.message); continue; }
  n++; res[r.result]=(res[r.result]||0)+1;
  if (r.result==='caught') { const k=r.catch; const o=obj(id); const worst = Math.max(k.F1[0], k.F*o.m/(o.m+k.mh))/o.area/o.crush; if (worst>1) { bad++; console.log('BAD caught', id, lk, Dd, st, anc, worst); } const lr = r.launchRatio; if (lr>1) {bad++; console.log('BAD launch', id,lk,Dd,st,anc,lr);} }
}
console.log('n', n, 'bad', bad, JSON.stringify(res));
