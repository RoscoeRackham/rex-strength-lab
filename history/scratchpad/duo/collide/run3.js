global.window = {}; const P = require('/home/user/dino-strength-sim/src/engine.js');
const C = require('./collide.js'); const K=P.K, c=K.c;
// conservation checks
for (const [mA,mT,gb] of [[180,360,0.5/Math.sqrt(0.75)],[180,360,2.065],[180,180,1e3],[180,7.416e16,1e-5],[180,180,1e-7]]) {
  const p=gb*mA*c, h=C.hit(p,mA,mT);
  const E0=Math.hypot(mA*c*c,p*c)+mT*c*c;
  const E1=Math.hypot(mA*c*c,h.el.pA*c)+Math.hypot(mT*c*c,h.el.pT*c);
  const Ms=h.Mstar; const Qdirect=(Ms-mA-mT)*c*c;
  console.log({mA,mT,gb, dp_rel:(h.el.pA+h.el.pT-p)/p, dE_rel:(E1-E0)/E0, Q:h.Q, Qdirect, vA:h.el.vA/c, vT:h.el.vT/c, V:h.inel.V/c});
}
// ultra-relativistic limit
for (const gb of [1e2,1e4,1e6]) { const h=C.hit(gb*180*c,180,360); console.log('gb',gb,'vA/c',h.el.vA/c,'(limit -0.6)'); }
const hi=C.hit(Infinity,180,360); console.log('p=inf vA/c', hi.el.vA/c, 'KA', hi.el.KA, 'expected KE', 180*c*c*(1/Math.sqrt(1-0.36)-1));
// Earth numbers for T2
const dv=8368.48/(180+K.M_E); const t1mm=1e-3/dv; console.log('dv',dv,'t1mm s',t1mm,'yr',t1mm/3.15576e7,'x age',t1mm/3.15576e7/13.787e9);
// T7 day change and quake
const p9=180*c*0.9/Math.sqrt(1-0.81); console.log('p 0.9c',p9,'dv',p9/(180+K.M_E));
const I=0.3308*K.M_E*K.R_E**2; console.log('I_E',I, 'dT', (23.9345*3600)**2*p9*K.R_E/(2*Math.PI*I));
console.log('KE 0.9c', 180*c*c*(1/Math.sqrt(0.19)-1), 'Gt', 180*c*c*(1/Math.sqrt(0.19)-1)/4.184e18);
console.log('blast default Q', P.blastRadius(97451.4,6900), P.blastRadius(97451.4,34500), 'T7', P.blastRadius(2.09364e19,6900)/1000,'km', P.blastRadius(2.09364e19,427000)/1000);
console.log('T12 blast', P.blastRadius(5.05634e23, 6900)/1000, 'quake if all into ground', P.seismicMagnitude(5.05634e23));
console.log('eqR', P.eqRadius(P.makeBody({})), 'NS m', 4.12e17*0.18, 'isBH NS', P.isBlackHole(P.makeBody({m:4.12e17*0.18})));
