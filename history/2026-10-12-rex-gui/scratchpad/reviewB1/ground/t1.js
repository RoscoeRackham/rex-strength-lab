const { P, D, g, surf, obj, rex, ollie, ctxOf, ON, sig } = require('./common.js');
// Collide stomp-launch with own recoil on (page default)
for (const kg of [1e4, 1e5, 1e6]) {
  const cA = Object.assign(ctxOf(kg, ON), { body: ollie }), cB = ctxOf(kg, ON);
  const r = P.collide(cA, cB, { source: 'stomp' });
  const cA0 = Object.assign(ctxOf(kg), { body: ollie }), cB0 = ctxOf(kg);
  const r0 = P.collide(cA0, cB0, { source: 'stomp' });
  console.log(kg, 'ON:', r.noCharge || r.outcome, ' OFF:', r0.noCharge || r0.outcome, r0.v0);
}
console.log(D.surfaces.map(s=>s.id).join(','));
