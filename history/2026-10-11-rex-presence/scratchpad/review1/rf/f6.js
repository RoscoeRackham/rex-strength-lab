const { P, D, g, surf, obj, ctx, rex, ollie } = require('./lib.js');
const b = rex(), s = surf('softclay');
for (const e of [0, 0.5, 0.75, 1]) {
  const st = P.walkStep(b, s, { pace: 'walk', effort: e });
  console.log('e', e, 'footArea', b.footArea.toFixed(3), 'Fpeak', st.Fpeak.toFixed(0), 'peakP kPa', (st.peakPressure/1e3).toFixed(0), 'q kPa', (st.q/1e3).toFixed(0), 'peakRatio', st.peakRatio.toFixed(2), 'ratio', st.ratio.toFixed(2), 'pressure kPa', (st.pressure/1e3).toFixed(0), 'footprint', JSON.stringify(st.footprint), 'PPV@3 mm/s', (1e3*P.ppvAt(st.src,3)).toFixed(2));
}
// stomp at foot speed 3.72 m/s on soft clay
for (const kg of [Math.pow(10, 2.65), 448]) {
  const r = P.stomp(ctx({ surface: s, use: kg * g }));
  console.log('stomp', kg.toFixed(0), 'kg vFoot', r.vFoot.toFixed(2), 'holeDepth', r.holeDepth, 'crater', r.crater);
}
