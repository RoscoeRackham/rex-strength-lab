const { P, D, g, surf, obj, rex, ollie, ctxOf, ON, sig, M } = require('./common.js');
for (const kgA of [1e8, 1e15, 1e18, 1e20, 1e22]) {
  const cA = ctxOf(kgA, ON), cB = Object.assign(ctxOf(1e4, ON), { body: ollie });
  const r = P.armWrestle(cA, cB);
  if (!r.toGround) { console.log(kgA, r.outcome, 'no toGround', r.tableBreaks); continue; }
  console.log('A', sig(kgA, 3), 'kg vs Ollie 1e4', r.outcome, 'v/c', sig(r.pin.v / P.K.c, 4), 'J (code)', sig(r.toGround.J, 4), 'relativistic p = M*gamma*v', sig(P.vToMomentum(r.pin.v, r.pin.M), 4), 'ratio', sig(P.vToMomentum(r.pin.v, r.pin.M) / r.toGround.J, 4));
}
