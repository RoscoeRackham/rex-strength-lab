global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const ks = Object.keys(P).filter(k => /fall|weight|settle|ground/i.test(k)); console.log(ks);
for (const m of [5e8, 1e9, 2e9, 7.0555e9, 1e10, 2e10, 5e10, 1e11, 3e11, 1e12]) {
  const body = P.makeBody({ H: 3.048, m, build: 'rex' });
  const f = (P.fallThrough || P.W8 && P.W8.fallThrough)(body, { full: true, record: true });
  if (!f.stuck) { console.log(m, 'no stuck', f.firstPass && f.firstPass.depthShort); continue; }
  const s = f.stuck;
  // independent: final position in rotating frame from path end
  const pe = f.path[f.path.length - 1];
  const ang = Math.atan2(pe[1], pe[0]) * 180 / Math.PI;
  console.log(m.toExponential(2), 'r km', (s.r / 1000).toFixed(2), 'lon', s.lonDeg.toFixed(1), 'path end ang', ang.toFixed(1), 'farSide', s.farSide, 'passed', s.passedCentre, 'driftKm', s.driftKm.toFixed(3), 'minR km', (f.minR / 1000).toFixed(2));
}
