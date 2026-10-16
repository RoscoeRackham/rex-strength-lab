const { P, g, R3, O3, c9, obj, PE, glow, sig } = require('./common.js');
const TB = P.RESTRAINT.takenBack;
const duo = (A, B, x) => Object.assign({ A, B, whoA: 'rex' }, x || {});
{ const A = c9(1e10 * g, R3), B = c9(1e3 * g, O3), L = P.catchLeg(A, B, obj('baseball'), 10, 'hard'); const t = TB('catch', { a: L }, duo(A, B, { obj: obj('baseball') }));
  console.log('slams leg:', L.result, 'Ecatch', sig(L.catch && L.catch.Ecatch), 'tally catch (ollie)', sig(t.by.ollie.parts.catch)); }
{ const A = c9(1e4 * g, R3), B = c9(1e3 * g, O3), L = P.catchLeg(A, B, obj('car'), 10, 'easy'); const t = TB('catch', { a: L }, duo(A, B, { obj: obj('car') }));
  console.log('cant-hold-it leg:', L.result, 'Ecatch', sig(L.catch && L.catch.Ecatch), 'tally catch (ollie)', sig(t.by.ollie.parts.catch)); }
{ const A = c9(1e4 * g, R3), B = c9(1e4 * g, O3), t = P.tossPartner(A, O3, 'Ollie', 'hard', 10, 'friction'); const tb = TB('toss', t, duo(A, B));
  console.log('toss hard 10 m 1e4:', t.result, 'Ecatch', sig(t.catch && t.catch.Ecatch), 'tally catch (rex)', sig(tb.by.rex.parts.catch)); }
{ const A = c9(1e13 * g, P.makeBody({ build: 'rex', H: 3.048, m: 1e13 })), B = c9(1e13 * g, P.makeBody({ build: 'ollie', H: 3.048, m: 1e13 }));
  for (const D0 of [10, 30, 100]) { let L; try { L = P.catchLeg(A, B, obj('baseball'), D0, 'hard'); } catch (e) { console.log('err', e.message); continue; }
    const t = TB('catch', { a: L }, duo(A, B, { obj: obj('baseball') }));
    const t0 = TB('catch', { a: L }, duo(A, Object.assign({}, B, { ownRecoil: false }), { obj: obj('baseball') }));
    console.log('10^13 kg bodies', D0, 'm:', L.result, 'wellDominated', !!(L.wells && L.wells.wellDominated), 'drag (catch on)', sig(t.parts.drag), 'drag (catcher recoil off)', sig(t0.parts.drag), 'catch', sig(t.parts.catch)); } }
