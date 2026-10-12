global.window = {};
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
const rex = P.makeBody({ H: 3.048, m: 3007, build: 'rex' });
const S = (id) => D.surfaces.find((s) => s.id === id);
const TH = P.VIB.TH;
for (const id of ['concrete', 'sand', 'stiffclay', 'granite']) {
  const sf = S(id), o = { pace: 'walk' };
  const pr = P.presence(rex, sf, Object.assign({ effort: 0 }, o));
  const st = pr.step;
  // what share of the vertical PPV at 3 m comes from the near field? ratio near/far terms for each source
  const vert3 = pr.ppv(3);
  const eV = P.walkEffortFor(rex, sf, o, TH.shimmer, 3);
  const eH068 = P.walkEffortFor(rex, sf, o, TH.shimmer / 0.68, 3);   // Rayleigh far field H/V 0.68
  const eH033 = P.walkEffortFor(rex, sf, o, TH.shimmer / (1/3), 3);  // quasi-static near field H/V 1/3
  console.log(id, 'soft PPV@3m mm/s', (vert3*1000).toFixed(3), '| shimmer effort vertical', eV.toFixed(3), 'if H=0.68V', eH068.toFixed(3), 'if H=V/3', eH033.toFixed(3),
    '| shimmer reach (vertical) m', P.ppvReach(st.src, TH.shimmer).toFixed(1), 'H=0.68V', P.ppvReach(st.src, TH.shimmer/0.68).toFixed(1), 'H=V/3', P.ppvReach(st.src, TH.shimmer*3).toFixed(1));
  // elephant comparison at 20 m
  console.log('   elephant ratio at 20 m (soft-footed):', (pr.ppv(20) / P.elephantPPV(20)).toFixed(2), ' ordinary:', (P.presence(rex, sf, Object.assign({ effort: 0.5 }, o)).ppv(20) / P.elephantPPV(20)).toFixed(2));
  // which term dominates at 3 m for each source
  for (const s of st.src) {
    const { rho, cs } = s.ground, T = s.kind === 'ramp' ? s.tau : s.T, r = 3;
    const near = (s.kind === 'ramp' ? 0.1875 : 0.375) * s.F / (rho * cs * cs * T * r), far = (s.kind === 'ramp' ? 0.181 : 0.620) * s.F / (rho * Math.pow(cs, 2.5) * Math.pow(T, 1.5) * Math.sqrt(r));
    console.log('   ', s.kind, 'near', (near*1000).toFixed(4), 'far', (far*1000).toFixed(4), 'x=r/(cs T)=', (r/(cs*T)).toFixed(2));
  }
}
