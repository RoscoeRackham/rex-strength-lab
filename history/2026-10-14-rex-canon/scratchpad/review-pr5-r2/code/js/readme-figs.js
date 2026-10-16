const H = require('./h.js')();
const { P, g, obj, R3, O3, c9, dial, TB, glow, sig } = H;
const duo = (A, B, whoA, x) => Object.assign({ A, B, whoA }, x || {});
const out = (l, tb, who) => console.log(l.padEnd(60), 'E', sig(tb.E), 'rex', sig(tb.by.rex.E), 'ollie', sig(tb.by.ollie.E), JSON.stringify(Object.fromEntries(Object.entries(tb.parts).filter(([, v]) => v > 0).map(([k, v]) => [k, sig(v)]))), '|', glow(tb.by.rex.E).text, '/', glow(tb.E).text);
{ const A = c9(dial), B = c9(dial, O3), a = P.catchLeg(A, B, obj('car'), 10, 'easy'), b = P.catchLeg(B, A, obj('car'), 10, 'easy'); out('catch car lob 10 m at dial', TB('catch', { a, b }, duo(A, B, 'rex', { obj: obj('car') }))); }
{ const A = c9(dial), B = c9(dial, O3), a = P.catchLeg(A, B, obj('baseball'), 10, 'hard'), b = P.catchLeg(B, A, obj('baseball'), 10, 'hard'); out('catch fastball 10 m at dial', TB('catch', { a, b }, duo(A, B, 'rex', { obj: obj('baseball') }))); }
{ const A = c9(dial), B = c9(dial, O3), t = P.tossPartner(A, O3, 'Ollie', 'easy', 10, 'friction'); out('toss gentle 10 m', TB('toss', t, duo(A, B, 'rex'))); }
{ const A = c9(dial), B = c9(dial, O3); out('wrestle throw 45 at dial', TB('wrestleThrow', P.throwPartner(A, B, 45), duo(A, B, 'rex', { angle: 45 }))); }
{ const A = c9(1e9 * g), B = c9(1e9 * g, O3); out('wrestle throw 45 at 1e9', TB('wrestleThrow', P.throwPartner(A, B, 45), duo(A, B, 'rex', { angle: 45 }))); }
{ const x = { keepForm: false, airAbsorb: 0.5 }, A = c9(1e14 * g, R3, x), B = c9(1e14 * g, O3, x), a = P.catchLeg(A, B, obj('baseball'), 10, 'hard'); out('fireball 1e14', TB('catch', { a }, duo(A, B, 'rex', { obj: obj('baseball') }))); }
for (const kg of [1e9, 1e12, Infinity]) { const c = c9(kg * g), r = P.throwObject(c, obj('car'), 45); out('car all-out ' + kg, TB('throw', r, Object.assign({}, c, { obj: obj('car'), angle: 45 }))); }
for (const id of ['krakatoa', 'chicxulub', 'sun']) { const ref = H.D.energyRefs.find((r) => r.id === id); out('weight ' + id, TB('weight', null, { growE: ref.J })); }
for (const mv of ['punch', 'clap']) for (const kg of [dial / g, 1e9]) { const c = c9(kg * g, R3, { silentStrike: true }); out(mv + ' ' + sig(kg), TB(mv, P[mv](c), c)); }
{ const c = c9(1e16 * g), r = P.throwObject(c, obj('esb'), 90); out('esb 90 at 1e16', TB('throw', r, Object.assign({}, c, { obj: obj('esb'), angle: 90 }))); }
{ const c = c9(Math.pow(10, 12.5) * g), r = P.throwObject(c, obj('ruyi'), 90); out('staff 90 at 10^12.5', TB('throw', r, Object.assign({}, c, { obj: obj('ruyi'), angle: 90 }))); }
{ const R = P.makeBody({ build: 'rex', H: 3.048, m: 1e13 }), c = c9(1e14 * g, R), r = P.throwObject(c, obj('car'), 45); out('Rex 1e13 car 45 at 1e14', TB('throw', r, Object.assign({}, c, { obj: obj('car'), angle: 45 }))); }
{ const A = c9(1e9 * g), B = c9(1e9 * g, O3), a = P.catchLeg(A, B, obj('car'), 1e4, 'hard'), b = P.catchLeg(B, A, obj('car'), 1e4, 'hard'); out('catch car 10 km at 1e9', TB('catch', { a, b }, duo(A, B, 'rex', { obj: obj('car') }))); }
{ const x = { ownRecoil: false, safePassenger: false, noKnockback: false }, A = c9(1e16 * g, R3, x), B = c9(1e16 * g, O3, x), a = P.catchLeg(A, B, obj('esb'), 1e5, 'hard'); out('catch esb 100 km at 1e16 (catch real) ' + a.result, TB('catch', { a }, duo(A, B, 'rex', { obj: obj('esb') }))); }
{ const A = c9(1e16 * g), B = c9(1e16 * g, O3), a = P.catchLeg(A, B, obj('esb'), 1e5, 'hard'); out('catch esb 100 km at 1e16 (defaults) ' + a.result, TB('catch', { a }, duo(A, B, 'rex', { obj: obj('esb') }))); }
{ const OD = P.makeBody({ build: 'ollie', H: 3.06, m: 1e6 }), A = c9(1e14 * g), B = c9(1e14 * g, OD), t = P.tossPartner(A, OD, 'Ollie', 'hard', 10, 'friction'); out('dense Ollie toss hard 1e14 ' + t.result, TB('toss', t, duo(A, B, 'rex'))); }
