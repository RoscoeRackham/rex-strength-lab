const { P, D, surf, ctx } = require('./common.js');
const R = P.RESTRAINT; const cc = surf('concrete');
const objs = D.objects || D.throwables;
const ob = (id) => (D.objects || []).find(o => o.id === id);
for (const id of ['bus', 'car']) {
  const obj = ob(id);
  for (const [anchor, own] of [['bolted', true], ['friction', true], ['bolted', false]]) {
    const c = ctx(1e6, { anchor, ownRecoil: own, use: Infinity });
    const r = P.pull(c, obj);
    const o = { near: 5, surface: cc, body: c.body, m: c.body.m, anchor, ownRecoil: own, unbreakable: true, obj };
    const src = R.MOVES.pull.shake(r, o);
    const J = P.vToMomentum(r.vEnd, obj.m) + r.resist * r.t10m;
    const rope = obj.m * r.accel + r.resist;
    const srcF = P.impulseSource(cc, J, r.t10m);
    console.log(id, anchor, 'ownRecoil', own, 't10m', r.t10m.toFixed(3), 's  rope', (rope / 1e6).toFixed(2), 'MN ropeT', r.ropeT, ' counted:', !!src, ' shakeOff', R.shakeOff(R.MOVES.pull, o));
    console.log('   formula J', J.toExponential(3), ' ppv@5', (P.ppvAt(srcF, 5) * 1e3).toFixed(1), 'mm/s plasterReach', P.plasterReach(srcF).toFixed(1), 'm rattleReach', P.ppvReach(srcF, 1e-3).toFixed(1), 'm');
  }
}
