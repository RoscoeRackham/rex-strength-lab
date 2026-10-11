global.window = global.window || {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const DD = window.DINO_DATA, K = P.K, g = K.g;
const obj = (id) => DD.objects.find((o) => o.id === id);
const surf = (id) => DD.surfaces.find((s) => s.id === id);
const mk = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody({}), surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, o || {});
const B = { anchor: 'bolted', groundHolds: true };
// A. Baseball fastball 10 m across dial strengths: classical-but-destroyed region
for (const kg of [1e3, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11]) {
  const c = mk(Object.assign({ F: kg * g }, B));
  const L = P.catchLeg(c, c, obj('baseball'), 10, 'hard');
  const h = L.heat || {};
  console.log('baseball dial', kg.toExponential(0), 'kg:', L.result, 'vL', L.aim ? L.aim.vL.toExponential(3) : (L.vL || 0).toExponential(3), 'heat', h.kind, 'frac', h.frac && h.frac.toExponential(2), 'noseC', h.noseC && h.noseC.toExponential(2), 'F', L.catch ? L.catch.F.toExponential(2) : '-', 'baseballRatio', L.catch ? L.catch.baseballRatio.toExponential(2) : '-', L.fireball ? 'fireball ' + L.fireball.kind : '');
}
// B. T13b pyramid relativistic
{
  const c = mk({ F: 1e30 * g, anchor: 'bolted' });
  const L = P.catchLeg(c, c, obj('pyramid'), 10, 'hard');
  const fb = L.fireball, m = obj('pyramid').m;
  const gam = 1 + fb.E / (m * K.c * K.c);
  console.log('T13b', L.result, fb.kind, 'E', fb.E.toExponential(3), 'gamma', gam.toExponential(3), 'p', fb.p.toExponential(3), 'Earr', fb.Earr.toExponential(3), 'Fneed', fb.catch.Fneed.toExponential(3), 'Fcap', fb.catch.Fcap.toExponential(3), 'clean', fb.catch.clean, 'vL', L.vL);
  // relativistic snowplow: lump keeps p, E grows by mu c^2; internal (heat) energy = Mc^2 - (m+mu)c^2
  const mu = K.rho0 * obj('pyramid').area * 10;
  const E0 = fb.E + m * K.c * K.c, E1 = E0 + mu * K.c * K.c, pc = fb.p * K.c;
  const Mc2 = Math.sqrt(E1 * E1 - pc * pc);
  console.log('   swept air', mu.toExponential(3), 'kg; lump invariant mass/m', (Mc2 / (m * K.c * K.c)).toFixed(3), '-> heat in lump', ((Mc2 - (m + mu) * K.c * K.c)).toExponential(3), 'J =', ((Mc2 - (m + mu) * K.c * K.c) / (m * K.c * K.c)).toFixed(3), 'x its rest energy; classical E*x', (fb.E * 10 / fb.sweep).toExponential(3));
  console.log('   stress on its face if stopped by palms: Fneed/2 palms', (fb.catch.Fneed / 0.03).toExponential(3), 'Pa; over whole front', (fb.catch.Fneed / obj('pyramid').area).toExponential(3), 'Pa vs crush', obj('pyramid').crush);
}
// C. T15 pyramid across the planet
{
  const c = mk({ F: 1e17 * g, anchor: 'bolted', groundHolds: true });
  const L = P.catchLeg(c, c, obj('pyramid'), 2e7, 'easy');
  const o = obj('pyramid');
  console.log('T15', L.result, 'vL', L.aim.vL.toFixed(1), 'th', L.aim.thetaDeg.toFixed(2), 't min', (L.time / 60).toFixed(2), 'vArr', L.vArrive.toFixed(0), 'angle', L.angleDeg.toFixed(1), 'heat', L.heat.kind, 'frac', L.heat.frac.toExponential(3), 'heatLoad', L.heat.heatLoad.toExponential(3), 'qMax', L.flight.qMax.toExponential(3), 'F', L.catch.F.toExponential(3), 'grip', L.catch.gripRatio.toExponential(3), 'plate', L.catch.plateNeeded.toExponential(3), 'apex km', (L.flight.apex / 1e3).toFixed(0));
  console.log('   ram pressure at launch rho v^2', (K.rho0 * L.aim.vL ** 2).toExponential(3), 'Pa vs crush', o.crush, '-> x', (K.rho0 * L.aim.vL ** 2 / o.crush).toFixed(2), '; at arrival', (K.rho0 * L.vArrive ** 2 / o.crush).toFixed(2));
  console.log('   stress over whole front at catch F/A', (L.catch.F / o.area).toExponential(3), 'Pa =', (L.catch.F / o.area / o.crush).toExponential(3), 'x crush; plate side km', (Math.sqrt(L.catch.plateNeeded) / 1e3).toFixed(1), 'vs pyramid base ~230 m');
  // drag energy dumped in the air
  const Ed = 0.5 * o.m * (L.aim.vL ** 2 - L.vArrive ** 2);
  console.log('   drag energy (launch-arrival KE difference, same height)', Ed.toExponential(3), 'J =', (Ed / 4.184e15).toFixed(1), 'Mt TNT; catch energy', (0.5 * o.m * L.vArrive ** 2).toExponential(3), 'J =', (0.5 * o.m * L.vArrive ** 2 / 4.184e15).toFixed(1), 'Mt');
  // Tauber-Sutton radiative heating (extrapolated): q = C Rn^a rho^b f(V), W/cm^2
  const fV = [[9000, 1.5], [9250, 4.3], [9500, 9.7], [9750, 19.5], [10000, 35], [10250, 55], [10500, 81], [10750, 115], [11000, 151]];
  const f = (v) => { for (let i = 1; i < fV.length; i++) if (v <= fV[i][0]) { const [a, fa] = fV[i - 1], [b, fb] = fV[i]; return fa + (fb - fa) * (v - a) / (b - a); } return 151; };
  const v = L.aim.vL, rho = K.rho0, Rn = Math.sqrt(o.area / Math.PI);
  const a = Math.min(1, 1.072e6 * Math.pow(v, -1.88) * Math.pow(rho, -0.325));
  const qr = 4.736e4 * Math.pow(Rn, a) * Math.pow(rho, 1.22) * f(v) * 1e4;
  const qc = 1.7415e-4 * Math.sqrt(rho / Rn) * v ** 3;
  console.log('   at launch: Rn', Rn.toFixed(1), 'm; convective (S-G)', qc.toExponential(3), 'W/m2; radiative (Tauber-Sutton, extrapolated to sea level)', qr.toExponential(3), 'W/m2; ratio', (qr / qc).toFixed(0));
}
