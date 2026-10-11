global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = P.K.g;
const body = P.makeBody({H:2,m:180});
function go(lk, ang, objId='car', surfId='concrete') {
  const surface = D.surfaces.find(s=>s.id===surfId), obj = D.objects.find(o=>o.id===objId);
  const r = P.throwObject({F:Math.pow(10,lk)*g, mode:'comic', body, surface, groundHolds:false, anchor:'friction'}, obj, ang);
  const th=ang*Math.PI/180, s=Math.sin(th), c=Math.cos(th), mu=surface.mu;
  const F=r.F, mB=r.mB, mA=body.m-r.armMass, d=body.strokes.throw, RB=mB*g*s, am=r.armMass;
  const Nmax=r.anchor.Nmax, N=r.anchor.N;
  const fh = Math.max(0, F*c - mB*g*s*c - mu*Math.min(N(F),Nmax));
  // 2D truth (horizontal slide only, Q coupling), with N capped -> treat like engine design (no sinking motion)
  let u=0,sv=0,sx=0,dt=1e-6;
  while (sx<d) {
    let au=0;
    // with Q coupling; if N exceeds Nmax use mu*Nmax
    const meff = mA + mB*s*s + mu*mB*s*c;
    au = Math.max(0,(c-mu*s)*(F-r.anchor.R))/meff;
    const Q=mB*g*c+mB*au*s, Nn=mA*g+F*s+Q*c;
    if (Nn>Nmax) { au = Math.max(0, F*c - Q*s - mu*Nmax)/mA; }
    const sdd=(F-mB*g*s)/mB + au*c;
    u+=au*dt; sv+=sdd*dt; sx+=sv*dt;
  }
  const vox=-u+sv*c, voy=sv*s, v2=Math.hypot(vox,voy), rec2=Math.max(0,mA*u-am*vox)/body.m;
  const pu = P.pushApart({F,d,mA,mB,RA:F-c*fh,RB,mode:'comic'});
  const recLine = Math.max(0,pu.pA-pu.pB*am/mB)/body.m;
  const recH = Math.max(0,pu.pA/c - c*pu.pB*am/mB)/body.m;
  console.log(`logKg ${lk.toFixed(2)} ${ang}deg ${objId} ${surfId} N/Nmax ${(N(F)/Nmax).toFixed(2)} | engine v ${r.v.toFixed(2)} rec ${r.recoilV.toFixed(2)} | fix v ${pu.vB.toFixed(2)} recLine ${recLine.toFixed(2)} recHoriz ${recH.toFixed(2)} | 2D v ${v2.toFixed(2)} rec ${rec2.toFixed(2)}`);
}
for (const a of [10,20,30,45,55]) go(4.5,a);
go(Math.log10(90718.474),45);
go(4.0,45); go(4.2,30);
go(4.5,45,'car','asphalt'); go(4.5,45,'car','ice'); go(4.5,45,'car','sand');
go(3.5,45,'shot'); go(4,45,'bowling');
