global.window = global.window || {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const S = (id) => D.surfaces.find((s) => s.id === id);
for (const m of [17860, 12000, 30000]) for (const sid of ['sand','softclay','stiffclay']) { const g=P.groundUnderWeight(P.makeBody({H:2,m}), S(sid), false); console.log(m, sid, g.regime, g.stage, g.sink && g.sink.toFixed(2)); }
// Bondi eigenvalue
const lam=(gm)=>Math.pow(0.5,(gm+1)/(2*(gm-1)))*Math.pow((5-3*gm)/4,-(5-3*gm)/(2*(gm-1)));
console.log('lambda(1.4)',lam(1.4),'lambda(1.0001)',lam(1.0001),'lambda(1.6666)',lam(1.6666),'ratio to 2pi',4*Math.PI*lam(1.4)/(2*Math.PI));
// WD-matter degeneracy pressure and kinetic energy estimate (Chandrasekhar EOS, Ye=0.5)
const hbar=1.054571817e-34, me=9.1093837e-31, c=299792458, mu=1.66053907e-27;
const rho=2.77e9, ne=rho*0.5/mu, pF=hbar*Math.cbrt(3*Math.PI*Math.PI*ne), x=pF/(me*c);
const A=Math.PI*me**4*c**5/(3*(2*Math.PI*hbar)**3);
const Pdeg=A*(x*(2*x*x-3)*Math.sqrt(1+x*x)+3*Math.asinh(x));
const eps=A*(8*x**3*(Math.sqrt(1+x*x)-1)-(x*(2*x*x-3)*Math.sqrt(1+x*x)+3*Math.asinh(x))); // kinetic energy density, Chandrasekhar
console.log('WD x',x.toFixed(3),'P',Pdeg.toExponential(3),'Ekin J/m3',eps.toExponential(3),'J/kg',(eps/rho).toExponential(3),'kt TNT/kg',(eps/rho/4.184e12).toFixed(2),'for WD Rex J',(eps/rho*rho*0.18).toExponential(3));
