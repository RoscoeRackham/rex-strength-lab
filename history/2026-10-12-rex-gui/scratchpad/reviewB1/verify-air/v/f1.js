const { P, obj, rex, ollie, ctx, K } = require('./env.js');
const kg = 1.81436948e23, b = obj('baseball');
for (const D of [1e3, 5e3, 2e4, 1e5, 1e6, 2e7]) {
  const T = ctx(kg, rex()), C = ctx(kg, ollie());
  const L = P.catchLeg(T, C, b, D, 'hard');
  const h0 = L.h0, hs = L.hStop, R = K.R_E, th = L.aim ? L.aim.thetaDeg : L.thetaDeg;
  // height above ground of the line from h0 at angle th, at ground distance D (exact, sphere)
  const a = th * Math.PI / 180, r0 = R + h0, phi = D / R;
  // ray: (r0 cos(a) t ...). In plane: start at (0, r0); dir (cos a, sin a). Point at angle phi from centre: solve
  // dir in polar: intersection with ray at polar angle phi: r = r0 cos(a) / cos(phi + a)?? use parametric
  const ang = (t) => { const x = t * Math.cos(a), y = r0 + t * Math.sin(a); return [Math.atan2(x, y), Math.hypot(x, y) - R]; };
  let lo = 0, hi = 4 * R; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; const [p] = ang(m); if (p < phi && m * Math.cos(a) > 0 && ang(m)[0] >= 0) lo = m; else hi = m; }
  const [, hAt] = ang(lo);
  // min height along the line up to there
  let hmin = Infinity; for (let i = 0; i <= 2000; i++) { const [, hh] = ang(lo * i / 2000); hmin = Math.min(hmin, hh); }
  // chord between hands at equal heights
  const chordLow = (R + h0) * Math.cos(phi / 2) - R, chordAng = -phi / 2 * 180 / Math.PI;
  console.log(`D=${D} result=${L.result} fast=${!!L.fast} aim=${th.toFixed(4)}deg time=${(L.time*1e3).toFixed(3)}ms` +
    ` | engine line at D: ${hAt.toFixed(2)} m above ground (hands at ${hs.toFixed(3)}), lowest ${hmin.toFixed(2)} m` +
    ` | chord: aim ${chordAng.toFixed(4)}deg, lowest ${chordLow.toFixed(2)} m, chord time ${(2*(R+h0)*Math.sin(phi/2)/L.vArrive*1e3).toFixed(3)} ms`);
}
