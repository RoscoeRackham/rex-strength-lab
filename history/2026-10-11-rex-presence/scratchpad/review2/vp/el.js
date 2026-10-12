const { P, D, g, surf, obj, rex, ollie, ctxOf } = require('./lib.js');
const sand = P.VIB.GROUND.sand, firm = { rho: 1800, cs: 280, xi: 0.03 };
for (const tau of [0.05, 0.1]) for (const [nm, gr] of [['firm280', firm], ['labsand', sand]]) {
  const v = P.ppvAt({ kind: 'ramp', F: 10e3, tau, ground: gr }, 20);
  console.log('10kN ramp', tau, nm, (v * 1e6).toFixed(1), 'um/s', (v / 5e-6).toFixed(1) + 'x anchor');
}
// elephant forefoot: 0.55 * 3000 kg * g, rise 0.2-0.5 s
for (const tau of [0.2, 0.35, 0.5]) for (const [nm, gr] of [['firm280', firm], ['labsand', sand]]) {
  const v = P.ppvAt({ kind: 'ramp', F: 0.55 * 3000 * g, tau, ground: gr }, 20);
  console.log('eleph forefoot ramp', tau, nm, (v * 1e6).toFixed(1), 'um/s', (v / 5e-6).toFixed(2) + 'x anchor');
}
// Rex soft-footed and ordinary on lab sand and on firm 280 ground
for (const e of [0, 0.5]) for (const d of [3, 20]) {
  const pr = P.presence(rex, surf('sand'), { pace: 'walk', effort: e });
  const st = pr.step;
  const srcFirm = st.src.map(s => Object.assign({}, s, { ground: firm }));
  const vS = pr.ppv(d), vF = P.ppvAt(srcFirm, d);
  const dE = d >= 5 ? d : 20;
  console.log('rex e', e, 'd', d, 'labsand ratio', (pr.ppv(dE) / P.elephantPPV(dE)).toFixed(1), 'firm ratio', (P.ppvAt(srcFirm, dE) / P.elephantPPV(dE)).toFixed(1),
    'ramp only labsand', (P.ppvAt(st.src[1], dE) / P.elephantPPV(dE)).toFixed(1));
  // model-to-model: model elephant on the same ground (forefoot 0.55*3000g ramp 0.2-0.5)
  for (const tau of [0.2, 0.5]) { const ve = P.ppvAt({ kind: 'ramp', F: 0.55 * 3000 * g, tau, ground: sand }, dE); console.log('     model-to-model labsand tau', tau, (pr.ppv(dE) / ve).toFixed(1)); }
}
