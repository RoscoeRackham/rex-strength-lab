const { P, D, g, R3, O3, c9, obj, PE, glow, sig, TB, duo } = require('./common.js');
// code-1 cases
for (const [id, D0, kg] of [['baseball', 300, 1e8], ['car', 1e4, 1e9]]) {
  const c = c9(kg * g), co = c9(kg * g, O3);
  const a = P.catchLeg(c, co, obj(id), D0, 'hard'), b = P.catchLeg(co, c, obj(id), D0, 'hard');
  const tb = TB('catch', { a, b }, duo(c, co, 'rex', { obj: obj(id) }));
  console.log(id, D0, kg, a.result, 'vE', sig(a.aim.vE), 'Ecatch', sig(a.catch.Ecatch), 'rex', JSON.stringify(tb.by.rex.parts), 'ollie drag', tb.by.ollie.parts.drag);
}
// code-2 pyramid
for (const [id, th, kg] of [['pyramid', 90, 1e17], ['esb', 90, 1e16], ['ruyi', 90, Math.pow(10, 12.5)]]) {
  const o = obj(id); if (!o) { console.log('no', id); continue; }
  const c = c9(kg * g), r = P.throwObject(c, o, th), tb = TB('throw', r, Object.assign({}, c, { obj: o, angle: th }));
  const f0 = P.fly({ v0: r.vOut, thetaDeg: th, h0: R3.releaseHeight, m: o.m, A: o.area, Cd: o.Cd, CdSup: o.CdSup, dragK: 1 - 1e-12 });
  console.log(id, 'v', sig(r.v), 'Eobj', sig(r.Eobj), 'drag', sig(tb.parts.drag), 'f0', f0.escaped, f0.landed, f0.orbit, f0.timedOut, 'air.E', sig(f0.air && f0.air.E), 'rel', r.flight.relativistic);
}
// code-3 dense Rex
for (const [m, kg] of [[1e12, 1e12], [1e13, 1e14], [1e12, 1e11]]) {
  const B = P.makeBody({ build: 'rex', H: 3.048, m }), c = c9(kg * g, B), o = obj('car'), r = P.throwObject(c, o, 45);
  const tb = TB('throw', r, Object.assign({}, c, { obj: o, angle: 45 }));
  console.log('dense', m, kg, 'v', sig(r.v), 'vOut', sig(r.vOut), 'fallsBack', r.fallsBack, 'drag', sig(tb.parts.drag), 'Eobj', sig(r.Eobj), 'KEout', sig(P.keFromV(r.vOut, o.m)));
}
console.log(D.objects.map(o => o.id).join(' '));
