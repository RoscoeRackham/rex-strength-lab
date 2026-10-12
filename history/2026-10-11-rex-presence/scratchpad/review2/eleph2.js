const { P, D, g, surf, obj, rex, ollie, ctxOf } = require('./common.js');
for (const tau of [0.05, 0.1]) {
  const firm = P.ppvAt({ kind: 'ramp', F: 10e3, tau, ground: { rho: 1800, cs: 280, xi: 0.03 } }, 20);
  const labSand = P.ppvAt({ kind: 'ramp', F: 10e3, tau, ground: P.VIB.GROUND.sand }, 20);
  console.log('tau', tau, 'test ground (cs 280) um/s', (firm * 1e6).toFixed(1), '| lab sand (cs 120) um/s', (labSand * 1e6).toFixed(1), 'ratio', (labSand / firm).toFixed(1), '| x measured anchor', (labSand / P.elephantPPV(20)).toFixed(1));
}
// Rex at 20 m on cs 280 ground vs lab sand
const st = P.walkStep(rex, surf('sand'), { pace: 'walk', effort: 0 });
const on = (G) => Math.max(...st.src.map((s) => P.ppvAt(Object.assign({}, s, { ground: G }), 20)));
console.log('Rex soft-footed at 20 m: lab sand', (on(P.VIB.GROUND.sand) / P.elephantPPV(20)).toFixed(1), 'x elephant; on the test\'s cs 280 ground', (on({ rho: 1800, cs: 280, xi: 0.03 }) / P.elephantPPV(20)).toFixed(1), 'x');
