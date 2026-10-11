global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const body = P.makeBody({H:2, m:180});
function cases(logKg, ang, surfId='concrete') {
  const surface = D.surfaces.find(s=>s.id===surfId);
  const obj = D.objects.find(o=>o.id==='car');
  const ctx = {F: Math.pow(10,logKg)*g, mode:'comic', body, surface, groundHolds:false, anchor:'friction'};
  const r = P.throwObject(ctx, obj, ang);
  const th = ang*Math.PI/180, s=Math.sin(th), c=Math.cos(th), mu=surface.mu;
  const F = r.F, mB = r.mB, mA = body.m - r.armMass, d = body.strokes.throw, RB = mB*g*s;
  const R1 = r.anchor.R, Nmax = r.anchor.Nmax;
  // 2-D: Rex horizontal only (ground support while N<=Nmax), object relative motion along line.
  // a_u (mA + mB s^2 + mu mB s c) = (c - mu s)(F - R1) when N<=Nmax and sliding
  let u=0, x=0, sv=0, sx=0, t=0, dt=1e-6, Nmaxhit=false;
  while (sx < d) {
    let au = 0;
    let fnet = (c - mu*s)*(F - R1);
    if (fnet > 0 || u > 0) {
      au = fnet/(mA + mB*s*s + mu*mB*s*c);
    }
    // check N
    const Q = mB*g*c + mB*au*s;
    const N = mA*g + F*s + Q*c;
    if (N > Nmax) Nmaxhit = true;
    const sdd = (F - mB*g*s)/mB + au*c;
    u += au*dt; if (u<0) u=0;
    sv += sdd*dt; sx += sv*dt; t+=dt;
  }
  // object velocity in ground frame
  const vox = -u + sv*c, voy = sv*s;
  const vobj = Math.hypot(vox, voy), angOut = Math.atan2(voy, vox)*180/Math.PI;
  // Rex recoil: torso mA moving back at u; arm (armMass) moving with object (vox,voy) stops inside him; vertical goes to ground.
  const pRex = mA*u - r.armMass*vox; // backward horizontal momentum
  const recoil2D = Math.max(0, pRex)/body.m;
  // 1-D force-corrected (engine's own structure, RA_eff so net = (c - mu s)(F-R1) along line)
  const fA = (c - mu*s)*(F - R1);
  const push1 = P.pushApart({F, d, mA, mB, RA: F - fA, RB, mode:'comic'});
  const rec1 = Math.max(0, push1.pA - push1.pB*r.armMass/mB)/body.m;
  // finding's variant: RA_eff = F - (c - mu s) c (F-R1)
  const fA2 = (c - mu*s)*c*(F - R1);
  const push2 = P.pushApart({F, d, mA, mB, RA: F - fA2, RB, mode:'comic'});
  const rec2 = Math.max(0, push2.pA - push2.pB*r.armMass/mB)/body.m;
  // bolted
  const pushB = P.pushApart({F, d, mA, mB, RA: Infinity, RB, mode:'comic'});
  console.log(`logKg ${logKg.toFixed(3)} ang ${ang} ${surfId}: F=${F.toFixed(0)} R1=${R1.toFixed(0)} N(F)/Nmax=${(r.anchor.N(F)/Nmax).toFixed(2)}`);
  console.log(`  engine    : car ${r.v.toFixed(2)} m/s, recoil ${r.recoilV.toFixed(2)} m/s, range ${r.flight.range!=null?r.flight.range.toFixed(1):'-'}`);
  console.log(`  1D (c-mu s)(F-R1) along line : car ${push1.vB.toFixed(2)}, recoil ${rec1.toFixed(2)}`);
  console.log(`  1D finding RA_eff (c-mu s)c(F-R1): car ${push2.vB.toFixed(2)}, recoil ${rec2.toFixed(2)}`);
  console.log(`  2D horizontal slide : car ${vobj.toFixed(2)} at ${angOut.toFixed(1)} deg, torso u ${u.toFixed(2)}, recoil(after arm) ${recoil2D.toFixed(2)}, NmaxHit ${Nmaxhit}`);
  console.log(`  bolted    : car ${pushB.vB.toFixed(2)}`);
}
cases(Math.log10(90718.474), 45);
cases(4.5, 45);
cases(4.5, 30);
cases(4.5, 20);
cases(4.5, 10);
cases(5, 55);
cases(4.5, 45, 'asphalt');
cases(4.5, 45, 'ice');
