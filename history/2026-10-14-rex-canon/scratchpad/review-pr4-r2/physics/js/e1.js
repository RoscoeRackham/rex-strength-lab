const {P,D,rex,ollie,ctx,show,fmt,DIAL}=require('./h.js');
const g=P.K.g;
const bis=(f,lo,hi)=>{for(let i=0;i<100;i++){const m=Math.sqrt(lo*hi); if(f(m)) hi=m; else lo=m;} return hi;};
// steady push: total travel = stroke + slide
const sp=(kg)=>{const r=P.standoff(ctx({body:ollie(),kg}),ctx({body:rex(),kg})); return r.drive?{d:r.drive.d,slide:r.drive.slideB,tot:r.drive.d+r.drive.slideB,v:r.drive.vB}:{d:0,slide:0,tot:0};};
console.log('steady push at 5470 kg', sp(5470));
const k1=bis(kg=>sp(kg).tot>5,2570,90718); console.log('steady push: least effort where total travel passes 5 m', fmt(k1), sp(k1));
// shoving match: each moves xA during push. compute xA = xOfT(fA,m,t)
const pm=(kg)=>{const r=P.pushMatch(ctx({body:rex(),kg}),ctx({body:ollie(),kg})); const fA=r.DB-r.HA; const xA=P.xOfT(fA,3000,r.t); return {t:r.t,xA,slide:r.slideA,tot:xA+r.slideA,v:r.vA};};
console.log('shoving match at 9060', pm(9060));
const k2=bis(kg=>pm(kg).tot>5,2570,90718); console.log('shoving: least effort where total passes 5 m', fmt(k2), pm(k2));
// collide charge for comparison: moved = during+slide
const co=(kg)=>{const r=P.collide(ctx({body:ollie(),kg}),ctx({body:rex()}),{source:'sprint'}); return r.after.splat;};
console.log('collide at 4260', co(4260));
