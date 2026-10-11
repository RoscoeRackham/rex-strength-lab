global.window = global.window || {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const K = P.K; console.log(Object.keys(P).join(' '));
const S = (id) => D.surfaces.find((s) => s.id === id), O=(id)=>D.objects.find(o=>o.id===id);
const ns = P.makeBody({ H: 2, m: 4.12e17 * 0.18 });
const ctx = (kg, mode) => ({ F: kg * K.g, mode, body: ns, surface: S('concrete'), groundHolds: true, anchor: 'bolted' });
for (const mode of ['comic','real']) { const r = P.throwObject(ctx(1e22, mode), O('baseball'), 45); console.log(mode, 'v', r.v, 'vOut', r.vOut, 'fallsBack', r.fallsBack, 'escapeNeeded', r.escapeNeeded, 'canHold', r.canHold); }
// threshold search for comic
let lo=1e15, hi=1e24; for (let i=0;i<80;i++){ const mid=Math.sqrt(lo*hi); const r=P.throwObject(ctx(mid,'comic'), O('baseball'),45); if (r.v>Math.sqrt(2*K.G*ns.m/0.5)) hi=mid; else lo=mid; } console.log('threshold lift kg', hi.toExponential(3));
const L = P.lift(ctx(1e22,'comic'), O('car')); console.log('lift corolla weight', L.weight, 'selfPullG', L.selfPullG);
console.log('selfGravityOn threshold check', [1.4e7,1.5e7,1.4e8,1.5e8].map(m=>[m, K.G*m/1 >= 1e-3*K.g]));
const w = P.weight({ F: 90718.474*K.g, mode:'real', body: ns, surface: S('granite'), groundHolds:false, anchor:'friction' });
console.log(JSON.stringify({fall:w.fall && {first:w.fall.firstPass, stuck:w.fall.stuck}, settle:w.settle, energyJ:w.energyJ, planet:w.planet, ground:w.ground.regime}));
for (const m of [1e18,1e20,1e21]) { const b=P.makeBody({H:2,m}); const ww=P.weight({F:K.g*1e3, mode:'real', body:b, surface:S('granite'), groundHolds:false, anchor:'friction'}); console.log(m, ww.planet.regime, ww.ground.regime, ww.settle && ww.settle.years, ww.fall && ww.fall.firstPass && ww.fall.firstPass.depthShort); }
const wd = P.makeBody({H:2, m:2.77e9*0.18}); const w2=P.weight({F:K.g*1e3, mode:'real', body:wd, surface:S('sand'), groundHolds:false, anchor:'friction'}); console.log('WD', JSON.stringify(w2.fall.stuck), w2.energyJ);
const bh = P.makeBody({H:2, m:2.36e26}); const w3=P.weight({F:Infinity, mode:'comic', body:bh, surface:S('sand'), groundHolds:true, anchor:'friction'}); console.log('BH', JSON.stringify(w3.planet), w3.grav.blackHole);
