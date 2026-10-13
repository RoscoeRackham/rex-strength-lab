const { P, D, g, ON, OFF, ctx } = require('./h.js');
const M = P.RESTRAINT.MOVES;
const car = D.objects.find(o => o.id === 'car');
for (const sid of ['sand', 'concrete', 'granite']) {
  const c = ctx(1e9, { surf: sid }), cu = Object.assign({ unbreakable: true }, c);
  const o = { obj: car, angle: 45, target: 30 };
  const p0 = P.RESTRAINT.planNow('throw', c, o), p1 = P.RESTRAINT.planNow('throw', cu, o);
  const g0 = p0.result('preset:ground'), g1 = p1.result('preset:ground'), h1 = p1.result('hazard:ground');
  const pass = g0.use === g1.use && h1.never && (g1.never || M.throw.ground(p1.runReal(g1.use), p1.optReal));
  console.log(sid, 'g0', g0.never ? 'never' : (g0.use / g).toPrecision(3), 'g1', g1.never ? 'never' : (g1.use / g).toPrecision(3), 'h1.never', h1.never, 'pass', pass);
}
// sabotage: what if preset:ground ignored ctxReal (ran with unbreakable on)? emulate: test with p1's normal 'at' runs
{
  const c = ctx(1e9, { surf: 'sand' }), cu = Object.assign({ unbreakable: true }, c);
  const p1 = P.RESTRAINT.planNow('throw', cu, { obj: car, angle: 45, target: 30 });
  // sabotaged result is 'never' because the preset test returns false with unbreakable; check would still pass on sand:
  const g0 = P.RESTRAINT.planNow('throw', c, { obj: car, angle: 45, target: 30 }).result('preset:ground');
  console.log('sand sabotage pass (g1 forced never):', g0.use === Infinity && p1.result('hazard:ground').never);
}
// 5d check: ppv > landing*0
{
  const cr = Object.assign(ctx(1e5, { surf: 'concrete' }), { ownRecoil: true });
  const bus = D.objects.find(o => o.id === 'bus');
  const bc = P.throwObject(cr, bus, 45);
  const oc = { body: cr.body, surface: cr.surface, anchor: 'friction', angle: 45, near: 5, obj: bus, ownRecoil: true };
  const src = M.throw.shake(bc, oc);
  const land = M.throw.landShake(bc, oc);
  const pushOnly = P.impulseSource(cr.surface, bc.toGround.J, bc.toGround.T);
  console.log('5d: array', Array.isArray(src), 'combined', P.ppvAt(src, 5), 'land', P.ppvAt(land, 5), 'push only', P.ppvAt(pushOnly, 5));
  // sabotage: J=0 -> impulseSource null -> array [land]
  const bz = Object.assign({}, bc, { toGround: { J: 0, T: bc.toGround.T } });
  const sz = M.throw.shake(bz, oc);
  console.log('with J=0 the check gives', Array.isArray(sz) && P.ppvAt(sz, 5) > P.ppvAt(M.throw.landShake(bz, oc), 5) * 0);
}
