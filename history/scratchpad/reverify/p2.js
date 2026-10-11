global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const surf = D.surfaces.find(s=>s.id==='concrete');
const mk = (kg, anchor, body, gh) => ({ F: kg * g, mode: 'comic', body, surface: surf, groundHolds: !!gh, anchor });
const pr = (lbl, r) => console.log(lbl, JSON.stringify({outcome:r.outcome, winner:r.winner, PA:r.PA, PB:r.PB, AA:r.AA, AB:r.AB, RA:r.RA,RB:r.RB, tableBreaks:r.tableBreaks, by:r.tableBreaksBy, pad:r.padLoad, tableLat:r.tableLat, pin:r.pin, drag:r.drag, torqueA:r.torqueA, torqueB:r.torqueB, slam:r.slamRatio, loserSlides:r.loserSlides, clash:r.clash}, (k,v)=> typeof v==='number'? +v.toPrecision(4):v));
const def = P.makeBody({H: P.DEFAULT_BODIES.rex.H, m: P.DEFAULT_BODIES.rex.m});
const defO = P.makeBody({H: P.DEFAULT_BODIES.ollie.H, m: P.DEFAULT_BODIES.ollie.m, build:'ollie'});
console.log('default bodies', def.H, def.m, defO.H, defO.m);
// repro 1 at 2 m
pr('r1 1e12 vs 1e11 (2m 180/300)', P.armWrestle(mk(1e12,'friction',P.makeBody({H:2,m:180})), mk(1e11,'friction',P.makeBody({H:2,m:300}))));
pr('r1b default bodies 1e12 vs 1e11 rex 300kg', P.armWrestle(mk(1e12,'friction',P.makeBody({H:P.DEFAULT_BODIES.rex.H,m:300})), mk(1e11,'friction',defO)));
// bolted default
const dial = 100*907.18474;
pr('bolted default', P.armWrestle(mk(dial,'bolted',def), mk(dial,'friction',defO)));
pr('default', P.armWrestle(mk(dial,'friction',def), mk(dial,'friction',defO)));
pr('table holds 100t vs 511kg', P.armWrestle(mk(dial,'friction',def), mk(511,'friction',defO)));
pr('table holds 4t vs 3.6t', P.armWrestle(mk(4000,'friction',def), mk(3600,'friction',defO)));
pr('table holds 2m 100t vs 511', P.armWrestle(mk(dial,'friction',P.makeBody({H:2,m:180})), mk(511,'friction',P.makeBody({H:2,m:180}))));
pr('braced', P.armWrestle(mk(dial,'braced',def), mk(dial,'friction',defO)));
pr('both braced', P.armWrestle(mk(dial,'braced',def), mk(dial,'braced',defO)));
pr('comic ground 100t vs 511', P.armWrestle(mk(dial,'friction',def,true), mk(511,'friction',defO,true)));
pr('inf bolted vs friction', P.armWrestle({...mk(dial,'bolted',def), F:Infinity}, {...mk(dial,'friction',defO), F:Infinity}));
pr('inf friction vs inf bolted', P.armWrestle({...mk(dial,'friction',def), F:Infinity}, {...mk(dial,'bolted',defO), F:Infinity}));
pr('inf A vs finite bolted B', P.armWrestle({...mk(dial,'friction',def), F:Infinity}, mk(dial,'bolted',defO)));
pr('inf bolted A vs finite friction B', P.armWrestle({...mk(dial,'bolted',def), F:Infinity}, mk(dial,'friction',defO)));
// equal everything, small dial (table holds) 
pr('equal small', P.armWrestle(mk(100,'friction',def), mk(100,'friction',defO)));
pr('slightly unequal 100 vs 90', P.armWrestle(mk(100,'friction',def), mk(90,'friction',defO)));
