// Independent 3-D fall-through integrator (own PREM table, regularised friction, fixed-step RK4 with step refinement).
const T = require('./prem_tab.json');
const RE = 6371e3, GMeng = 3.986004418e14, Om = 2*Math.PI/(23.9345*3600);
const L = [[1221.5,[13.0885,0,-8.8381,0],1],[3480,[12.5815,-1.2638,-3.6426,-5.5281],0],[5701,[7.9565,-6.4761,5.5283,-3.0807],1],
 [5771,[5.3197,-1.4836,0,0],1],[5971,[11.2494,-8.0298,0,0],1],[6151,[7.1089,-3.8045,0,0],1],[6346.6,[2.6910,0.6924,0,0],1],[6356,[2.9,0,0,0],1],[6371,[2.6,0,0,0],1]];
function lay(r){const km=r/1000; for (let i=0;i<L.length;i++) if (km<=L[i][0]) return i; return -1;}
function rho(r){const i=lay(r); if(i<0) return 0; const a=L[i][1],x=r/RE; return 1000*(a[0]+x*(a[1]+x*(a[2]+x*a[3])));}
function solid(r){const i=lay(r); return i>=0 && L[i][2]===1;}
const dR = 100;
function g(r){ if (r>=RE) return GMeng/(r*r); const f=r/dR, i=Math.floor(f), t=f-i; return T.g[i]*(1-t)+T.g[Math.min(i+1,T.g.length-1)]*t; }
function phi(r){ if (r>=RE) return GMeng/RE-GMeng/r; const f=r/dR, i=Math.floor(f), t=f-i; return T.Phi[i]*(1-t)+T.Phi[Math.min(i+1,T.Phi.length-1)]*t; }
function run(m, opt){
  const H=opt.H||2, s=H/2, A=0.3*s*s, V=0.18*s*s*s, sig=opt.sigma==null?1.7e9:opt.sigma, k=opt.k==null?1:opt.k, eps=opt.eps||1e-3;
  const lat=(opt.lat||0)*Math.PI/180;
  let y=[RE*Math.cos(lat),0,RE*Math.sin(lat),0,Om*RE*Math.cos(lat),0], t=0;
  const f=(y)=>{ const r=Math.hypot(y[0],y[1],y[2]), gr=g(r); let a=[-gr*y[0]/r,-gr*y[1]/r,-gr*y[2]/r];
    if (r<RE && !opt.noDrag){ const rr=rho(r), b=rr*V/m*gr; a=a.map((q,i)=>q+b*y[i]/r);
      const u=[y[3]+Om*y[1], y[4]-Om*y[0], y[5]], un=Math.hypot(...u);
      const fd=k*rr*A*un/m; const fs= solid(r)? sig*A/m/Math.max(un,eps):0;
      a=a.map((q,i)=>q-(fd+fs)*u[i]); }
    return [y[3],y[4],y[5],a[0],a[1],a[2]]; };
  let prevVr=-1, inner=false, first=null, minR=RE, vmax=0, stuck=null;
  const dt0=opt.dt||0.25;
  while (t<(opt.tMax||3*3600)){
    const r=Math.hypot(y[0],y[1],y[2]); const dt = (RE-r<5e3)? Math.min(dt0,0.05): dt0;
    const k1=f(y), k2=f(y.map((q,i)=>q+dt/2*k1[i])), k3=f(y.map((q,i)=>q+dt/2*k2[i])), k4=f(y.map((q,i)=>q+dt*k3[i]));
    const yn=y.map((q,i)=>q+dt/6*(k1[i]+2*k2[i]+2*k3[i]+k4[i])); t+=dt;
    const rn=Math.hypot(yn[0],yn[1],yn[2]); minR=Math.min(minR,rn); vmax=Math.max(vmax,Math.hypot(yn[3],yn[4],yn[5]));
    const vr=(yn[0]*yn[3]+yn[1]*yn[4]+yn[2]*yn[5])/rn;
    if (!inner && prevVr<0 && vr>=0 && t>10) inner=true;
    if (inner && !first && prevVr>0 && vr<=0){ const lon=(Math.atan2(yn[1],yn[0])-Om*t)*180/Math.PI; const dLon=((lon-180)%360+540)%360-180;
      first={t, rTop:rn, depthShort:RE-rn, dLon, westKm:-dLon*Math.PI/180*RE/1000, lat:Math.asin(yn[2]/rn)*180/Math.PI, minR, vmax};
      if (!opt.full) {y=yn;break;} }
    // stuck test (regularised friction): relative speed tiny and net load below strength
    if (solid(rn) && opt.stick){ const u=Math.hypot(yn[3]+Om*yn[1], yn[4]-Om*yn[0], yn[5]); if (u<opt.stick && Math.abs(m-rho(rn)*V)*g(rn)<=sig*A){ stuck={t,r:rn,vmax}; y=yn; break; } }
    prevVr=vr; y=yn;
  }
  return {first, stuck, minR, vmax, t, r:Math.hypot(y[0],y[1],y[2]), y};
}
module.exports={run, g, phi, rho, solid};
if (require.main===module){
  const mNS=4.12e17*0.18, mWD=2.77e9*0.18;
  const pr=(o)=>JSON.stringify(o,(k,v)=>typeof v==='number'?Number(v.toPrecision(5)):v);
  console.log('NS nodrag pole', pr(run(mNS,{lat:90,noDrag:true,dt:0.1}).first));
  for (const dt of [0.5,0.25,0.1]) console.log('NS eq dt',dt, pr(run(mNS,{lat:0,dt}).first));
  console.log('NS lat45', pr(run(mNS,{lat:45,dt:0.25}).first));
  console.log('NS eq nodrag', pr(run(mNS,{lat:0,dt:0.25,noDrag:true}).first));
}
