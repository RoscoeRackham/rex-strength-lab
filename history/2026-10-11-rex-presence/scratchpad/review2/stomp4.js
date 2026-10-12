const { P, D, g, surf, obj, rex, ollie, ctxOf } = require('./common.js');
const K = P.K, W = P.WALK;
const footPulse = (b) => 2 * W.STAMP.t * Math.sqrt(W.HIP * b.H / W.HS.h);
const vSt = (b) => Math.sqrt(2 * K.g * W.STAMP.thigh * b.H);
const stampMass = (b) => 0.5 * W.STAMP.kPeak * b.m * K.g * footPulse(b) / vSt(b);
console.log('legEff', rex.legEff.toFixed(0), 'stampMass', stampMass(rex).toFixed(0), 'ratio', (stampMass(rex) / rex.legEff).toFixed(2), 'vSt', vSt(rex).toFixed(2), 'footPulse', footPulse(rex).toFixed(4));
const variants = {
  engine: (r, b) => Math.max(b.legEff, stampMass(b)) * r.vFoot,
  legOnly: (r, b) => b.legEff * r.vFoot,
  capped: (r, b) => b.legEff * r.vFoot + (stampMass(b) - b.legEff) * Math.min(r.vFoot, vSt(b)),
};
for (const sid of ['concrete', 'sand']) {
  const c = ctxOf(1e9 * g, { surface: surf(sid) });
  for (const [name, J] of Object.entries(variants)) {
    const src = (r) => { const T = Math.max(footPulse(rex), 2 * (r.holeDepth || 0) / r.vFoot); return P.vibSource(surf(sid), 'hann', 2 * J(r, rex) / T, T); };
    const onset = (th) => P.threshold((u) => { const r = P.stomp(Object.assign({}, c, { use: u })); return r.vFoot > 0 && P.ppvAt(src(r), 5) >= th; }, 0.01 * rex.m * g, 1e12 * g);
    const pl = onset(P.VIB.TH.plaster), fe = onset(P.VIB.TH.feelOnce);
    const rp = P.stomp(Object.assign({}, c, { use: pl })), rf = P.stomp(Object.assign({}, c, { use: fe }));
    console.log(sid, name.padEnd(8), 'feel(goal) at', (fe / g).toPrecision(3), 'kg, vFoot', rf.vFoot.toPrecision(3), '| plaster at', (pl / g).toPrecision(3), 'kg, vFoot', rp.vFoot.toPrecision(3), 'vBody', rp.vBody.toPrecision(3));
  }
}
