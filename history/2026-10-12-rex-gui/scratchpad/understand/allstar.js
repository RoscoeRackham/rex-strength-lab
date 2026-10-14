const {P,D}=require('./load.js');
const g=9.80665, K=P.K;
const kg = Math.pow(10, Math.log10(200e18*907.18474)+1e-12);
const body=P.makeBody({H:P.DEFAULT_BODIES.rex.H,m:P.DEFAULT_BODIES.rex.m,build:'rex'});
const surface=D.surfaces.find(s=>s.id==='concrete');
const c={F:kg*g,mode:'comic',body,surface,groundHolds:false,anchor:'friction',gentleHold:false,safePassenger:false,silentStrike:false,softLanding:false,coolFlight:false};
const o=D.objects.find(x=>x.id==='baseball');
console.log('dial kg', kg, 'F', c.F);
for (const ang of [0, 45, -0]) {
const r=P.throwObject(Object.assign({},c,{record:true}),o,ang);
console.log('angle',ang,{v:r.v, v_over_c:r.v/K.c, Eobj:r.Eobj, recoilV:r.recoilV, recoilV_over_c:r.recoilV/K.c, recoilE:r.recoilE, basis:r.basis, canMove:r.canMove, Fdrive:r.Fdrive, F:r.F, heldBack:r.heldBack, anchorR:r.anchor.R, dragLoss:r.dragLoss, Eimpact:r.Eimpact, crater:r.crater, quake:r.quake, launchG:r.launchG, launchT:r.launchT});
console.log(' flight', r.flight);
}
// bolted
const rb=P.throwObject(Object.assign({},c,{anchor:'bolted'}),o,0);
console.log('bolted', rb.v, rb.v/K.c, rb.Eobj, rb.recoilV);
// the page's relativistic text numbers
const r=P.throwObject(c,o,0);
const sweep = o.m/(K.rho0*o.area);
const column = K.rho0*K.Hs/Math.max(Math.sin(0),0.03);
console.log('sweep m', sweep, 'column kg/m2', column, 'o.m/o.area', o.m/o.area, 'punches out?', o.m/o.area>column);
console.log('Eobj TNT Mt', r.Eobj/4.184e15);
console.log('v<0.5c?', r.v<0.5*K.c);
// gamma
const gm1 = r.Eobj/(o.m*K.c*K.c); console.log('gamma-1', gm1);
// plan / presets
const p=P.RESTRAINT.planNow('throw', c, {obj:o, angle:0, target:30, near:5, gentleHold:false, silentStrike:false, softLanding:false, safePassenger:false});
console.log('goal', p.goal());
console.log('ceiling', p.ceiling());
console.log('presets', p.presets());
const ra = p.run(undefined);
console.log('allout blast', P.RESTRAINT.MOVES.throw.blast(ra,p.opt), P.RESTRAINT.MOVES.throw.blastFrom(ra,p.opt));
console.log('reach allout', P.RESTRAINT.reach('throw', ra, p.opt));
