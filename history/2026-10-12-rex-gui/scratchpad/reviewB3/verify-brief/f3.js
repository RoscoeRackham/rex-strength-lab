const { P, D, rex, surf, ctx } = require('./common.js');
const ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const cR = ctx({ F: 1e9 * P.K.g }), cO = ctx({ F: 1e9 * P.K.g, body: ollie });
const t = P.tossPartner(cR, ollie, 'Ollie', 'hard', undefined, 'friction');
const keys = Object.keys(t);
console.log('keys', keys.join(','));
console.log('result', t.result, 'v0', t.v0 || (t.up && t.up.v), 'toGroundT' in t, 'toGroundC' in t, 'hand' in t);
const L = P.catchLeg(cR, cO, D.objects.find(o => o.id === 'car'), 10, 'hard');
console.log('catchLeg keys has toGroundT', 'toGroundT' in L, 'toGroundC' in L);
