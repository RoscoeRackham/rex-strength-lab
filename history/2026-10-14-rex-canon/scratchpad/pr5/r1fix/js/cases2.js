const { P, D, g, R3, O3, c9, obj, PE, sig, TB, duo } = require('./common.js');
{ const B13 = P.makeBody({ build: 'rex', H: 3.048, m: 1e13 }), O13 = P.makeBody({ build: 'ollie', H: 3.048, m: 1e13 });
  for (const air of [1, 0.5]) {
  const A = c9(1e13 * g, B13, { airAbsorb: air }), C = c9(1e13 * g, O13, { ownRecoil: false, airAbsorb: air }), L = P.catchLeg(A, C, obj('baseball'), 10, 'hard');
  const A0 = c9(1e13 * g, B13, { airAbsorb: 0 }), C0 = c9(1e13 * g, O13, { ownRecoil: false, airAbsorb: 0 }), L0 = P.catchLeg(A0, C0, obj('baseball'), 10, 'hard');
  const tb = TB('catch', { a: L }, duo(A, C, 'rex', { obj: obj('baseball') }));
  const tbOn = TB('catch', { a: L }, duo(A, c9(1e13 * g, O13, { airAbsorb: air }), 'rex', { obj: obj('baseball') }));
  console.log('well', air, L.result, L.wells.wellDominated, 'vL', L.aim && L.aim.vL, L0.aim && L0.aim.vL, 'drag', tb.parts.drag, 'L0 drag', L0.drag && L0.drag.E, L0.result, JSON.stringify(Object.keys(tb.parts).filter(k => tb.parts[k] > 0)), 'catch on:', JSON.stringify(Object.keys(tbOn.parts).filter(k => tbOn.parts[k] > 0)));
  } }
{ const F = Math.pow(10, 5.25) * g, x = { ownRecoil: false }, A = c9(F, R3, x), B = c9(F, O3, x), L = P.catchLeg(A, B, obj('bus'), 31.6, 'easy'), tb = TB('catch', { a: L }, duo(A, B, 'rex', { obj: obj('bus') }));
  console.log('lob', L.result, L.fullStrength, L.style, sig(tb.parts.drag), JSON.stringify(Object.keys(tb.parts).filter(k => tb.parts[k] > 0))); }
