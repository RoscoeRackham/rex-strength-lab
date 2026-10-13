const { P, ctx, obj, K } = require('./common');
const ollie = P.makeBody({ build: 'ollie', H: P.DEFAULT_BODIES.ollie.H, m: P.DEFAULT_BODIES.ollie.m });
const kg = Math.pow(10, 23.2587);
for (const D of [12500, 20000, 100000]) {
  const cR = ctx(kg), cO = ctx(kg, { body: ollie });
  const L = P.catchLeg(cR, cO, obj('baseball'), D, 'hard');
  if (L.result !== 'hits-ground') { console.log('D', D, L.result); continue; }
  const th = L.aim.thetaDeg, hg = L.hitsGround;
  // independent: march along the straight line from the release point until it meets the sphere
  const h0 = L.h0, R = K.R_E, a = th * Math.PI / 180;
  let x = 0, y = R + h0; const ux = Math.cos(a), uy = Math.sin(a);
  let s = 0, ds = 0.01;
  while (Math.hypot(x, y) > R) { x += ux * ds; y += uy * ds; s += ds; }
  const phi = Math.atan2(x, y);   // central angle
  const hitAt = R * phi;
  // angle below local horizontal at hit point: radial unit = (x,y)/r; component of direction along -radial
  const r = Math.hypot(x, y), down = -(ux * x + uy * y) / r;
  const impact = Math.asin(down) * 180 / Math.PI;
  // crater ratio sin^(1/3)
  const ratio = Math.cbrt(Math.sin(Math.max(1e-3, -th) * Math.PI / 180) / Math.sin(impact * Math.PI / 180));
  console.log('D', D, 'aim th', th.toFixed(4), 'deg; engine hitAt', hg.at.toFixed(1), 'm; marched', hitAt.toFixed(1), 'm; true impact angle', impact.toFixed(4), 'deg; code uses', Math.max(1e-3, -th).toFixed(4), 'deg; |a| - hitAt/R', (-th - hg.at / R * 180 / Math.PI).toFixed(4), '; crater overstated x', ratio.toFixed(3), 'engine crater', hg.crater.toFixed(0));
}
