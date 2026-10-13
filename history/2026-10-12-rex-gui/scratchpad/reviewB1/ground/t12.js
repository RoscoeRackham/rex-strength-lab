const { P, D, g, surf, obj, rex, ollie, ctxOf, ON, sig, M } = require('./common.js');
for (const kg of [3e3, 5e3, 1e4, 1e5, 1e6]) for (const ex of [ON, { unbreakable: true }]) {
  const cR = ctxOf(kg, ex), cO = Object.assign({}, cR, { body: ollie });
  const r = P.shove(cR, cO);
  if (r.stalled) { console.log(kg, 'stalled'); continue; }
  const fB = P.anchorCapacity({ body: ollie, surface: cR.surface, theta: 0, anchor: 'friction', groundHolds: true, mA: ollie.m });
  const t = r.push.t, F = r.Fdrive;
  const shoverGround = ex.ownRecoil ? (F - r.Fg) * t : (r.push.pB - r.push.pA) + fB.R * t; // impulse at the shover's feet
  const src = r.toGround ? P.impulseSource(cR.surface, r.toGround.J, r.toGround.T) : null;
  const src2 = P.impulseSource(cR.surface, shoverGround, r.toGround ? r.toGround.T : t);
  console.log(sig(kg, 2), JSON.stringify(ex).slice(0, 30), 'J code', sig(r.toGround && r.toGround.J, 4), 'shover feet impulse', sig(shoverGround, 4), 'partner friction*t', sig(fB.R * t, 4), 'ppv5 code', sig(P.ppvAt(src, 5), 3), 'ppv5 feet', sig(P.ppvAt(src2, 5), 3));
}
