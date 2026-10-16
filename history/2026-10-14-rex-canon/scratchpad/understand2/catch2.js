const { P, g, sig, rex, ollie, ctx, ppv, ob, F0 } = require('./h.js');
const pk = (k) => ({ clean: k.clean, slips: k.slips, F: sig(k.F), Fneed: sig(k.Fneed), decelG: sig(k.decelG), uAfter: sig(k.uAfter), slide: sig(k.slide), R: sig(k.R), tStroke: sig(k.tStroke), forced: k.forced, baseballRatio: sig(k.baseballRatio), gripRatioRaw: sig(k.gripRatioRaw), wholeFront: sig(k.wholeFront), sinkRatio: sig(k.sinkRatio), sinkRatioRaw: k.sinkRatioRaw && sig(k.sinkRatioRaw), carried: k.carried, Ecatch: sig(k.Ecatch), vSlam: sig(k.vSlam) });
// fastball as the leg sees it: vArrive 22360, angle 0
for (const [lbl, F] of [['1e9', 1e9 * g]]) for (const anchor of ['friction', 'bolted']) {
  const c = ctx({ F, anchor }, ollie);
  console.log('fastball catchIt', lbl, anchor, JSON.stringify(pk(P.catchIt(c, ob('baseball'), 22360, 0, null))));
}
// test line 370: car at 60 m/s 10 deg at 1e6 dial, ownRecoil only
for (const anchor of ['friction', 'bolted']) {
  const c = Object.assign({ F: 1e6 * g, mode: 'comic', body: ollie, surface: P ? require('./h.js').sf('concrete') : null, anchor });
  console.log('car 60 m/s 10deg catchIt', anchor, JSON.stringify(pk(P.catchIt(c, ob('car'), 60, 10, null))));
}
// car catch leg 30 m at 1e6 all on vs bolted catcher
for (const [label, ex] of [['all on', {}], ['all on, catcher bolted', { anchor: 'bolted' }]]) {
  const cR = ctx({ F: 1e6 * g }), cO = ctx(Object.assign({ F: 1e6 * g }, ex), ollie);
  const L = P.catchLeg(cR, cO, ob('car'), 30, 'hard');
  console.log('car leg 30 m 1e6', label, L.result, JSON.stringify(pk(L.catch)), 'vArrive', sig(L.vArrive), 'angle', sig(L.angleDeg), 'toGroundC', JSON.stringify(L.toGroundC), 'bursts', L.bursts);
}
// game at default dial, baseball & car, check where 'slams' could appear when bolted
for (const oid of ['baseball', 'car', 'piano', 'person']) for (const lg of [5, 7, 9, 12, 15]) for (const style of ['easy', 'hard']) {
  const F = Math.pow(10, lg) * g;
  const cR = ctx({ F }), cOf = ctx({ F }, ollie), cOb = ctx({ F, anchor: 'bolted' }, ollie);
  const Lf = P.catchLeg(cR, cOf, ob(oid), 30, style), Lb = P.catchLeg(cR, cOb, ob(oid), 30, style);
  if (Lf.result !== Lb.result || Lf.bursts !== Lb.bursts || (Lf.catch && Lb.catch && (Lf.catch.sinkRatio > 1) !== (Lb.catch.sinkRatio > 1))) console.log('DIFF', oid, lg, style, Lf.result, Lb.result, Lf.bursts, Lb.bursts);
}
console.log('done');
