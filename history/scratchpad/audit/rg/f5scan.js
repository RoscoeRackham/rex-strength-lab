const { P, D, g, ctx, ctxO, obj } = require('./h.js');
const cR = ctx({ logKg: 30, groundHolds: true }), cO = ctxO({ logKg: 30, groundHolds: true });
const h0 = cR.body.releaseHeight, hStop = cO.body.releaseHeight;
const out = [];
for (const o of D.objects.filter((x) => !x.noThrow)) for (const ld of [2, 3, 4, 5, 6, 6.5, 7, 7.31]) {
  const Dd = Math.max(P.catchMinD(cR.body, cO.body, o), Math.min(Math.PI * 6371000, Math.pow(10, ld)));
  const a = P.catchLeg(cR, cO, o, Dd, 'easy');
  if (a.result !== 'no-arc') continue;
  const fl = (v, th) => P.flyTo({ v0: v, thetaDeg: th, h0, hStop, m: o.m, A: o.area, Cd: o.Cd, CdSup: o.CdSup, Rn: Math.sqrt(o.area / Math.PI) });
  let best = null;
  for (let th = 5; th <= 85; th += 5) {
    for (let lv = 2; lv <= 6.47; lv += 0.01) {
      const v = Math.pow(10, lv); const f = fl(v, th);
      if (f.landed && !f.belowStop && f.range >= a.Dfl) { if (!best || v < best.v) best = { th, v, q: 1.225 * v * v, crush: o.crush }; break; }
      if (f.escaped || f.orbit || f.timedOut || f.relativistic) break;
    }
  }
  out.push([o.id, ld, a.thetaDeg && a.thetaDeg.toFixed(1), a.vL && a.vL.toExponential(2), best ? best.th + '@' + best.v.toExponential(2) + ' q/crush ' + (best.crush ? (best.q / best.crush).toExponential(1) : '-') : 'none']);
}
out.forEach((r) => console.log(r.join(' | ')));
