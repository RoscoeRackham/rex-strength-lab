const { P, g, M, surf, obj, rex, ON, ctxOf } = require('./env.js');
const sf = process.argv[2] || 'sand', ang = +(process.argv[3] || 45), oid = process.argv[4] || 'car';
const fmt = (x) => x == null ? '-' : Number(x).toPrecision(4);
const pw = Object.assign({}, ON, { ownRecoil: false, surface: surf(sf) });
let prev = null; const drops = [];
for (let lg = 1.5; lg <= 12; lg += 0.02) {
  const c = ctxOf(Math.pow(10, lg) * g, pw), r = P.throwObject(c, obj(oid), ang), tg = r.toGround;
  if (!tg || !(tg.J > 0)) { prev = null; continue; }
  const src = P.impulseSource(c.surface, tg.J, Math.max(1e-9, tg.T)), v5 = P.ppvAt(src, 5), pr = P.plasterReach(src);
  const cur = { lg, J: tg.J, T: tg.T, v5, pr, sd: tg.suppliedSide, dn: tg.suppliedDown, pt: r.push && r.push.t };
  if (prev) for (const k of ['J', 'v5', 'pr']) if (cur[k] < prev[k] * (1 - 1e-9)) drops.push(k + ' ' + prev.lg.toFixed(2) + '->' + lg.toFixed(2) + ' ' + fmt(prev[k]) + '->' + fmt(cur[k]) + ' T ' + fmt(prev.T) + '->' + fmt(cur.T) + ' sd ' + fmt(cur.sd));
  if (Math.abs(lg * 2 - Math.round(lg * 2)) < 1e-6) console.log(lg.toFixed(1), 'J', fmt(tg.J), 'T', fmt(tg.T), 'whole', fmt(tg.whole), 'sd', fmt(tg.sd), 'dn', fmt(tg.suppliedDown), 'v5 mm/s', fmt(v5 * 1000), 'plaster', fmt(pr), 'recoilV', fmt(r.recoilV));
  prev = cur;
}
console.log('drops', drops.length); console.log(drops.slice(0, 12).join('\n'));
