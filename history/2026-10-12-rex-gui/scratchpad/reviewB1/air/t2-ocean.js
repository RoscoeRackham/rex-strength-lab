const {P,D,obj}=require('./env.js');
const K=P.K;
// integrate a flight with drag factor k, tallying the full drag work and impulse (vector) along the path flown
function flyK(o, v0, thDeg, h0, k){
  const th=thDeg*Math.PI/180; let x=0,y=K.R_E+h0,vx=v0*Math.cos(th),vy=v0*Math.sin(th),t=0;
  const A=o.area,m=o.m;
  const acc=(x,y,vx,vy)=>{const r=Math.hypot(x,y);const g=-K.GM/(r*r*r);const v=Math.hypot(vx,vy);const d=-P.cdAt(o.Cd,o.CdSup,v/K.a0)*A/(2*m)*P.rhoAt(r-K.R_E)*v*k;return [g*x+d*vx,g*y+d*vy];};
  const full=(x,y,vx,vy)=>{const r=Math.hypot(x,y);const v=Math.hypot(vx,vy);return 0.5*P.cdAt(o.Cd,o.CdSup,v/K.a0)*P.rhoAt(r-K.R_E)*A*v*v;};
  let E=0,px=0,py=0,Escal=0;
  const dt=Math.max(2e-5, Math.min(v0/K.g/100000, 0.01));
  for(let i=0;i<5e7;i++){
    const s=(X)=>X; 
    const f=(st)=>{const [x,y,vx,vy]=st;const [ax,ay]=acc(x,y,vx,vy);const D=full(x,y,vx,vy);const v=Math.hypot(vx,vy);return [vx,vy,ax,ay,D*v,D*vx/(v||1),D*vy/(v||1),D];};
    const st=[x,y,vx,vy];
    const k1=f(st);
    const k2=f(st.map((q,j)=>q+0.5*dt*k1[j]));
    const k3=f(st.map((q,j)=>q+0.5*dt*k2[j]));
    const k4=f(st.map((q,j)=>q+dt*k3[j]));
    const inc=k1.map((q,j)=>dt/6*(q+2*k2[j]+2*k3[j]+k4[j]));
    const nx=x+inc[0],ny=y+inc[1];
    if(Math.hypot(nx,ny)<K.R_E){const r=Math.hypot(x,y);const fr=(r-K.R_E)/(r-Math.hypot(nx,ny));E+=inc[4]*fr;px+=inc[5]*fr;py+=inc[6]*fr;Escal+=inc[7]*fr;
      return {range:K.R_E*Math.atan2(x+(nx-x)*fr,y+(ny-y)*fr),E,P:Math.hypot(px,py),Pscal:Escal,vImp:Math.hypot(vx+inc[2]*fr,vy+inc[3]*fr)};}
    x=nx;y=ny;vx+=inc[2];vy+=inc[3];E+=inc[4];px+=inc[5];py+=inc[6];Escal+=inc[7];t+=dt;
  }
}
for (const [id,v0] of [['baseball',40],['baseball',300],['car',300],['car',1500]]) for (const share of [1,0.5,0.25]) {
  const o=obj(id),h0=2,k=1-share;
  const f=P.fly({v0,thetaDeg:45,h0,m:o.m,A:o.area,Cd:o.Cd,CdSup:o.CdSup,dragK:k});
  const g=flyK(o,v0,45,h0,k);
  console.log(id,v0,'share',share,'range',f.range.toFixed(2),g.range.toFixed(2),'| oceanE',f.ocean.E.toExponential(4),((share)*g.E).toExponential(4),'| oceanP',f.ocean.P.toExponential(4),(share*g.P).toExponential(4),'scalarP',(share*g.Pscal).toExponential(4),'| airE',f.air.E.toExponential(4),(k*g.E).toExponential(4));
}
