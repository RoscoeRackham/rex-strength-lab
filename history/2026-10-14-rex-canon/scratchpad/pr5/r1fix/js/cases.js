const { P, D, g, R3, O3, c9, obj, PE, sig, TB, duo } = require('./common.js');
const dial = 100 * 907.18474 * g;
// 01 wrestle throw at 20 and 90
for (const th of [20, 45, 90]) { const A = c9(dial), B = c9(dial, O3), w = P.throwPartner(A, B, th), tb = TB('wrestleThrow', w, duo(A, B, 'rex', { angle: th })); console.log('wrestle', th, w.r && w.r.canMove, w.fallsBack, sig(tb.parts.drag), JSON.stringify(Object.keys(tb.parts).filter(k => tb.parts[k] > 0))); }
// 03 well-dominated leg, catcher recoil off
{ const B13 = P.makeBody({ build: 'rex', H: 3.048, m: 1e13 }), O13 = P.makeBody({ build: 'ollie', H: 3.06, m: 1e13 });
  for (const air of [1, 0.5]) {
  const A = c9(dial, B13, { airAbsorb: air }), C = c9(dial, O13, { ownRecoil: false, airAbsorb: air }), L = P.catchLeg(A, C, obj('baseball'), 10, 'hard');
  const A0 = c9(dial, B13, { airAbsorb: 0 }), C0 = c9(dial, O13, { ownRecoil: false, airAbsorb: 0 }), L0 = P.catchLeg(A0, C0, obj('baseball'), 10, 'hard');
  const tb = TB('catch', { a: L }, duo(A, C, 'rex', { obj: obj('baseball') }));
  console.log('well', air, L.result, L.wells.wellDominated, 'vL', L.aim && L.aim.vL, L0.aim && L0.aim.vL, 'drag', tb.parts.drag, 'L0 drag', L0.drag && L0.drag.E, L0.result, JSON.stringify(Object.keys(tb.parts).filter(k => tb.parts[k] > 0)));
  } }
// 05 slams and cant-hold-it
{ const A = c9(1e10 * g), B = c9(1e3 * g, O3), L = P.catchLeg(A, B, obj('baseball'), 10, 'hard'), tb = TB('catch', { a: L }, duo(A, B, 'rex', { obj: obj('baseball') }));
  console.log('slams', L.result, sig(L.catch && L.catch.Ecatch), JSON.stringify(tb.by.ollie.parts)); }
{ const A = c9(1e4 * g), B = c9(1e3 * g, O3), L = P.catchLeg(A, B, obj('car'), 10, 'easy'), tb = TB('catch', { a: L }, duo(A, B, 'rex', { obj: obj('car') }));
  console.log('cant-hold', L.result, sig(L.catch && L.catch.Ecatch), JSON.stringify(tb.by.ollie.parts)); }
// 06 toss slams
{ const A = c9(1e4 * g), B = c9(1e4 * g, O3), t = P.tossPartner(A, O3, 'Ollie', 'hard', 10, 'friction'), tb = TB('toss', t, duo(A, B, 'rex'));
  console.log('toss', t.result, sig(t.catch && t.catch.Ecatch), JSON.stringify(tb.by.rex.parts)); }
// 10 fullStrength lob
{ const F = Math.pow(10, 5.25) * g, A = c9(F), B = c9(F, O3, { ownRecoil: false }), L = P.catchLeg(A, B, obj('bus'), 31.6, 'easy'), tb = TB('catch', { a: L }, duo(A, B, 'rex', { obj: obj('bus') }));
  console.log('lob', L.result, L.fullStrength, L.style, sig(tb.parts.drag), JSON.stringify(Object.keys(tb.parts).filter(k => tb.parts[k] > 0))); }
// code-1 burns-up leg
{ const x = { keepForm: false, airAbsorb: 0.5, ownRecoil: false, noKnockback: false, safePassenger: false }, A = c9(1e11 * g, R3, x), B = c9(1e11 * g, O3, x), L = P.catchLeg(A, B, obj('baseball'), 300, 'hard'), tb = TB('catch', { a: L }, duo(A, B, 'rex', { obj: obj('baseball') }));
  const thrown = P.keFromV(L.aim ? L.aim.vE : L.vL, obj('baseball').m) + PE(obj('baseball').m, L.h0);
  console.log('burns', L.result, sig(tb.parts.drag), sig(0.5 * thrown), tb.parts.drag <= 0.5 * thrown, JSON.stringify(Object.keys(tb.parts).filter(k => tb.parts[k] > 0))); }
