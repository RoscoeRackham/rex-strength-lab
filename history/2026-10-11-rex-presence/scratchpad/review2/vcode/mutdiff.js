// compare original vs mutant engine on targeted inputs
const repo = process.argv[2];
const load = (p) => { delete require.cache[require.resolve(p)]; global.window = {}; const P = require(p); require(repo + '/rex-strength-lab/src/data.js'); delete require.cache[require.resolve(repo + '/rex-strength-lab/src/data.js')]; return { P, D: window.DINO_DATA }; };
const base = load(repo + '/rex-strength-lab/src/engine.js');
const S = __dirname, rn = require('path').basename(repo);
const probes = {
  'soil-throw': ({P,D}) => { const g=P.K.g, c={F:1e7*g,mode:'comic',body:P.makeBody({build:'rex',H:3.048,m:3007}),surface:D.surfaces.find(s=>s.id==='sand'),groundHolds:false,anchor:'friction'}; const p=P.RESTRAINT.planNow('throw',c,{obj:D.objects.find(o=>o.id==='car'),angle:45,target:30}); const h=p.result('hazard:ground'); const r=p.run(p.goal().use); return 'ground hazard '+(h.never?'never':(h.use/g).toPrecision(3))+'; at least-disruptive: '+P.RESTRAINT.MOVES.throw.ground(r,p.opt); },
  'soil-sprint': ({P,D}) => { const g=P.K.g, c={F:1e7*g,mode:'comic',body:P.makeBody({build:'rex',H:3.048,m:3007}),surface:D.surfaces.find(s=>s.id==='sand'),groundHolds:false,anchor:'friction'}; const p=P.RESTRAINT.planNow('sprint',c,{target:12.42}); const h=p.result('hazard:ground'); return 'ground hazard '+(h.never?'never':(h.use/g).toPrecision(3))+'; ceiling '+p.ceiling().by; },
  'stomp-no-stampMass': ({P,D}) => { const g=P.K.g, c={F:90718*g,mode:'comic',body:P.makeBody({build:'rex',H:3.048,m:3007}),surface:D.surfaces.find(s=>s.id==='concrete'),groundHolds:false,anchor:'friction'}; const p=P.RESTRAINT.planNow('stomp',c,{}); return 'least-disruptive stomp '+(p.goal().use/g).toPrecision(3)+' kg'; },
  'stomp-goal-feel': ({P,D}) => { const g=P.K.g, c={F:90718*g,mode:'comic',body:P.makeBody({build:'rex',H:3.048,m:3007}),surface:D.surfaces.find(s=>s.id==='concrete'),groundHolds:false,anchor:'friction'}; const p=P.RESTRAINT.planNow('stomp',c,{}); return 'least-disruptive stomp '+(p.goal().use/g).toPrecision(3)+' kg'; },
  'passenger-mean-g': ({P,D}) => { const g=P.K.g, c={F:90718*g,mode:'comic',body:P.makeBody({build:'rex',H:3.048,m:3007}),surface:D.surfaces.find(s=>s.id==='concrete'),groundHolds:false,anchor:'friction'}; const p=P.RESTRAINT.planNow('throw',c,{obj:D.objects.find(o=>o.id==='person'),angle:45,target:30}); const h=p.result('hazard:passenger'); return 'passenger hazard '+(h.never?'never':(h.use/g).toPrecision(3)+' kg'); },
  'instant-no-cap': ({P,D}) => { const r=P.instantGrowth(P.makeBody({build:'rex',H:3.048,m:3007}),4.2e23,0.5,{surface:D.surfaces.find(s=>s.id==='concrete')}); return 'launch '+r.launch.toPrecision(3)+' m vLeave '+r.vLeave.toPrecision(3); },
  'gradual-T-half': ({P,D}) => { const r=P.gradualGrowth(P.makeBody({build:'rex',H:3.048,m:3007}),4.2e23,0.5); return 'T '+r.T.toPrecision(3)+' s'; },
  'clap-not-silent': ({P,D}) => { const g=P.K.g, c={F:1e9*g,mode:'comic',body:P.makeBody({build:'rex',H:3.048,m:3007}),surface:D.surfaces.find(s=>s.id==='concrete'),groundHolds:false,anchor:'friction'}; const p=P.RESTRAINT.planNow('clap',c,{target:6,silentStrike:true}); const h=p.result('hazard:boom'); return 'clap silent: boom '+(h.never?'never':(h.use/g).toPrecision(3)+' kg'); },
  'windows-near': ({P,D}) => { const g=P.K.g, c={F:1e9*g,mode:'comic',body:P.makeBody({build:'rex',H:3.048,m:3007}),surface:D.surfaces.find(s=>s.id==='concrete'),groundHolds:false,anchor:'friction'}; const p=P.RESTRAINT.planNow('punch',c,{target:10.4}); const h=p.result('preset:windows'); return 'punch windows preset '+(h.never?'never':(h.use/g).toPrecision(3)+' kg'); },
  'jump-no-landing-ground': ({P,D}) => { const g=P.K.g, c={F:1e7*g,mode:'comic',body:P.makeBody({build:'rex',H:3.048,m:3007}),surface:D.surfaces.find(s=>s.id==='concrete'),groundHolds:false,anchor:'friction'}; const p=P.RESTRAINT.planNow('jump',c,{target:3}); const h=p.result('hazard:ground'); return 'jump ground '+(h.never?'never':(h.use/g).toPrecision(3)+' kg'); },
};
for (const [name, f] of Object.entries(probes)) {
  const mp = require('path').join(S, 'mut', rn, name, 'src/engine.js');
  let a, b; try { a = f(base); } catch (e) { a = 'ERR ' + e.message; }
  try { const m = load(mp); b = f(m); } catch (e) { b = 'ERR ' + e.message; }
  console.log(rn, name.padEnd(22), '| orig:', a, '| mutant:', b);
}
