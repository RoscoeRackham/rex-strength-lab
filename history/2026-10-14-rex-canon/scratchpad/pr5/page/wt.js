global.window = {};
const M = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(M + '/src/engine.js'); require(M + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g, TB = P.RESTRAINT.takenBack;
const sf = (id) => D.surfaces.find((s) => s.id === id);
const DEF = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true };
const R3 = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), O3 = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
const c9 = (F, body, x) => Object.assign({ F, mode: 'comic', body: body || R3, surface: sf(process.argv[2] || 'concrete'), anchor: 'friction' }, DEF, x || {});
for (const lk of [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9]) for (const ang of [0, 20, 45, 70]) {
  const A = c9(Math.pow(10, lk) * g), B = c9(Math.pow(10, lk) * g, O3);
  const t = P.throwPartner(A, B, ang), r = t.r, f = r && r.flight;
  const tb = TB('wrestleThrow', t, { A, B, whoA: 'rex', angle: ang });
  if (!f) continue;
  const pageSays = f.landed && (t.landToGround || (r.Eimpact > 4.184e9 && r.crater > 0));
  if (tb.parts.footing > 0 || pageSays) console.log(lk, ang, 'crater', r.crater, 'Eimp', r.Eimpact.toExponential(2), 'landToGround', !!t.landToGround, 'footing', tb.parts.footing.toExponential(2), 'drag', tb.parts.drag, 'pageSaysHeld', pageSays);
}
