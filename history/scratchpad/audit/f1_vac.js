const P = require('/home/user/dino-strength-sim/src/engine.js');
const GM = P.K.GM, R = P.K.R_E;
function radialRoundTrip(v) { // exact radial Kepler: from r=R up to apex and back
  const eps = v * v / 2 - GM / R; if (eps >= 0) return Infinity;
  const a = -GM / (2 * eps); const eta0 = Math.acos(1 - R / a);
  return 2 * Math.sqrt(a ** 3 / GM) * (Math.PI - (eta0 - Math.sin(eta0)));
}
console.log('v_esc(R) =', Math.sqrt(2 * GM / R).toFixed(2));
for (const v of [11000, 11140, 11150, 11160, 11180, 11185]) {
  const f = P.fly({ v0: v, thetaDeg: 90, h0: 0, m: 1, A: 1, Cd: 0 });
  console.log(v, 'analytic round trip d', (radialRoundTrip(v) / 86400).toFixed(2), '| engine timedOut', f.timedOut, 'escaped', f.escaped, 'time d', (f.time / 86400).toFixed(2), 'vImpact', f.vImpact.toFixed(1), 'apex', f.apex.toExponential(3));
}
// step cap case
const f = P.fly({ v0: 8000, thetaDeg: 0, h0: 1.8, m: 1, A: 1, Cd: 0 });
const a = 1 / (2 / (R + 1.8) - 64e6 / GM);
console.log('stepcap case: steps', f.steps, 'timedOut', f.timedOut, 'escaped', f.escaped, 'vImpact', f.vImpact, 'range km', (f.range / 1e3).toFixed(0), 'time h', (f.time / 3600).toFixed(2), '| analytic period h', (2 * Math.PI * Math.sqrt(a ** 3 / GM) / 3600).toFixed(3), 'laps', (f.time / (2 * Math.PI * Math.sqrt(a ** 3 / GM))).toFixed(2));
