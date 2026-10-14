const { P, g, M, surf, obj, rex, ON, ctxOf } = require(process.env.OFFP ? './env.js' : './env.js');
const fmt = (x) => x == null ? '-' : Number(x).toPrecision(5);
const [sf, ang, oid, a, b, st] = [process.argv[2], +process.argv[3], process.argv[4], +process.argv[5], +process.argv[6], +process.argv[7]];
const extra = JSON.parse(process.argv[8] || '{"ownRecoil":false}');
for (let lg = a; lg <= b + 1e-9; lg += st) {
  const c = ctxOf(Math.pow(10, lg) * g, Object.assign({}, ON, extra, { surface: surf(sf) })), r = P.throwObject(c, obj(oid), ang), tg = r.toGround;
  const src = tg && tg.J > 0 ? P.impulseSource(c.surface, tg.J, tg.T) : null;
  console.log(lg.toFixed(3), 'v', fmt(r.v), 'recoilV', fmt(r.recoilV), 'push.t', fmt(r.push && r.push.t), 'J', fmt(tg && tg.J), 'T', fmt(tg && tg.T), 'whole', fmt(tg && tg.whole), 'dn', fmt(tg && tg.suppliedDown), 'sd', fmt(tg && tg.suppliedSide), 'anchor', r.anchor && fmt(r.anchor.R), 'feel', fmt(src && P.ppvReach(src, P.VIB.TH.feel)), 'heldBack', r.heldBack, 'real?', r.real);
}
