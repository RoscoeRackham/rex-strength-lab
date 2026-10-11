// Independent 1-D vertical integrator (RK4, small fixed step), exponential atmosphere, inverse-square gravity
const P = require('/home/user/dino-strength-sim/src/engine.js');
const GM=3.986004418e14, R=6.371e6, rho0=1.225, Hs=101325/(1.225*9.80665), m=180, Cd=1;
function run(v0, Aup, Adown, dt=1e-3, uniform=false){
  let h=0, v=v0, t=0, apex=0, tApex=0;
  const acc=(h,v)=>{const rho=uniform?rho0:rho0*Math.exp(-Math.max(h,0)/Hs); const A=v>0?Aup:Adown; return -GM/((R+h)**2) - 0.5*rho*Cd*A*v*Math.abs(v)/m;};
  while(true){
    const k1v=acc(h,v),k1h=v;
    const k2v=acc(h+0.5*dt*k1h,v+0.5*dt*k1v),k2h=v+0.5*dt*k1v;
    const k3v=acc(h+0.5*dt*k2h,v+0.5*dt*k2v),k3h=v+0.5*dt*k2v;
    const k4v=acc(h+dt*k3h,v+dt*k3v),k4h=v+dt*k3v;
    const nh=h+dt/6*(k1h+2*k2h+2*k3h+k4h), nv=v+dt/6*(k1v+2*k2v+2*k3v+k4v);
    if(nh<0 && t>0){const f=h/(h-nh); return {apex, tApex, t:t+dt*f, vImp:Math.abs(v+(nv-v)*f)};}
    h=nh; v=nv; t+=dt; if(h>apex){apex=h;tApex=t;}
  }
}
const body=P.makeBody({});
const surf={ qult: 10e6, mu: 0.8, shear: 2e6, rho: 2400 };
for (const [lk,gh] of [[5,false],[6,false],[7,false],[10.97,false],[7,true]]) {
  const r=P.jump({F:10**lk*9.80665, mode:'comic', body, surface:surf, groundHolds:gh, anchor:'friction'});
  const a=run(r.v,0.3,0.3,lk>9?1e-4:1e-3), b=run(r.v,0.3,0.8,lk>9?1e-4:1e-3);
  console.log(`logKg ${lk} gh=${gh} v0=${r.v.toFixed(1)} | engine apex ${r.flight.apex.toFixed(1)} time ${r.flight.time.toFixed(2)} vImp ${r.flight.vImpact.toFixed(2)} | indep 0.3/0.3: apex ${a.apex.toFixed(1)} t ${a.t.toFixed(2)} vImp ${a.vImp.toFixed(2)} | indep 0.3 up/0.8 down: t ${b.t.toFixed(2)} vImp ${b.vImp.toFixed(2)} | UI shows ${Math.min(r.vTerminal, r.flight.vImpact||r.vTerminal).toFixed(2)}`);
}
// uniform-density 5 km drop
const d=(A)=>{let h=5000,v=0,dt=1e-3;while(h>0){const a=-9.80665+0.5*rho0*Cd*A*v*v/m; v+=a*dt; h+=v*dt;} return Math.abs(v);};
console.log('uniform 5km drop A=0.3:', d(0.3).toFixed(2), ' A=0.8:', d(0.8).toFixed(2));
console.log('analytic vt A=0.3', Math.sqrt(2*m*9.80665/(rho0*Cd*0.3)).toFixed(2), 'A=0.8', Math.sqrt(2*m*9.80665/(rho0*Cd*0.8)).toFixed(2));
