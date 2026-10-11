const F = require('./fall3d.js');
const RE=6371e3, Om=2*Math.PI/(23.9345*3600);
// own integrator with adaptive dt based on relative speed, regularised friction
function run(m, o){
  const s=1, A=0.3, V=0.18, sig=o.sigma==null?1.7e9:o.sigma, k=o.k==null?1:o.k, eps=o.eps||0.02;
  let y=[RE,0,0,0,Om*RE,0], t=0, vmax=0, stuck=null, lastU=0;
  const f=(y)=>{ const r=Math.hypot(y[0],y[1],y[2]), gr=F.g(r); let a=[-gr*y[0]/r,-gr*y[1]/r,-gr*y[2]/r];
    if (r<RE){ const rr=F.rho(r), b=rr*V/m*gr; a=a.map((q,i)=>q+b*y[i]/r);
      const u=[y[3]+Om*y[1], y[4]-Om*y[0], y[5]], un=Math.hypot(...u);
      const fd=k*rr*A*un/m; const fs= F.solid(r)? sig*A/m/Math.max(un,eps):0; a=a.map((q,i)=>q-(fd+fs)*u[i]); }
    return [y[3],y[4],y[5],a[0],a[1],a[2]]; };
  while (t<o.tMax){
    const un=Math.hypot(y[3]+Om*y[1], y[4]-Om*y[0], y[5]);
    const dt = un>20? 0.5 : (un>2? 0.05: 0.004);
    const k1=f(y), k2=f(y.map((q,i)=>q+dt/2*k1[i])), k3=f(y.map((q,i)=>q+dt/2*k2[i])), k4=f(y.map((q,i)=>q+dt*k3[i]));
    y=y.map((q,i)=>q+dt/6*(k1[i]+2*k2[i]+2*k3[i]+k4[i])); t+=dt;
    const r=Math.hypot(y[0],y[1],y[2]); vmax=Math.max(vmax, Math.hypot(y[3],y[4],y[5]));
    const u=Math.hypot(y[3]+Om*y[1], y[4]-Om*y[0], y[5]);
    if (F.solid(r) && u<eps && Math.abs(m-F.rho(r)*V)*F.g(r) < sig*A*0.999){ const lon=(Math.atan2(y[1],y[0])-Om*t); stuck={t, th:t/3600, rkm:r/1e3, vmax, driftKm: lon*r/1e3, E: m*(0-F.phi(r))}; break; }
  }
  return stuck || {t, rkm: Math.hypot(y[0],y[1],y[2])/1e3, vmax, notStuck:true};
}
const pr=(o)=>JSON.stringify(o,(k,v)=>typeof v==='number'?Number(v.toPrecision(5)):v);
const mWD=2.77e9*0.18;
console.log('WD', pr(run(mWD,{tMax:40000})));
console.log('5.25e7', pr(run(5.25e7,{tMax:80000})));
console.log('1e8', pr(run(1e8,{tMax:40000})));
console.log('WD sigma 0.1GPa', pr(run(mWD,{tMax:400000, sigma:1e8})));
console.log('WD sigma 4.1GPa', pr(run(mWD,{tMax:40000, sigma:4.1e9})));
console.log('1e8 sigma 4.1GPa', pr(run(1e8,{tMax:40000, sigma:4.1e9})));
console.log('1e8 sigma 0.1GPa', pr(run(1e8,{tMax:400000, sigma:1e8})));
