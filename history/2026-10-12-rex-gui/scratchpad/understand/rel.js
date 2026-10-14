const {P,D}=require('./load.js');
const K=P.K, g=K.g;
const kg = Math.pow(10, Math.log10(200e18*907.18474)+1e-12);
const sig=(x,n=4)=>typeof x==='number'?Number(x.toPrecision(n)):x;
const rex=P.makeBody({build:'rex',H:3.048,m:3007}), ollie=P.makeBody({build:'ollie',H:3.048,m:3007});
const surface=D.surfaces.find(s=>s.id==='concrete');
const mk=(b,x)=>Object.assign({F:kg*g,mode:'comic',body:b,surface,groundHolds:false,anchor:'friction'},x||{});
const o=D.objects.find(x=>x.id==='baseball');
const r=P.throwObject(mk(rex),o,0);
const v=r.v, E=r.Eobj;
console.log('v',v,'1-v/c',1-v/K.c,'E',E,'gamma-1',E/(o.m*K.c*K.c));
// gravity deflection and sag
const defl = g*K.R_E/(v*v); console.log('deflection rad (gR/v^2)',defl,'deg',defl*180/Math.PI);
const d1pc = g*K.R_E/Math.pow(0.01*K.c,2); console.log('deflection at 1% c rad',d1pc,'deg',d1pc*180/Math.PI);
const h0=rex.releaseHeight;
const xK = Math.sqrt(Math.pow(K.R_E+1e5,2)-Math.pow(K.R_E+h0,2)); console.log('level line reaches 100 km at downrange (km)',xK/1e3,'time ms',xK/v*1e3,'sag mm',0.5*g*Math.pow(xK/v,2)*1e3);
const xH = Math.sqrt(2*K.R_E*K.Hs); console.log('one scale height up at (km)',xH/1e3);
// air column along a level line (numerical)
let col=0; const dx=10; for (let x=0;x<3e6;x+=dx){ const h=Math.sqrt(Math.pow(K.R_E+h0,2)+x*x)-K.R_E; col+=P.rhoAt(h)*dx; }
console.log('air column along level line kg/m2',col,'page proxy rho0*Hs/0.03',K.rho0*K.Hs/0.03);
// snowplow on the level path
const m=o.m, A=o.area, gm1=E/(m*K.c*K.c), x=col*A/m;
const heat=2*E*x/(Math.sqrt((1+x)*(1+x)+2*gm1*x)+1+x);
console.log('swept masses x',x,'heat over whole level air path',heat,'share',heat/E,'half-energy sweep (km)', m/(K.rho0*A)*(1+gm1/4)/1e3, 'page sweep (m)', m/(K.rho0*A), 'gamma*m/A vs column', (1+gm1)*m/A, col);
// downward geometry: distance along line from h0 at depression d to the ground
const hitDist=(h,dDeg)=>{ const d=dDeg*Math.PI/180, Rp=K.R_E+h, b=Rp*Math.sin(d), disc=b*b-(Rp*Rp-K.R_E*K.R_E); return disc<0?Infinity:b-Math.sqrt(disc); };
for (const dd of [0.01,0.05,0.053,0.06,0.1,0.5,1,5,10,45,90]) console.log('depression',dd,'deg -> ground at',sig(hitDist(h0,dd)),'m');
console.log('grazing depression (deg)', Math.acos(K.R_E/(K.R_E+h0))*180/Math.PI);
// crater/quake for a downward hit with all its energy (100%)
const L = Math.cbrt(6*m/(Math.PI*(o.rho||1000)));
for (const ang of [1,45,90]) { const cr=P.craterDiameter({L,v,rhoI:o.rho||1000,rhoT:surface.rho||2000,angleDeg:ang,E}); console.log('impact angle',ang,'crater',cr.D,'extrap',cr.extrapolated,'planet?',E>=K.EARTH_BIND||cr.D>K.R_E,'beyondFit',cr.D>3e5); }
console.log('quake', P.seismicMagnitude(E), 'TNT Mt', E/4.184e15, 'EARTH_BIND', K.EARTH_BIND);
// recoil and momentum
const p = Math.sqrt(E*E+2*E*m*K.c*K.c)/K.c; console.log('p',p,'recoilV',r.recoilV,'recoil/c',r.recoilV/K.c,'Earth recoil if bolted',p/K.M_E);
// catch game
for (const st of ['hard','easy']) { const L1=P.catchLeg(mk(rex),mk(ollie),o,10,st); const fb=L1.fireball; console.log('catch',st,L1.result, fb?{kind:fb.kind,E:sig(fb.E),Egap:sig(fb.Egap),Earr:sig(fb.Earr),sweep:sig(fb.sweep),Ehere:sig(fb.Ehere),Eblast:sig(fb.Eblast),recoilV:sig(fb.push.recoilV),vap:sig(fb.vapRatio)}:'', L1.vL, L1.thetaDeg, L1.recoil); }
for (const D0 of [10,1e3,1e5,2e7]) { const L1=P.catchLeg(mk(rex),mk(ollie),o,D0,'hard'); const fb=L1.fireball; console.log('catch hard D',D0,L1.result,fb?{kind:fb.kind,Egap:sig(fb.Egap),Eblast:sig(fb.Eblast)}:L1.relativistic); }
// thrown partner level
const tp=P.throwPartner(mk(rex),mk(ollie),0); console.log('throwPartner level', tp.r.v, tp.r.v/K.c, tp.r.flight.relativistic, tp.r.Eobj, tp.r.recoilV/K.c);
const ts=P.tossPartner(mk(rex),ollie,'Ollie','hard',10); console.log('tossPartner hard', ts.result, ts.v, ts.v/K.c);
