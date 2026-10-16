const {P,D,g,ctx}=require('./eng.js');
const need=P.W8.WALK_LOAD*3000/P.MUSCLE.jump.forceFrac; console.log('need kg',need);
const r=P.pushMatch(ctx('rex',need),ctx('ollie',need));
console.log(r.outcome, r.vA, r.slideA, r.footA, r.recoilAbsorbedA);
const r2=P.pushMatch(ctx('rex',90718.474),ctx('ollie',90718.474));
console.log(r2.outcome, r2.vA, r2.slideA, r2.t, r2.footA, r2.recoilAbsorbedA, 'p',3000*r2.vA);
// mu on surfaces
console.log(D.surfaces.map(s=>s.id+':'+(s.mu||s.muS||JSON.stringify(Object.keys(s)))).join(' '));
