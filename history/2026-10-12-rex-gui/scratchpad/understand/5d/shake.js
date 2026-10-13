global.window = {};
const P = require('./engine-head.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g, c = P.K.c;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const imp = (s, J, T) => P.vibSource(s, 'hann', 2 * J / T, T);
console.log('groundOf ice', P.groundOf(surf('ice')), 'steel', P.groundOf(surf('steel')));
console.log('rex armMass whip', rex.whipEff, 'handEff', rex.handEff, 'digArea', rex.digArea, 'footArea', rex.footArea, 'legEff', rex.legEff, 'strokes', JSON.stringify(rex.strokes));
// bus at 45 deg, ice surface, bolted, at the old ceiling's use 22,753 kg and all-out at 1e5
for (const sid of ['ice', 'concrete', 'sand', 'granite']) for (const u of [22753.05 * g, undefined]) {
  const ctx = { F: 1e5 * g, use: u, mode: 'comic', body: rex, surface: surf(sid), groundHolds: false, anchor: 'bolted' };
  const r = P.throwObject(ctx, obj('bus'), 45);
  const J = r.push.pB - r.push.pA, T = r.push.t;
  const src = imp(surf(sid), J, T);
  console.log(sid, u ? 'use ' + (u / g).toFixed(0) : 'allout', 'basis', r.basis || 'comic', 'v', r.v.toFixed(3), 'J', J.toFixed(0), 'T', T.toFixed(4), 'Fpeak', src ? src.F.toExponential(3) : null, 'ppv5 mm/s', src ? (P.ppvAt(src, 5) * 1e3).toFixed(3) : 'not modelled', 'rattle reach', src ? P.ppvReach(src, P.VIB.TH.rattle).toFixed(2) : '-', 'plaster reach', src ? P.plasterReach(src).toFixed(2) : '-', 'plasterOver5', src ? P.plasterOver(src, 5) : '-', 'feel reach', src ? P.ppvReach(src, P.VIB.TH.feel).toFixed(1) : '-');
}
// friction version on concrete for comparison: the friction impulse R t into the ground (today uncounted)
for (const sid of ['concrete']) {
  const ctx = { F: 1e5 * g, use: 22753.05 * g, mode: 'comic', body: rex, surface: surf(sid), groundHolds: false, anchor: 'friction' };
  const r = P.throwObject(ctx, obj('bus'), 45);
  console.log('friction concrete', 'v', r.v, 'pB-pA', r.push.pB - r.push.pA, 'T', r.push.t, 'recoilV', r.recoilV);
}
// All-Star baseball
for (const sid of ['concrete', 'granite', 'sand']) {
  const ctx = { F: 1.8e23 * g, mode: 'comic', body: rex, surface: surf(sid), groundHolds: false, anchor: 'bolted' };
  const r = P.throwObject(ctx, obj('baseball'), 0);
  const J = r.push.pB - r.push.pA, T = r.push.t;
  const src = imp(surf(sid), J, T);
  const pBall = r.push.pB * obj('baseball').m / r.mB;
  console.log('ALLSTAR', sid, 'J', J.toExponential(4), 'T', T.toExponential(4), 'pBall', pBall.toExponential(4), 'arm share', (1 - obj('baseball').m / r.mB).toFixed(4), 'Fpk', src.F.toExponential(3), 'ppv5 m/s', P.ppvAt(src, 5).toExponential(3), 'ppv 1km', P.ppvAt(src, 1000).toExponential(3), 'ppv 6371km', P.ppvAt(src, 6.371e6).toExponential(3), 'plaster reach m', P.plasterReach(src).toExponential(3), 'feel reach', P.ppvReach(src, P.VIB.TH.feel).toExponential(3), 'nonlinear at 5', P.ppvNonlinear(src, 5), 'earth dv', (pBall / P.K.M_E).toExponential(3), 'Eearth', (pBall*pBall/2/P.K.M_E).toExponential(3), 'Eobj', r.Eobj.toExponential(4));
}
