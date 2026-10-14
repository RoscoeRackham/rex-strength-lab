global.window={}; const P=require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D=window.DINO_DATA;
const g=P.K.g, surf=(id)=>D.surfaces.find(s=>s.id===id), obj=(id)=>D.objects.find(o=>o.id===id);
const rex=P.makeBody(Object.assign({build:'rex'},P.DEFAULT_BODIES.rex)), ollie=P.makeBody(Object.assign({build:'ollie'},P.DEFAULT_BODIES.ollie));
const ctx=(F,x)=>Object.assign({F,mode:'comic',body:rex,surface:surf('concrete'),groundHolds:false,anchor:'friction'},x||{});
const F0=90718.474*g;
for (const u of [26630, 33640, 33780, 50000, 90718]) { const r=P.throwObject(ctx(F0,{use:u*g}),obj('car'),45); console.log('car use',u,'gripRatioRaw',r.gripRatioRaw.toPrecision(3),'basis',r.basis||'comic','v',r.v.toPrecision(4)); }
const le=P.lift(ctx(1e16*g),obj('everest')); console.log('lift everest 1e16: canLift',le.canLift,'gripRatioRaw',le.gripRatioRaw.toPrecision(3),'groundRatio',le.groundRatio.toPrecision(3));
const lp=P.lift(ctx(1e11*g),obj('pyramid')); console.log('lift pyramid 1e11: canLift',lp.canLift,'gripRatioRaw',lp.gripRatioRaw.toPrecision(3));
const L=P.catchLeg(ctx(1e8*g),ctx(1e8*g,{body:ollie}),obj('car'),10,'hard'); console.log('car 1e8 hard 10', L.result, 'size',L.size,'2hStop',2*L.hStop,'clean',L.catch.clean,'wholeFront',L.catch.wholeFront.toPrecision(3),'qDyn/crush',(L.qDynMax/3e6).toPrecision(3),'heat',L.heat.kind);
// bird mass sanity: depth of everest and its own-weight stress rho g h
const E=obj('everest'); console.log('everest rho g (V/A)', (E.rho*g*(E.m/E.rho)/E.area).toPrecision(3), 'Pa vs crush', E.crush);
