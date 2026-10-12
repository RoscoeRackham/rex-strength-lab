const { P, D, g, surf, obj, rex, ollie, ctxOf } = require('./common.js');
const sand = surf('sand');
for (const tau of [0.2, 0.3, 0.5]) {
  const src = P.vibSource(sand, 'ramp', 0.55*3000*g, tau);
  console.log('model elephant ramp tau', tau, 'PPV@20m mm/s', (P.ppvAt(src,20)*1000).toPrecision(2), 'x measured', (P.ppvAt(src,20)/P.elephantPPV(20)).toPrecision(2));
}
// lab sand vs firmer sandy ground (c_s 250)
const st = P.walkStep(rex, sand, {pace:'walk', effort:0.5});
const firm = { rho: 1800, cs: 250, xi: 0.03 };
const ppvF = (d) => Math.max(...st.src.map(s => P.ppvAt(Object.assign({}, s, {ground: firm}), d)));
console.log('Rex ordinary walk on lab sand @20 m', (P.ppvAt(st.src,20)*1000).toPrecision(2), 'x elephant', (P.ppvAt(st.src,20)/P.elephantPPV(20)).toPrecision(2), '; on c_s 250 ground', (ppvF(20)*1000).toPrecision(2), 'x', (ppvF(20)/P.elephantPPV(20)).toPrecision(2));
