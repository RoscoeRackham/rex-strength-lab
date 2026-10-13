const { P, D, body, surf, ctx } = require('./eng.js');
const ob = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const o = D.objects.find((x) => x.id === 'baseball');
const L = P.catchLeg(ctx(1e20), Object.assign(ctx(1e20), { body: ob }), o, 1e5, 'hard');
console.log(L.result, JSON.stringify(L.hitsGround));
