const { P, D, g, surf, obj, ctx } = require('./lib.js');
const per = obj('person');
const c = ctx();
const o = { near: 5, target: 30, obj: per, angle: 45, safePassenger: false };
const p = P.RESTRAINT.planNow('throw', c, o);
const gl = p.goal(), ce = p.ceiling();
console.log('goal kg', (gl.use / g).toFixed(0), 'ceiling', ce.by, (ce.below / g).toFixed(1));
for (const use of [gl.use, ce.below]) {
  const r = p.run(use);
  const th = 45 * Math.PI / 180;
  const RB = r.mB * g * Math.sin(th);
  const a0 = (r.F - RB) / r.mB / g;   // initial accel (Hill at S=0 gives F0, capped by Fused?)
  console.log('use kg', (use / g).toFixed(1), 'basis', r.basis || 'comic', 'v', r.v.toFixed(2), 't', r.push.t.toFixed(3), 'mean g', r.launchG.toFixed(2), 'felt mean', P.PASSENGER.felt(r.launchG, 45).toFixed(2), 'F', r.F.toFixed(0), 'mB', r.mB.toFixed(1), 'heldBack', r.heldBack, 'initial g', a0.toFixed(2), 'felt initial', P.PASSENGER.felt(a0, 45).toFixed(2), 'limit', P.PASSENGER.noHarm(r.launchT).toFixed(2));
}
