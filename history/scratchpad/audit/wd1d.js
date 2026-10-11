global.window={}; const P=require('/home/user/dino-strength-sim/src/engine.js');
const m=2.77e9*0.18, A=0.3, V=0.18, RE=6.371e6;
function run(sig,k){
 let r=RE, v=0, t=0, vmax=0; const dt=0.05;
 while(t<20000){
  const g=P.premG(r), rho=P.premRho(r), solid=P.premSolid(r);
  let F=(m-rho*V)*g - k*rho*A*v*v;
  let a=F/m;
  v+=a*dt;
  if (solid){ const dv=sig*A*dt/m; if (v>dv) v-=dv; else { v=0; if ((m-rho*V)*g<=sig*A) return {r,t,vmax}; } }
  if (v<0) v=0;
  r-=v*dt; t+=dt; vmax=Math.max(vmax,v);
  if (r<=0) { r=-r; return {r:0,t,vmax,through:true}; }
 }
 return {r,t,vmax,timeout:true};
}
console.log('sigma1.7 k1',run(1.7e9,1));
console.log('sigma4.1 k2',run(4.1e9,2));
console.log('sigma0.1 k0.5',run(0.1e9,0.5));
