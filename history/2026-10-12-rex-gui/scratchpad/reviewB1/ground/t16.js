const { P, D, g, surf, obj, rex, ollie, ctxOf, ON, sig, M } = require('./common.js');
const o = obj('baseball');
for (const lg of [3, 3.5, 4, 4.5, 5, 5.5, 6]) {
  const cR = ctxOf(Math.pow(10, lg), ON), cO = Object.assign({}, cR, { body: ollie });
  const L = P.catchLeg(cR, cO, o, 10, 'hard');
  if (!L.toGroundT) { console.log(lg, L.result); continue; }
  const s1 = P.impulseSource(cR.surface, L.toGroundT.J, L.toGroundT.T);
  const r = P.throwObject(cR, o, L.aim.thetaDeg);
  const Jarm = (o.m + r.armMass) * L.aim.vL;
  const s2 = P.impulseSource(cR.surface, Jarm, L.toGroundT.T);
  console.log('1e' + lg, 'kg', L.result, 'vL', sig(L.aim.vL, 3), 'J catch', sig(L.toGroundT.J, 3), 'ppv5', sig(P.ppvAt(s1, 5) * 1000, 3), 'mm/s plaster?', P.plasterOver(s1, 5), '| J incl. arm', sig(Jarm, 3), 'ppv5', sig(P.ppvAt(s2, 5) * 1000, 3), 'mm/s plaster?', P.plasterOver(s2, 5));
}
