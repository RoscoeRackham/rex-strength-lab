const { P, D, g, surf, obj, rex, ollie, ctxOf, ON, sig, M } = require('./common.js');
for (const ub of [true, false]) {
  const c = ctxOf(1e9, Object.assign({}, ON, { unbreakable: ub }));
  const p = P.RESTRAINT.planNow('throw', c, { obj: obj('car'), angle: 45, target: 30, near: 5 });
  const h = p.result('hazard:plaster');
  const run = p.run(h.use), land = M.throw.landShake(run, p.opt);
  console.log('car 45 concrete powers on, unbreakable', ub, 'hazard:plaster at', sig(h.use / g, 3), 'kg; shakeFrom', M.throw.shakeFrom(run, p.opt), 'landing plaster reach', sig(P.plasterReach(land), 3), 'm; total reach', sig(P.plasterReach(M.throw.shake(run, p.opt)), 3), 'sinkRatio', sig(run.sinkRatio, 3), 'v', sig(run.v, 4));
}
