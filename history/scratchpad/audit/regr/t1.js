const { P, D, g, surf, obj, V, C } = require('./h.js');
const res = [];
const objs = D.objects.filter((o) => !o.noThrow);
for (const [H, oH] of [[500, 0.1], [0.1, 500], [500, 500], [2, 2]]) for (const o of objs) for (const ld of [0, 1, 2, 3, 4, 5, 6, 7, 7.31]) for (const lg of [4.96, 12, 20]) for (const style of ['easy', 'hard']) {
  const cR = C({ kg: Math.pow(10, lg), H, m: 1000 * P.bodyVolume(H) }), cO = C({ kg: Math.pow(10, lg), H: oH, m: 1000 * P.bodyVolume(oH) });
  const Dmin = P.catchMinD(cR.body, cO.body, o);
  const Dd = Math.max(Dmin, Math.pow(10, ld));
  const t0 = Date.now();
  let r; try { r = P.catchGame(cR, cO, o, Dd, style); } catch (e) { console.log('THROW', H, oH, o.id, ld, lg, style, e.message); continue; }
  const dt = Date.now() - t0;
  res.push([dt, `H${H}/${oH} ${o.id} D10^${ld} lg${lg} ${style} -> ${r.a.result}/${r.b.result}`]);
}
res.sort((a, b) => b[0] - a[0]);
for (const r of res.slice(0, 25)) console.log(r[0] + 'ms', r[1]);
console.log('n', res.length, 'over 1s', res.filter((r) => r[0] > 1000).length, 'over 2s', res.filter((r) => r[0] > 2000).length);
