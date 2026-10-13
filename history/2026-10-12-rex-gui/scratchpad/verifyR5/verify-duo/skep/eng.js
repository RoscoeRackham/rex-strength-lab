global.window = {};
const L = __dirname + '/lab/src/';
const P = require(L + 'engine.js'); require(L + 'data.js');
const D = window.DINO_DATA;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const mk = (build, kg, sid, pw) => Object.assign({ F: kg * P.K.g, mode: 'comic', body: P.makeBody({ build, H: 3.048, m: 3007 }), surface: surf(sid), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, pw || {});
for (const sid of ['concrete', 'sand']) for (const ang of [30, 45, 75]) for (const lk of [3, 4, 5, 6, 7, 8, 9]) {
  const cA = mk('rex', 10 ** lk, sid), cB = mk('ollie', 10 ** lk, sid);
  const t = P.throwPartner(cA, cB, ang), r = t.r, f = r && r.flight;
  if (!f || !f.landed) { console.log(sid, ang, lk, 'no landing'); continue; }
  const holdsBranch = r.Eimpact > 4.184e9 && r.crater > 0;
  const lt = t.landToGround;
  console.log(sid.padEnd(8), String(ang).padStart(2), 'log' + lk, 'v=' + f.vImpact.toFixed(1), 'E=' + r.Eimpact.toExponential(2), 'crater=' + (r.crater || 0).toFixed(1),
    'page:' + (holdsBranch ? 'HOLDS' : 'GROUND-PROBLEM'), lt ? ('landToGround whole=' + lt.whole.toExponential(2) + ' ground=' + lt.J.toExponential(2) + ' supplied=' + lt.supplied.toExponential(2) + ' (' + (100 * lt.supplied / lt.whole).toFixed(0) + '% of whole, dn ' + lt.suppliedDown.toExponential(1) + ' sd ' + lt.suppliedSide.toExponential(1) + ')') : 'no landToGround');
}
