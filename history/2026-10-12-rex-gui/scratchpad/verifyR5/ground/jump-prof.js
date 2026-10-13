const { P, g, M, surf, rex, ON, ctxOf } = require('./env.js');
const sf = process.argv[2] || 'sand', pw = process.argv[3] === 'unb' ? { unbreakable: true } : ON;
const fmt = (x) => x == null ? '-' : Number(x).toPrecision(4);
console.log('lg | v up | L.v | L.t | ratioReal | body J (cap) of m v | feet J | pushOff J/T | ppv5 body feet po | plaster land | total ppv5 | apex');
for (let lg = 3; lg <= 12.6; lg += 0.4) {
  const c = ctxOf(Math.pow(10, lg) * g, Object.assign({}, pw, { surface: surf(sf) })), r = P.jump(c), L = r.landing;
  const o = Object.assign({ surface: c.surface, body: rex, m: rex.m }, pw), src = M.jump.shake(r, o) || [];
  const list = Array.isArray(src) ? src : [src];
  const mv = P.vToMomentum(L.v, rex.m), Jb = Math.min(mv, r.landBear * L.t);
  const ppv = list.map((s) => fmt(P.ppvAt(s, 5) * 1000));
  console.log(lg.toFixed(1), fmt(r.v), fmt(L.v), fmt(L.t), fmt(r.landRatioReal), fmt(Jb), 'of', fmt(mv), '|', fmt(2 * rex.legEff * L.v), '|', fmt(r.pushOff && r.pushOff.J) + '/' + fmt(r.pushOff && r.pushOff.T), '|', ppv.join(' '), '|', fmt(L.landed && L.v > 0 ? P.plasterReach(list.slice(0, 2)) : 0), '|', fmt(P.ppvAt(src, 5) * 1000), '|', fmt(r.flight.apex));
}
