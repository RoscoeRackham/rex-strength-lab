// Gravitational drag (Ostriker 1999 gaseous-medium form) as an order-of-magnitude check:
// F = 4 pi G^2 m^2 rho I(M) / v^2; M = v/cs; I = 0.5 ln((1+M)/(1-M)) - M (M<1), 0.5 ln(1-1/M^2) + lnL (M>1)
const F = require('./fall3d.js');
const G=6.6743e-11, RE=6371e3;
function Iof(M,lnL){ if (M<0.999) return 0.5*Math.log((1+M)/(1-M))-M; if (M>1.001) return Math.max(0,0.5*Math.log(1-1/(M*M))+lnL); return lnL; }
function settle(m, o){
  const A_b=0.3, V=0.18, sig=1.7e9, k=1, lnL=o.lnL, cs=o.cs;
  let rStop=0; for (let r=1e-4; r<RE; r*=1.001){ if (!F.solid(r) || (m-F.rho(r)*V)*F.g(r)>sig*A_b) break; rStop=r; }
  const NT=800;
  const pass=(A)=>{ const pA=F.phi(A); let T=0,dE=0,dEg=0; for(let i=0;i<NT;i++){ const th=-Math.PI/2+(i+0.5)*Math.PI/NT, r=Math.abs(A*Math.sin(th)), dr=A*Math.cos(th)*Math.PI/NT;
      const v2=Math.max(0,2*(pA-F.phi(r))), v=Math.sqrt(v2); if(v>0) T+=dr/v; const rr=F.rho(r);
      dE+=A_b*((F.solid(r)?sig:0)+k*rr*v2)*dr; if (v>0) dEg+= 4*Math.PI*G*G*m*m*rr*Iof(v/cs,lnL)/v2*dr; } return {T,dE,dEg}; };
  const NA=800, lo=Math.max(rStop*1.0001,1e-3); let N=0, t=0, prev=null, t0=0, prev0=null;
  for (let i=0;i<=NA;i++){ const A=lo*Math.pow(RE/lo,i/NA); const p=pass(A); const w=m*F.g(A);
    const dn=w/(p.dE+p.dEg), dn0=w/p.dE; const cur={A,dt:dn*p.T}, cur0={A,dt:dn0*p.T};
    if(prev){const h=A-prev.A; t+=0.5*h*(prev.dt+cur.dt); t0+=0.5*h*(prev0.dt+cur0.dt);} prev=cur; prev0=cur0; }
  const f=pass(RE*0.99999);
  return {m, lnL, cs, ratioFirst:f.dEg/f.dE, short_design_m:f.dE/(m*9.82), short_withGrav_m:(f.dE+f.dEg)/(m*9.82), yrs_design:t0/3.15576e7, yrs_withGrav:t/3.15576e7};
}
const pr=(o)=>JSON.stringify(o,(k,v)=>typeof v==='number'?Number(v.toPrecision(3)):v);
for (const m of [7.416e16, 1e18, 1e20]) for (const [lnL,cs] of [[3,8000],[10,8000],[10,5000],[3,11000]]) console.log(pr(settle(m,{lnL,cs})));
