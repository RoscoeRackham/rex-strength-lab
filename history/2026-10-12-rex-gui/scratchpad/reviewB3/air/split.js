const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const K = P.K;
const h0 = 2.7432;
// independent RK4 with fixed small dt, integrating drag energy and momentum vectors with trapezoid
function myfly(v0, th, o, dK) {
  const R=K.R_E; let x=0,y=R+h0,vx=v0*Math.cos(th*Math.PI/180),vy=v0*Math.sin(th*Math.PI/180);
  const rho=(h)=>h<=0?K.rho0:K.rho0*Math.exp(-h/K.Hs);
  const cd=(M)=>o.CdSup==null||M<=0.8?o.Cd:M>=1.2?o.CdSup:o.Cd+(o.CdSup-o.Cd)*(M-0.8)/0.4;
  const Dof=(x,y,vx,vy)=>{const r=Math.hypot(x,y),v=Math.hypot(vx,vy);return 0.5*cd(v/K.a0)*rho(r-R)*o.area*v*v;};
  const acc=(x,y,vx,vy)=>{const r=Math.hypot(x,y),v=Math.hypot(vx,vy);const D=Dof(x,y,vx,vy)*dK;const g=-K.GM/r**3;return [g*x-D/o.m*vx/v,g*y-D/o.m*vy/v];};
  let E=0,px=0,py=0,t=0;const E0=0.5*o.m*v0*v0-K.GM*o.m/(R+h0);
  const dt0 = 1e-3*Math.max(1, v0/100) ;
  for(let i=0;i<5e7;i++){
    const v=Math.hypot(vx,vy); const r=Math.hypot(x,y);
    let dt=Math.min(0.0005*v/9.8, 0.0005*Math.max(1,r-R)/v, 0.5); dt=Math.max(dt,1e-6);
    const D1=Dof(x,y,vx,vy);
    const k1=acc(x,y,vx,vy);const a2=[vx+.5*dt*k1[0],vy+.5*dt*k1[1]];const k2=acc(x+.5*dt*vx,y+.5*dt*vy,a2[0],a2[1]);
    const a3=[vx+.5*dt*k2[0],vy+.5*dt*k2[1]];const k3=acc(x+.5*dt*a2[0],y+.5*dt*a2[1],a3[0],a3[1]);
    const a4=[vx+dt*k3[0],vy+dt*k3[1]];const k4=acc(x+dt*a3[0],y+dt*a3[1],a4[0],a4[1]);
    const nx=x+dt/6*(vx+2*a2[0]+2*a3[0]+a4[0]),ny=y+dt/6*(vy+2*a2[1]+2*a3[1]+a4[1]);
    const nvx=vx+dt/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]),nvy=vy+dt/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1]);
    const D2=Dof(nx,ny,nvx,nvy); const v2=Math.hypot(nvx,nvy);
    let f=1; if(Math.hypot(nx,ny)<R){f=(r-R)/(r-Math.hypot(nx,ny));}
    E+=0.5*(D1*v+D2*v2)*dt*f; px+=0.5*(D1*vx/v+D2*nvx/v2)*dt*f; py+=0.5*(D1*vy/v+D2*nvy/v2)*dt*f;
    if(f<1){const ivx=vx+(nvx-vx)*f, ivy=vy+(nvy-vy)*f; const Ef=0.5*o.m*(ivx*ivx+ivy*ivy)-K.GM*o.m/R; return {Eloss:E0-Ef, eDrag:E, P:Math.hypot(px,py), vImp:Math.hypot(ivx,ivy)};}
    x=nx;y=ny;vx=nvx;vy=nvy;t+=dt;
  }
}
for (const id of ['car','baseball']) {
  const o = D.objects.find(x=>x.id===id);
  for (const v0 of [50, 300, 1000]) for (const dK of [0, 0.25, 0.5, 0.75]) {
    const f = P.fly({ v0, thetaDeg: 45, h0, m: o.m, A: o.area, Cd: o.Cd, CdSup: o.CdSup, dragK: dK });
    const Eloss = 0.5*o.m*v0*v0 + o.m*(K.GM/K.R_E-K.GM/(K.R_E+h0)) - 0.5*o.m*f.vImpact**2;
    const me = myfly(v0, 45, o, dK);
    console.log(id, v0, 'dK', dK, 'range', f.range.toFixed(1), 'air.E', f.air.E.toExponential(4), 'mech loss', Eloss.toExponential(4), 'ocean.E', f.ocean.E.toExponential(4), 'mine eDrag*(1-dK)', (me.eDrag*(1-dK)).toExponential(4), 'mine P*(1-dK)', (me.P*(1-dK)).toExponential(4), 'eng ocean P', f.ocean.P.toExponential(4));
  }
}
