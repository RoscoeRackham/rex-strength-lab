const L='/home/user/rex-strength-lab/rex-strength-lab/';
const P=require(L+'src/engine.js');global.window={};require(L+'src/data.js');const D=window.DINO_DATA;
const K=P.K;
const ob=id=>D.objects.find(o=>o.id===id);
// independent drag-free integrator over round Earth: RK4 small fixed steps (Verlet), from h0, stops at r=R
function vac(v0,th,h0){const R=K.R_E;let x=0,y=R+h0,vx=v0*Math.cos(th*Math.PI/180),vy=v0*Math.sin(th*Math.PI/180);let t=0,apex=h0;const dt=Math.min(0.01, 2*v0*Math.sin(th*Math.PI/180)/K.g/2e5);
 const a=(x,y)=>{const r=Math.hypot(x,y);const g=-K.GM/(r*r*r);return [g*x,g*y]};
 while(true){let [ax,ay]=a(x,y);const hx=vx+0.5*dt*ax,hy=vy+0.5*dt*ay;const nx=x+dt*hx,ny=y+dt*hy;[ax,ay]=a(nx,ny);const nvx=hx+0.5*dt*ax,nvy=hy+0.5*dt*ay;
 if(Math.hypot(nx,ny)<R){const f=(Math.hypot(x,y)-R)/(Math.hypot(x,y)-Math.hypot(nx,ny));const ix=x+(nx-x)*f,iy=y+(ny-y)*f;t+=dt*f;return {range:R*Math.atan2(ix,iy),apex,time:t,v:Math.hypot(vx,vy)}}
 x=nx;y=ny;vx=nvx;vy=nvy;t+=dt;apex=Math.max(apex,Math.hypot(x,y)-R);}}
for(const [id,v0] of [['car',100],['car',300],['baseball',40],['baseball',300],['baseball',1500]]){
 const o=ob(id);const h0=2.5;
 const f1=P.fly({v0,thetaDeg:45,h0,m:o.m,A:o.area,Cd:o.Cd,CdSup:o.CdSup,dragK:0});
 const fv=P.fly({v0,thetaDeg:45,h0,m:o.m,A:o.area,Cd:0,CdSup:0});
 const iv=vac(v0,45,h0);
 console.log(id,v0,'share1 range',f1.range.toFixed(3),'apex',f1.apex.toFixed(3),'| eng-vac',fv.range.toFixed(3),fv.apex.toFixed(3),'| indep',iv.range.toFixed(3),iv.apex.toFixed(3),'vimp',f1.vImpact.toFixed(4),iv.v.toFixed(4),'ocean',JSON.stringify(f1.ocean),'air',JSON.stringify(f1.air));
}
