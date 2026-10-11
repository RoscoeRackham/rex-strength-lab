// Order-of-magnitude: gravitational (Bondi-Hoyle-Lyttleton / dynamical-friction) drag on a dense Rex moving through rock,
// compared with the design's drag terms (k rho v^2 A_b and sigma A_b). F_g = 4 pi G^2 m^2 rho lnL / (v^2 + cs^2).
const F = require('./fall3d.js');
const G=6.6743e-11, RE=6371e3;
function settle(m, o){
  const A_b=0.3, V=0.18, sig=1.7e9, k=1, lnL=o.lnL, cs=o.cs||8000;
  let rStop=0; for (let r=1e-4; r<RE; r*=1.001){ if (!F.solid(r) || (m-F.rho(r)*V)*F.g(r)>sig*A_b) break; rStop=r; }
  const NT=600;
  const pass=(A)=>{ const pA=F.phi(A); let T=0,dE=0,dEg=0; for(let i=0;i<NT;i++){ const th=-Math.PI/2+(i+0.5)*Math.PI/NT, r=Math.abs(A*Math.sin(th)), dr=A*Math.cos(th)*Math.PI/NT;
      const v2=Math.max(0,2*(pA-F.phi(r))), v=Math.sqrt(v2); if(v>0) T+=dr/v; const rr=F.rho(r);
      dE+=A_b*((F.solid(r)?sig:0)+k*rr*v2)*dr; dEg+= 4*Math.PI*G*G*m*m*rr*lnL/(v2+cs*cs)*dr; } return {T,dE,dEg}; };
  const NA=800, lo=Math.max(rStop*1.0001,1e-3); let N=0, t=0, prev=null, N0=0,t0=0,prev0=null;
  for (let i=0;i<=NA;i++){ const A=lo*Math.pow(RE/lo,i/NA); const p=pass(A); const w=m*F.g(A);
    const dn=w/(p.dE+p.dEg), dn0=w/p.dE; const cur={A,dn,dt:dn*p.T}, cur0={A,dn:dn0,dt:dn0*p.T};
    if(prev){const h=A-prev.A; N+=0.5*h*(prev.dn+cur.dn); t+=0.5*h*(prev.dt+cur.dt); N0+=0.5*h*(prev0.dn+cur0.dn); t0+=0.5*h*(prev0.dt+cur0.dt);} prev=cur; prev0=cur0; }
  const f=pass(RE*0.99999);
  return {m, lnL, first_design:f.dE, first_grav:f.dEg, ratio:f.dEg/f.dE, shortDesign_m:f.dE/(m*9.82), shortWithGrav_m:(f.dE+f.dEg)/(m*9.82), years_design:t0/3.15576e7, years_withGrav:t/3.15576e7};
}
const pr=(o)=>JSON.stringify(o,(k,v)=>typeof v==='number'?Number(v.toPrecision(3)):v);
for (const m of [7.416e16, 1e18, 1e20]) for (const lnL of [1,10]) console.log(pr(settle(m,{lnL})));
// BHL radius at 10 km/s vs R
for (const m of [7.416e16,1e18,1e20]) console.log('m',m,'r_BHL(10km/s)',(2*G*m/1e8).toPrecision(3),'R',0.350);
