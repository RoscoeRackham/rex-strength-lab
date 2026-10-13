const L='/home/user/rex-strength-lab/rex-strength-lab/';
const P=require(L+'src/engine.js');global.window={};require(L+'src/data.js');const D=window.DINO_DATA;
const K=P.K;
const ob=id=>D.objects.find(o=>o.id===id);
console.log('rhoAt?',typeof P.rhoAt, Object.keys(P).filter(k=>/rho|cdAt/i.test(k)));
const rho=h=>K.rho0*Math.exp(-h/K.Hs);
const cdAt=(Cd,CdSup,M)=>CdSup==null||M<=0.8?Cd:M>=1.2?CdSup:Cd+(CdSup-Cd)*(M-0.8)/0.4;
function vacDrag(o,v0,th,h0){const R=K.R_E;let x=0,y=R+h0,vx=v0*Math.cos(th*Math.PI/180),vy=v0*Math.sin(th*Math.PI/180);let E=0,px=0,py=0,ps=0;const dt=Math.min(0.005, 2*v0/K.g/4e5);
 const a=(x,y)=>{const r=Math.hypot(x,y);const g=-K.GM/(r*r*r);return [g*x,g*y]};
 const Dr=(x,y,vx,vy)=>{const v=Math.hypot(vx,vy);const h=Math.hypot(x,y)-R;return 0.5*cdAt(o.Cd,o.CdSup,v/K.a0)*rho(h)*o.area*v*v};
 while(true){let [ax,ay]=a(x,y);const hx=vx+0.5*dt*ax,hy=vy+0.5*dt*ay;const nx=x+dt*hx,ny=y+dt*hy;[ax,ay]=a(nx,ny);const nvx=hx+0.5*dt*ax,nvy=hy+0.5*dt*ay;
 const d0=Dr(x,y,vx,vy),d1=Dr(nx,ny,nvx,nvy);const v0_=Math.hypot(vx,vy),v1_=Math.hypot(nvx,nvy);
 const f=Math.hypot(nx,ny)<R?(Math.hypot(x,y)-R)/(Math.hypot(x,y)-Math.hypot(nx,ny)):1;
 E+=0.5*(d0*v0_+d1*v1_)*dt*f;px+=0.5*(d0*vx/v0_+d1*nvx/v1_)*dt*f;py+=0.5*(d0*vy/v0_+d1*nvy/v1_)*dt*f;ps+=0.5*(d0+d1)*dt*f;
 if(f<1)return {E,P:Math.hypot(px,py),Ps:ps};
 x=nx;y=ny;vx=nvx;vy=nvy;}}
for(const [id,v0] of [['car',100],['car',300],['baseball',40],['baseball',300],['baseball',1500]]){
 const o=ob(id);const h0=2.5;
 const f1=P.fly({v0,thetaDeg:45,h0,m:o.m,A:o.area,Cd:o.Cd,CdSup:o.CdSup,dragK:0});
 const vd=vacDrag(o,v0,45,h0);
 console.log(id,v0,'ocean E',f1.ocean.E.toExponential(4),'indep',vd.E.toExponential(4),'ratio',(f1.ocean.E/vd.E).toFixed(5),'| P',f1.ocean.P.toExponential(4),'indep vec',vd.P.toExponential(4),'scalar',vd.Ps.toExponential(4));
}
