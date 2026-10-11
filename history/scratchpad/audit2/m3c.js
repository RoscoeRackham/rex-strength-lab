global.window = {};
const A = require('./alt/engine.js'); const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const S = Object.fromEntries(D.surfaces.map(s => [s.id, s]));
const mk=(Q,lg,sid)=>({F:10**lg*Q.K.g,mode:'comic',body:Q.makeBody({H:2}),surface:S[sid],groundHolds:false,anchor:'friction'});
let prevV=0, mono=true;
for (const lg of [12,14,14.5,15,16,17,18,20,25,30,34]) {
  const a=A.jump(mk(A,lg,'concrete')), p=P.jump(mk(P,lg,'concrete'));
  console.log(lg,'cur vB',p.push.vB.toExponential(3),'Eg',p.Eground.toExponential(3),'v',p.v.toExponential(4),'| alt vB',a.push.vB.toExponential(3),'Eg',a.Eground.toExponential(3),'v',a.v.toExponential(4));
}
for (const sid of Object.keys(S)) { let pv=0, bad=[]; for (let lg=1; lg<=34; lg+=0.01){ const v=A.jump(mk(A,lg,sid)).v; if (v < pv*(1-1e-9)) bad.push(lg.toFixed(2)); pv=v; } console.log(sid,'alt non-monotone at',bad.slice(0,5).join(','), bad.length); }
for (const sid of Object.keys(S)) { let pv=0, bad=[]; for (let lg=1; lg<=34; lg+=0.01){ const v=P.jump(mk(P,lg,sid)).v; if (v < pv*(1-1e-9)) bad.push(lg.toFixed(2)); pv=v; } console.log(sid,'cur non-monotone at',bad.slice(0,5).join(','), bad.length); }
