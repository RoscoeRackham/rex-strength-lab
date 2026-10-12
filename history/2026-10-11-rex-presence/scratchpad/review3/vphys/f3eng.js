global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: P.DEFAULT_BODIES.ollie.H, m: P.DEFAULT_BODIES.ollie.m });
const surf = (id) => D.surfaces.find((s) => s.id === id);
function coast(M, u, R, k) { if (!isFinite(R) || !(u > 0)) return 0; return k > 0 ? M / (2 * k) * Math.log1p(k * u * u / R) : M * u * u / (2 * R); }
for (const [kg, s, anchor] of [[Math.pow(10, 5.4771), 'concrete', 'friction'], [Math.pow(10, 5.4771), 'concrete', 'bolted'], [1e6, 'granite', 'friction'], [1e5, 'concrete', 'friction'], [3e4, 'concrete', 'friction']]) {
  const cA = { F: kg * g, mode: 'comic', body: rex, surface: surf(s), groundHolds: false, anchor };
  const cB = Object.assign({}, cA, { body: ollie, anchor: 'friction' });
  const t = P.throwPartner(cA, cB, 45);
  const sh = P.RESTRAINT.MOVES.throw.shake(t.r, { obj: t.obj, surface: surf(s), body: rex });
  const ppv5 = P.ppvAt(sh, 5);
  const Rs = P.anchorCapacity({ body: rex, surface: surf(s), theta: 0, anchor, groundHolds: false }).R;
  const sl = coast(rex.m, t.r.recoilV * Math.cos(Math.PI / 4), Rs, 0.5 * P.K.rho0 * rex.Cd * rex.frontArea);
  console.log(s, anchor, (kg / 1000).toFixed(0) + ' t', 'range', t.r.flight.range.toFixed(1), 'vImpact', t.r.flight.vImpact.toFixed(1), 'ppv5 mm/s', (ppv5 * 1000).toFixed(1), 'Hz', (1 / sh.T).toFixed(1), sh.kind, 'plasterOver', P.plasterOver(sh, 5), 'reach', P.plasterReach(sh).toFixed(1), '| recoilV', t.r.recoilV.toFixed(2), 'lurch', (t.r.push.xA || 0).toFixed(2), 'coast', sl.toFixed(2), 'blast', P.RESTRAINT.MOVES.throw.blast(t.r));
}
