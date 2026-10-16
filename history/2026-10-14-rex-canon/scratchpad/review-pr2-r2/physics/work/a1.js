const { P, D, rex, ollie, surf, objs, ON, OFF, ctx } = require('./h.js');
const g = P.K.g, c = P.K.c;
const sig = (x) => typeof x === 'number' ? +x.toPrecision(5) : x;
// A. throws in real mode and comic, various objects/surfaces
for (const mode of ['comic', 'real']) for (const s of ['ice', 'steel', 'softclay', 'gravel', 'sand']) for (const oid of ['person', 'car', 'bus', 'semi']) for (const kg of [90718.474, 1e9, 1e20]) for (const th of [0, 30, 90]) {
  const cc = ctx(kg, ON, { mode, surface: surf(s) });
  const r = P.throwObject(cc, objs(oid), th);
  if (!r.canMove) continue;
  const p = P.vToMomentum(r.v, objs(oid).m);
  const pE = isFinite(r.Eobj) ? Math.sqrt(r.Eobj ** 2 + 2 * r.Eobj * objs(oid).m * c * c) / c : Infinity;
  const ra = r.recoilAbsorbed;
  const err = Math.abs(ra.J - pE) / pE;
  const sr = r.sinkRatio, srW = (rex.m + objs(oid).m) * g / r.anchor.Nmax;
  if (err > 1e-6 || r.toGround || r.recoilV !== 0 || ra.thetaDeg !== th || (isFinite(r.anchor.Nmax) && Math.abs(sr - srW) > 1e-9 * srW)) console.log('BAD', mode, s, oid, kg, th, sig(ra.J), sig(pE), r.toGround, r.recoilV, sr, srW);
}
console.log('A done');
// B. shove in real mode and comic, various surfaces, Rex shoves Ollie
for (const mode of ['comic', 'real']) for (const s of ['ice', 'steel', 'softclay', 'gravel', 'concrete']) for (const kg of [3000, 9000, 90718.474, 1e6, 1e9]) for (const pw of [ON, Object.assign({}, OFF, { ownRecoil: true })]) {
  const cA = ctx(kg, pw, { mode, surface: surf(s) }), cB = Object.assign({}, cA, { body: ollie });
  const r = P.shove(cA, cB);
  if (r.stalled || !r.push) { continue; }
  const fB = P.anchorCapacity({ body: ollie, surface: cB.surface, theta: 0, anchor: 'friction', groundHolds: P.holdsGround(cB), mA: ollie.m }).R;
  const pO = isFinite(r.EB) ? Math.sqrt(r.EB ** 2 + 2 * r.EB * ollie.m * c * c) / c : Infinity;
  const J = r.recoilAbsorbed && r.recoilAbsorbed.J;
  const exp = pO + fB * r.push.t + r.Fg * r.push.t;
  const err = Math.abs(J - exp) / exp;
  if (!(err < 1e-6) || r.vA !== 0 || r.toGround) console.log('SHOVE', mode, s, kg, JSON.stringify(pw), r.basis || '', 'J', sig(J), 'Ollie p', sig(pO), 'feet', sig(fB * r.push.t), 'exp', sig(exp), 'err', sig(err), 'vA', r.vA, 'toGround', !!r.toGround);
}
console.log('B done');
