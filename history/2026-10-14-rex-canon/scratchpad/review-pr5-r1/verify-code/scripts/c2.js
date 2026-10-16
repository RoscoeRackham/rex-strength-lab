const { P, g, R3, c9, obj, PE, glow, sig } = require('./common.js');
const TB = P.RESTRAINT.takenBack;
for (const [id, th, kg] of [['pyramid', 90, 1e17], ['empire', 90, 1e16]]) {
  const ob = obj(id); if (!ob) { console.log('no obj', id, P && require('./common.js').D.objects.map(o => o.id).join(',')); continue; }
  const c = c9(kg * g, R3);
  const r = P.throwObject(c, ob, th);
  const tb = TB('throw', r, Object.assign({}, c, { obj: ob, angle: th }));
  const f0 = P.fly({ v0: r.vOut, thetaDeg: th, h0: R3.releaseHeight, m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup });
  const f1 = P.fly({ v0: r.vOut, thetaDeg: th, h0: R3.releaseHeight, m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup, dragK: 1 - 1e-12 });
  console.log(id, th, kg, 'v', sig(r.v), 'vOut', sig(r.vOut), 'Eobj', sig(r.Eobj), 'rel', r.flight.relativistic, 'f0 landed', f0.landed, 'escaped', f0.escaped, 'orbit', f0.orbit, 'timedOut', f0.timedOut);
  console.log('  drag part', sig(tb.parts.drag), 'full-drag flight air.E', sig(f1.air && f1.air.E), 'ratio', sig(f1.air.E / tb.parts.drag, 3), 'glow part', glow(tb.parts.drag).level.toFixed(3), glow(tb.parts.drag).text, '| glow real', glow(f1.air.E).level.toFixed(3), glow(f1.air.E).text);
}
{ const ob = obj('esb'), kg = 1e16, th = 90, c = c9(kg * g, R3), r = P.throwObject(c, ob, th), tb = TB('throw', r, Object.assign({}, c, { obj: ob, angle: th }));
  const f1 = P.fly({ v0: r.vOut, thetaDeg: th, h0: R3.releaseHeight, m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup, dragK: 1 - 1e-12 });
  console.log('esb 90 1e16: drag part', sig(tb.parts.drag), 'Eobj', sig(r.Eobj), 'real air', sig(f1.air.E), 'share', sig(f1.air.E / tb.parts.drag, 3), 'escaped', f1.escaped, f1.landed); }
