global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const surf = D.surfaces.find(s=>s.id==='concrete');
const defB = () => P.makeBody({H: P.DEFAULT_BODIES.rex.H, m: P.DEFAULT_BODIES.rex.m});
const defO = () => P.makeBody({H: P.DEFAULT_BODIES.ollie.H, m: P.DEFAULT_BODIES.ollie.m, build:'ollie'});
const F = 100*907.18474*g;
for (const gh of [false,true]) {
  const r = P.collide({F, mode:'comic', body: defO(), surface: surf, groundHolds: gh, anchor:'friction'}, {F, mode:'comic', body: defB(), surface: surf, groundHolds: gh, anchor:'bolted'}, {source:'set', gb: Infinity});
  console.log('gh', gh, r.outcome, 'held', r.held, 'uvb', r.unlimitedVsBolted, 'earth', JSON.stringify(r.earth), 'rock', JSON.stringify(r.rock), 'h.inel', JSON.stringify(r.h && r.h.inel));
}
// immovable
const r2 = P.collide({F, mode:'comic', body: defO(), surface: surf, groundHolds: false, anchor:'friction'}, {F, mode:'comic', body: defB(), surface: surf, groundHolds: false, anchor:'bolted', immovable: true}, {source:'set', gb: Infinity});
console.log('immovable', r2.outcome, r2.held, r2.unlimitedVsBolted, JSON.stringify(r2.earth));
