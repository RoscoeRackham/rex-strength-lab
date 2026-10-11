global.window = {}; const P = require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const C = require('/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/collide/collide-ref.js'); const K=P.K, g=K.g, c=K.c;
const surf = (id)=>D.surfaces.find(s=>s.id===id);
const HULK = 100*907.18474*g;
const mk=(o)=>{o=Object.assign({},o||{}); const H=o.H||2, m=o.m||180, sid=o.surface||'concrete'; delete o.H; delete o.m; delete o.surface; return Object.assign({F:HULK, mode:'comic', groundHolds:false, anchor:'friction'}, o, {body:P.makeBody({H,m}), surface:surf(sid)});};
let r;
// 1. C3 bounce: held verdict while bounce peak > H
r = C.collide(mk({surface:'granite'}), mk({anchor:'braced',surface:'granite'}), {source:'sprint'});
console.log('C3 held', r.held, 'H', r.hold.H, 'soft F', r.contact.soft.F, 'softEl peak', r.contact.softEl.F, 'bounce peak > H?', r.contact.softEl.F > r.hold.H);
// 2. C3 with a stiffer pair (matter ceiling) -> would not hold
console.log('C3 matter F', r.contact.matter.F, '> H?', r.contact.matter.F > r.hold.H);
// 3. set speed gb=100 into Rex: air vs Q vs KA
r = C.collide(mk(), mk(), {source:'set', gb:100});
console.log('gb100 air', r.airRunUp.toExponential(3), 'Q', r.Q.toExponential(3), 'KA', r.h.KA.toExponential(3), 'air/KA', (r.airRunUp/r.h.KA).toFixed(2));
r = C.collide(mk(), mk(), {source:'set', gb:1e4});
console.log('gb1e4 air', r.airRunUp.toExponential(3), 'KA', r.h.KA.toExponential(3), 'air/KA', (r.airRunUp/r.h.KA).toFixed(1));
// 4. very light Rex (1 kg/m3 => 0.18 kg)
r = C.collide(mk(), mk({m:0.18}), {source:'sprint'});
console.log('light Rex: H', r.hold.H, 'splat slide', r.after.splat.slide, 'bounce slideB', r.after.bounce.slideB, 'vB', r.after.bounce.vB);
r = C.collide(mk(), mk({m:0.18*0.5}), {source:'sprint'}); // 0.5 kg/m3, lighter than air
console.log('0.5 kg/m3 Rex: H', r.hold.H, 'splat slide', r.after.splat.slide, 'bounce slideB', r.after.bounce.slideB);
// 5. 0.9c into bolted Rex: held + rock radius vs P-wave reach
r = C.collide(mk(), mk({anchor:'bolted'}), {source:'set', gb:0.9/Math.sqrt(0.19)});
console.log('C8 outcome', r.outcome, 'tau', r.contact.soft.t, 'rT', r.rock.rT, 'P-wave reach (5.5 km/s)', 5500*r.contact.soft.t, 'free-hit Q', C.headOn(r.pA,180,180).Q.toExponential(3), 'held Q', r.Q.toExponential(3));
// held vs free crossover for bolted Rex on granite: rock mass reachable in contact time vs 180 kg
for (const v of [100, 1000, 5000, 12000, 30000]) { const rr = C.collide(mk(), mk({anchor:'bolted'}), {source:'set', gb:v/c}); const t=rr.contact.soft.t, R=5500*t, mrock=2/3*Math.PI*R**3*2700; console.log('v',v,'tau',t.toExponential(2),'rock mass reachable',mrock.toExponential(2),'kg vs 180 kg; rT',rr.rock.rT.toFixed(2),'m vs reach',R.toFixed(3)); }
// 6. 11.2 km/s: stagnation temperature vs 'sonic boom' chip
console.log('stagT 11.2 km/s', P.stagnationT(11200).toFixed(0), 'K; at 5.6 km/s', P.stagnationT(5600).toFixed(0));
// 7. default blast radii for the plush splat
const Q = 97451; console.log('blast radii for 97 kJ', D.overpressure.map(t=>t.label+': '+P.blastRadius(Q,t.Pa).toFixed(2)+' m').join('; '));
console.log('contact time default', 0.015068, 's; sound crosses', (340*0.015068).toFixed(2),'m in that time');
// 8. Push both bolted dial 1e16: beyondCrust from single-anchor; dipole estimate
const s14 = C.standoff(mk({anchor:'bolted', F:1e16*g}), mk({anchor:'bolted', F:1e16*g}));
console.log('S14 rT single', s14.rock.rT, 'dipole', Math.cbrt(s14.rock.C*2/(2*Math.PI*8.38e6)));
// 9. held-verdict flip speed for claws-in-granite (plush) 
console.log('claws-in-granite Rex stops holding (plush, splat) above v =', Math.sqrt(2*HULK*0.350263/180).toFixed(1), 'm/s; bounce above', Math.sqrt(HULK*0.350263/180).toFixed(1));
// 10. Ollie as braced holder text
console.log('Ollie braced holder hold', C.collide(mk(), mk({anchor:'braced'}), {source:'sprint'}).hold);
// 11. unstoppable vs bolted, real ground: held=true, rock planet
r = C.collide(mk(), mk({anchor:'bolted'}), {source:'set', gb:Infinity}); console.log('C9 outcome', r.outcome, 'held', r.held, 'rock', JSON.stringify(r.rock), 'earth dv', r.earth.dvSplat);
// 12. gravity: Ollie can't stand 20 m from NS Rex
const NS=4.12e17*0.18; console.log('pull on Ollie at 20 m from NS Rex', (K.G*NS*180/400).toExponential(3), 'N vs his friction', (0.6*180*g).toFixed(0), 'N');
