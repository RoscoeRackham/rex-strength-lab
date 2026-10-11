const P = require('/home/user/dino-strength-sim/src/engine.js');
const D = (()=>{ global.window = {}; require('/home/user/dino-strength-sim/src/data.js'); return global.window.DINO_DATA; })();
const K = P.K, g = K.g;
function sig(x, n) {
  if (x === 0) return '0';
  const d = Math.floor(Math.log10(Math.abs(x)));
  const p = Math.pow(10, n - 1 - d);
  const r = Math.round(x * p) / p;
  return r.toLocaleString('en-US', { maximumFractionDigits: Math.max(0, n - 1 - d) });
}
const surface = D.surfaces.find(s=>s.id==='concrete');
function ctx(F, mode='comic') { return { F, mode, body: P.makeBody({H:2,m:180}), surface, groundHolds:false, anchor:'friction' }; }
console.log('K.R_E', K.R_E, 'K.Hs', K.Hs, 'seismicEff', K.seismicEff, 'TNT', K.TNT_J_per_kg, 'p0', K.p0);
// 1. Infinite strength stomp
const sInf = P.stomp(ctx(Infinity));
console.log('stomp(Inf): E', sInf.E, 'quake', sInf.quake, 'sig ->', sig(sInf.quake,2), 'holeDepth', sInf.holeDepth);
for (const a of ['punch','clap','throwObject']) {}
const pInf = P.punch(ctx(Infinity)); console.log('punch(Inf) E', pInf.E, 'vFist', pInf.vFist);
const cInf = P.clap(ctx(Infinity)); console.log('clap(Inf) E', cInf.E);
console.log('blastRadius(Inf)', P.blastRadius(Infinity, 6.9e3));
// 2. Window-break radius vs antipode
const antip = Math.PI * K.R_E;
console.log('antipode km', antip/1e3);
for (const act of ['clap','stomp','punch']) {
  let lo=1, hi=34;
  const f = (lk)=>P.blastRadius(P[act](ctx(10**lk*g)).E, 6.9e3) - antip;
  for (let i=0;i<60;i++){ const m=(lo+hi)/2; if (f(m)>0) hi=m; else lo=m; }
  console.log(act, 'window radius exceeds antipode at logKg', hi.toFixed(3));
}
for (const lk of [25, 34]) for (const act of ['clap','stomp','punch']) {
  const r = P[act](ctx(10**lk*g));
  console.log('logKg', lk, act, 'E', r.E.toExponential(3), 'windows km', (P.blastRadius(r.E,6.9e3)/1e3).toExponential(4), 'lethal km', (P.blastRadius(r.E,240e3)/1e3).toExponential(4));
}
// 3. stomp energy vs binding energy
for (const lk of [20, 30, 32, 32.8, 33, 34]) {
  const r = P.stomp(ctx(10**lk*g));
  console.log('stomp logKg', lk, 'E', r.E.toExponential(3), 'E/Ebind', (r.E/2.24e32).toExponential(3), 'quake', r.quake.toFixed(3), 'holeDepth km', (r.holeDepth/1e3).toExponential(3), 'vFoot/c', (r.vFoot/K.c).toFixed(6));
}
// where E crosses binding energy
{ let lo=20, hi=34; for (let i=0;i<60;i++){ const m=(lo+hi)/2; if (P.stomp(ctx(10**m*g)).E > 2.24e32) hi=m; else lo=m; } console.log('stomp E > Ebind at logKg', hi.toFixed(3)); }
// hole depth exceeding Earth diameter
{ let lo=1, hi=34; for (let i=0;i<60;i++){ const m=(lo+hi)/2; if (P.stomp(ctx(10**m*g)).holeDepth > 2*K.R_E) hi=m; else lo=m; } console.log('holeDepth > 2R_E at logKg', hi.toFixed(3)); }
