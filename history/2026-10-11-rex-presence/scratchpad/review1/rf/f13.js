const { P, D, g, surf, obj, ctx, rex, ollie } = require('./lib.js');
for (const sid of ['sand', 'gravel']) for (const [n, b] of [['rex', rex()], ['ollie', ollie()]]) {
  const st = P.walkStep(b, surf(sid), { pace: 'walk', effort: 0 });
  console.log(sid, n, 'pressure kPa', (st.pressure / 1e3).toFixed(0), 'q kPa', (st.q / 1e3).toFixed(1), 'ratio', st.ratio.toFixed(2), 'footprint', JSON.stringify(st.footprint));
}
// how ratio >1 is shown elsewhere: lift groundStatus
console.log(surf('sand'));
