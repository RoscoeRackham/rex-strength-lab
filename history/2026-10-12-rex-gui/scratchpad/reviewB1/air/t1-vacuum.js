const {P,D,obj}=require('./env.js');
const K=P.K;
// independent RK4 drag-free integrator over a round Earth
function vac(v0, thDeg, h0){
  const th=thDeg*Math.PI/180; let x=0,y=K.R_E+h0,vx=v0*Math.cos(th),vy=v0*Math.sin(th),t=0,apex=h0;
  const acc=(x,y)=>{const r=Math.hypot(x,y);const g=-K.GM/(r*r*r);return [g*x,g*y];};
  const dt=Math.max(1e-4, v0/K.g/200000);
  for(let i=0;i<5e7;i++){
    const [a1x,a1y]=acc(x,y);
    const [a2x,a2y]=acc(x+0.5*dt*vx,y+0.5*dt*vy);
    const [a3x,a3y]=acc(x+0.5*dt*(vx+0.5*dt*a1x),y+0.5*dt*(vy+0.5*dt*a1y));
    const [a4x,a4y]=acc(x+dt*(vx+0.5*dt*a2x),y+dt*(vy+0.5*dt*a2y));
    const nx=x+dt*vx+dt*dt/6*(a1x+a2x+a3x), ny=y+dt*vy+dt*dt/6*(a1y+a2y+a3y);
    const nvx=vx+dt/6*(a1x+2*a2x+2*a3x+a4x), nvy=vy+dt/6*(a1y+2*a2y+2*a3y+a4y);
    const nr=Math.hypot(nx,ny);
    if(nr<K.R_E){const r=Math.hypot(x,y);const f=(r-K.R_E)/(r-nr);const ix=x+(nx-x)*f,iy=y+(ny-y)*f;return {range:K.R_E*Math.atan2(ix,iy),apex,t:t+dt*f,v:Math.hypot(vx+(nvx-vx)*f,vy+(nvy-vy)*f)};}
    x=nx;y=ny;vx=nvx;vy=nvy;t+=dt; apex=Math.max(apex,nr-K.R_E);
  }
}
for (const id of ['baseball','car','shot','everest']) for (const v0 of [40, 300, 1500, 5000]) {
  const o=obj(id), h0=2;
  const f1=P.fly({v0,thetaDeg:45,h0,m:o.m,A:o.area,Cd:o.Cd,CdSup:o.CdSup,dragK:0});
  const vv=vac(v0,45,h0);
  console.log(id,v0,'fly range',f1.range.toFixed(3),'vac',vv.range.toFixed(3),'rel',(f1.range/vv.range-1).toExponential(2),'| apex',f1.apex.toFixed(3),vv.apex.toFixed(3),(f1.apex/vv.apex-1).toExponential(2),'| t',f1.time.toFixed(3),vv.t.toFixed(3),'| vImp',f1.vImpact.toFixed(3),vv.v.toFixed(3), 'air',JSON.stringify(f1.air),'ocean',JSON.stringify(f1.ocean));
}
