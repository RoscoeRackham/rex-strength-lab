const { P, D, g, surf, obj, rex, ollie, ctxOf, ON, sig, M } = require('./common.js');
for (const ub of [false, true]) {
  const c = Object.assign(ctxOf(1e9, { surface: surf('granite'), unbreakable: ub }), { use: 9.38e6 * g });
  const r = P.throwObject(c, obj('bus'), 45);
  const o = { surface: c.surface, body: rex, unbreakable: ub, obj: obj('bus'), angle: 45 };
  console.log('granite bus 45 at 9,380 t, unbreakable', ub, 'v', sig(r.v, 6), 'sinkRatio', sig(r.sinkRatio, 3), 'raw', sig(r.sinkRatioRaw, 3), 'ppv5', sig(P.ppvAt(M.throw.shake(r, o), 5) * 1000, 3), 'mm/s', 'landing', sig(P.ppvAt(M.throw.landShake(r, o), 5) * 1000, 3), 'toGround', r.toGround ? sig(r.toGround.J, 3) + ' over ' + sig(r.toGround.T, 3) : '-');
}
