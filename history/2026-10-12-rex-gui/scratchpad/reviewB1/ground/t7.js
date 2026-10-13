const { P, D, g, surf, obj, rex, ollie, ctxOf, ON, sig, M } = require('./common.js');
for (const [mv, o, sid] of [['stomp', {}, 'concrete'], ['jump', { target: 3 }, 'concrete'], ['throw', { obj: obj('car'), angle: 45, target: 30 }, 'sand'], ['throw', { obj: obj('car'), angle: 45, target: 30 }, 'concrete'], ['stomp', {}, 'sand'], ['jump', { target: 3 }, 'sand'], ['throw', { obj: obj('bus'), angle: 45, target: 30 }, 'granite']]) {
  for (const extra of [{ unbreakable: true }, ON]) {
    const c = ctxOf(1e9, Object.assign({ surface: surf(sid) }, extra)), c0 = Object.assign({}, c, { unbreakable: false });
    const p1 = P.RESTRAINT.planNow(mv, c, o), p0 = P.RESTRAINT.planNow(mv, c0, o);
    const g1 = p1.result('preset:ground'), g0 = p0.result('preset:ground');
    const brk = g1.never ? 'never' : M[mv].ground(p1.runReal(g1.use), p1.optReal);
    console.log(mv, sid, JSON.stringify(extra), 'on:', g1.never ? 'never' : sig(g1.use / g, 3), 'off:', g0.never ? 'never' : sig(g0.use / g, 3), 'breaks at that run:', brk);
  }
}
