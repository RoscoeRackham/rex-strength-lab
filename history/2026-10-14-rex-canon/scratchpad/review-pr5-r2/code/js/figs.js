const H = require('./h.js')(process.argv[2]);
const { P, g, obj, R3, O3, c9, dial, TB, glow, sig, PE } = H;
// Great Pyramid straight up at 1e17
{ const c = c9(1e17 * g), ob = obj('pyramid'), r = P.throwObject(c, ob, 90), tb = TB('throw', r, Object.assign({}, c, { obj: ob, angle: 90 }));
  console.log('pyramid 90 1e17: v', sig(r.v), 'Eobj', sig(r.Eobj), 'drag', sig(tb.parts.drag), 'E', sig(tb.E), glow(tb.E).text, glow(tb.E).level.toFixed(3));
  // independent: full-drag fly with dragK 1-1e-12
  const k = 1 - 1e-12, ft = P.fly({ v0: r.vOut, thetaDeg: 90, h0: R3.releaseHeight, m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup, dragK: k });
  const f1 = P.fly({ v0: r.vOut, thetaDeg: 90, h0: R3.releaseHeight, m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup });
  console.log('   indep air.E/k', sig(ft.air.E / k), 'escaped', ft.escaped, f1.escaped, 'landed', f1.landed);
}
// dense Rex car at 1e12
{ const RD = P.makeBody({ build: 'rex', H: 3.048, m: 1e12 }), c = c9(1e12 * g, RD), ob = obj('car'), r = P.throwObject(c, ob, 45), tb = TB('throw', r, Object.assign({}, c, { obj: ob, angle: 45 }));
  const f = P.fly({ v0: r.vOut, thetaDeg: 45, h0: RD.releaseHeight, m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup });
  const ec = P.keFromV(r.vOut, ob.m) + PE(ob.m, RD.releaseHeight) - P.keFromV(f.vImpact, ob.m);
  console.log('dense car 1e12: v', sig(r.v), 'vOut', sig(r.vOut), 'drag', sig(tb.parts.drag), 'indep EC', sig(ec), 'Eobj', sig(r.Eobj), glow(tb.E).text);
}
// fastball 300 m apart at 1e8, round trip
{ const cR = c9(1e8 * g), cO = c9(1e8 * g, O3), ob = obj('baseball'), a = P.catchLeg(cR, cO, ob, 300, 'hard'), b = P.catchLeg(cO, cR, ob, 300, 'hard');
  const tb = TB('catch', { a, b }, { A: cR, B: cO, whoA: 'rex', obj: ob });
  console.log('fastball 300m 1e8:', a.result, b.result, 'drag', tb.parts.drag, 'catch', sig(tb.parts.catch), 'rex', JSON.stringify(tb.by.rex.parts), 'Ecatch a', sig(a.catch.Ecatch));
}
