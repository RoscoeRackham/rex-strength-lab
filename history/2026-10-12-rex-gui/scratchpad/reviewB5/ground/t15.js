const { P, D, surf, obj, rex, tons, ctx } = require('./lib.js');
const M = P.RESTRAINT.MOVES;
const fmt = (x) => (typeof x === 'number' ? x.toPrecision(4) : x);
const body = rex(), sand = surf('sand'), Nmax = P.qultFor(sand, body.footB) * 2 * body.footArea;
for (const kg of [tons(100), 1e6]) {
  const c = ctx({ surface: 'sand', kg }); const o = Object.assign({ body, surface: sand, obj: obj('bus'), m: body.m, near: 5 }, c);
  const r = P.pull(c, obj('bus')); const sh = M.pull.shake(r, o);
  const J = P.vToMomentum(r.vEnd, obj('bus').m) + r.resist * r.t10m;
  console.log(fmt(kg), 'kg: t10m', fmt(r.t10m), 'rope T', fmt(r.ropeT), 'N; J', fmt(J), 'ppv5', fmt(P.ppvAt(sh, 5) * 1e3), 'mm/s feel reach', fmt(P.ppvReach(sh, 0.3e-3)), '| sand mu*Nmax', fmt(sand.mu * Nmax), 'N');
}
