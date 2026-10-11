const F = require('./fall3d.js');
const RE=6371e3;
function settle(m, o){
  o=o||{}; const A_b=0.3, V=0.18, sig=o.sigma==null?1.7e9:o.sigma, k=o.k==null?1:o.k;
  // rest radius: scan outward
  let rStop=0; for (let r=1e-4; r<RE; r*=1.001){ if (!F.solid(r) || (m-F.rho(r)*V)*F.g(r)>sig*A_b) break; rStop=r; }
  // Gauss-Chebyshev-like: r = A sin th, use 2000 midpoints
  const NT=o.NT||1000;
  const pass=(A)=>{ const pA=F.phi(A); let T=0,dE=0; for(let i=0;i<NT;i++){ const th=-Math.PI/2+(i+0.5)*Math.PI/NT, r=Math.abs(A*Math.sin(th)), dr=A*Math.cos(th)*Math.PI/NT;
      const v2=Math.max(0,2*(pA-F.phi(r))), v=Math.sqrt(v2); if(v>0) T+=dr/v; dE+=A_b*((F.solid(r)?sig:0)+k*F.rho(r)*v2)*dr; } return {T,dE}; };
  const NA=o.NA||2000, lo=Math.max(rStop*1.0001,1e-3); let N=0, t=0, prev=null;
  for (let i=0;i<=NA;i++){ const A=lo*Math.pow(RE/lo,i/NA); const {T,dE}=pass(A); const dn=m*F.g(A)*(1-F.rho(A)*V/m)/dE; const cur={A,dn,dt:dn*T};
    if(prev){const h=A-prev.A; N+=0.5*h*(prev.dn+cur.dn); t+=0.5*h*(prev.dt+cur.dt);} prev=cur; }
  return {rStop, halfPasses:N, years:t/3.15576e7, first:pass(RE*0.99999).dE, E:m*(0-F.phi(rStop))};
}
module.exports=settle;
if (require.main===module){
  const pr=(o)=>JSON.stringify(o,(k,v)=>typeof v==='number'?Number(v.toPrecision(4)):v);
  const mNS=4.12e17*0.18;
  console.log('NS', pr(settle(mNS)));
  console.log('NS coarse', pr(settle(mNS,{NT:200,NA:600})));
  for (const [s,k] of [[1e8,1],[4.1e9,1],[1.7e9,0.5],[1.7e9,2],[1e8,0.5],[4.1e9,2],[1e8,2],[4.1e9,0.5]]) console.log('NS sigma',s,'k',k, pr(settle(mNS,{sigma:s,k})));
  for (const m of [1e13,1e18,1e20,1e10,3e10,1e11]) console.log('m',m, pr(settle(m)));
}
