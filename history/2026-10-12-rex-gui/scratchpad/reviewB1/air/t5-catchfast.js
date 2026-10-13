const {P,D,obj,rex,surf}=require('./env.js');
const K=P.K;
const o=obj('baseball');
const mk=(share,keep,body)=>({F:1.81436948e23*K.g,mode:'comic',body:body||rex(),surface:surf('concrete'),anchor:'friction',airAbsorb:share,keepForm:keep,unbreakable:true,ownRecoil:true});
const ollie=P.makeBody({build:'ollie',H:3.048,m:3007});
console.log('releaseHeight rex', rex().releaseHeight, 'ollie', ollie.releaseHeight);
for (const D of [100, 5000, 20000, 1e5, 1e6, 2e7]) for (const share of [1, 0.5, 0]) {
  const L=P.catchLeg(mk(share,true), mk(share,true,ollie), o, D, 'hard');
  const fb=L.fireball;
  console.log('D',D,'share',share,'result',L.result,'fast',!!L.fast,'aim',JSON.stringify(L.aim||{thetaDeg:L.thetaDeg}),'time',L.time,'vArrive/c',L.vArrive/K.c, fb? 'fireball kind '+fb.kind+' Egap/E '+(fb.Egap/fb.E).toFixed(4)+' sweep '+fb.sweep.toExponential(2):'');
}
// geometry: straight chord between hands at height h over sphere separated by surface distance D
const h=rex().releaseHeight;
for (const D of [1e3, 5e3, 1e4, 2e4, 1e5, 1e6]) { const sag = (K.R_E+h)*(1-Math.cos(D/(2*K.R_E))); console.log('D',D,'chord midpoint height above ground', (h - sag).toFixed(2),'m'); }
