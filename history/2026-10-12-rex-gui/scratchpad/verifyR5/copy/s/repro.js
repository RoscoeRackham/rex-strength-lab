const { P, D, rex, ollie, surf, ON, ctxOf, g } = require('./eng.js');
const M = P.RESTRAINT.MOVES, obj = (id) => D.objects.find((o) => o.id === id);
const J = (x) => JSON.stringify(x, (k, v) => typeof v === 'number' && !isFinite(v) ? String(v) : typeof v === 'number' ? +v.toPrecision(5) : v);
// F1: landing where the ground bears nothing beyond his weight
{ const body = P.makeBody({ build: 'rex', H: 3.048, m: 5000 }), c = ctxOf(1e5 * g, Object.assign({}, ON, { surface: surf('sand'), body })), r = P.jump(c), L = r.landing;
  const Jl = P.vToMomentum(L.v, body.m), Jg = Math.min(Jl, r.landBear * L.t);
  console.log('F1 landing v', L.v.toFixed(2), 't', L.t.toFixed(4), 'landBear', r.landBear, 'J', Jl.toFixed(0), 'Jg', Jg, 'jump.shake', M.jump.shake(r, Object.assign({ surface: c.surface, body, m: body.m }, ON))); }
// F3: unbounded angled throw with their recoil taken
for (const a of [45, 90]) { const r = P.throwObject(ctxOf(Infinity, ON), obj('car'), a); console.log('F3 angle', a, J(r.toGround), 'supplied>0?', r.toGround.supplied > 0); }
// F4: pull with own recoil off at canon mass
{ const o = obj('loco'), r = P.pull(ctxOf(1e14 * g, Object.assign({}, ON, { ownRecoil: false, surface: surf('granite') })), o), rope = o.m * r.accel + r.resist;
  console.log('F4 usable', r.usable.toFixed(0), 'anchor.R', r.anchor.R.toFixed(0), 'rope', rope.toFixed(0), 'rope >= R(1-1e-6)?', rope >= r.anchor.R * (1 - 1e-6), 'body.m*a', (rex.m * r.accel).toFixed(0), 't10m', r.t10m.toFixed(2));
  const r1 = P.pull(ctxOf(1e14 * g, Object.assign({}, ON, { ownRecoil: true, surface: surf('granite') })), o); console.log('F4 with power: rope', r1.ropeT.toFixed(0), 't10m', r1.t10m.toFixed(2)); }
// F7: jump shaking with strength (all sources, 5 m), concrete
for (const lg of [8, 9]) { const c = ctxOf(Math.pow(10, lg) * g, ON), r = P.jump(c), sh = M.jump.shake(r, Object.assign({ surface: c.surface, body: rex, m: rex.m }, ON)).filter(Boolean); console.log('F7 concrete 10^' + lg, 'ppv at 5 m', (P.ppvAt(sh, 5) * 1000).toFixed(0), 'mm/s; push-off J', r.pushOff.J.toFixed(0), 'over', r.pushOff.T.toExponential(2), 's'); }
