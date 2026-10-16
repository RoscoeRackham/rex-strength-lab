// Round 2 copy lens: the README's and the description's engine figures, recomputed from this clone's engine
global.window = {};
const LAB = __dirname + '/../repo/rex-strength-lab';
const P = require(LAB + '/src/engine.js'); require(LAB + '/src/data.js'); const D = window.DINO_DATA; const LAD = require(LAB + '/src/ladder.js');
const g = P.K.g, obj = (id) => D.objects.find((x) => x.id === id), conc = D.surfaces.find((s) => s.id === 'concrete');
const R3 = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), O3 = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
const DEF = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true };
const ctx = (kg, body, x) => Object.assign({ F: kg * g, mode: 'comic', body: body || R3, surface: conc, anchor: 'friction' }, DEF, x || {});
const TB = P.RESTRAINT.takenBack;
const gw = (J) => { const gl = LAD.glow(J, D.energyRefs); return gl.none ? 'none' : gl.text + ' (level ' + (gl.level == null ? '-' : gl.level.toFixed(3)) + ', str ' + gl.strength.toFixed(3) + ')'; };
const s3 = (x) => Number(x).toPrecision(3);
const dial = 100 * 907.18474;
const out = (k, J, extra) => console.log(k.padEnd(48), s3(J), 'J ·', gw(J), extra ? JSON.stringify(extra) : '');
const thr = (kg, id, ang, body, x) => { const c = ctx(kg, body, x), r = P.throwObject(c, obj(id), ang); return { r, t: TB('throw', r, Object.assign({}, c, { obj: obj(id), angle: ang })) }; };
let q;
q = thr(dial, 'car', 45); out('car all-out 45 dial', q.t.E, { ocean: q.r.flight.ocean && s3(q.r.flight.ocean.E) });
q = thr(1e9, 'car', 45); out('car all-out 1e9', q.t.E);
q = thr(1e12, 'car', 45); out('car all-out 1e12', q.t.E);
q = thr(Infinity, 'car', 45); out('car unlimited', q.t.E);
for (const [lab, kg] of [['stomp all-out dial', dial], ['stomp all-out 1e9', 1e9]]) { const c = ctx(kg), r = P.stomp(c); out(lab, TB('stomp', r, c).E); }
for (const mv of ['punch', 'clap']) for (const kg of [dial, 1e9]) { const c = ctx(kg, null, { silentStrike: true }), r = P[mv](c); out(mv + ' silent ' + kg, TB(mv, r, c).E, { mach: s3(r.mach) }); }
// collide at 0.1% of light speed: Ollie charges Rex, set speed
{ const cO = ctx(dial, O3), cR = ctx(dial, R3); const r = P.collide(cO, cR, { source: 'set', gb: Math.log10(0.001), bounce: false }); const t = TB('collide', r, { A: cO, B: cR, whoA: 'ollie' }); out('collide 0.1%c rex', t.by.rex.E, { outcome: r.outcome }); out('collide 0.1%c ollie', t.by.ollie.E); }
// game of catch
{ const c = ctx(dial), co = ctx(dial, O3); for (const [id, st] of [['car', 'easy'], ['baseball', 'hard']]) { const a = P.catchLeg(c, co, obj(id), 10, st), b = P.catchLeg(co, c, obj(id), 10, st); const t = TB('catch', { a, b }, { A: c, B: co, whoA: 'rex', obj: obj(id) }); out('catch ' + id + ' ' + st + ' 10 m rex', t.by.rex.E, { a: a.result }); out('catch ' + id + ' ' + st + ' 10 m ollie', t.by.ollie.E); } }
{ const c = ctx(dial), t = P.tossPartner(c, O3, 'Ollie', 'easy', 10, 'friction'); out('toss gentle 10 m', TB('toss', t, { A: c, B: ctx(dial, O3), whoA: 'rex' }).E, { result: t.result }); }
for (const kg of [dial, 1e9]) { const A = ctx(kg), B = ctx(kg, O3), t = P.throwPartner(A, B, 45), tb = TB('wrestleThrow', t, { A, B, whoA: 'rex', angle: 45 }); out('wrestle 45 ' + kg + ' rex', tb.by.rex.E); out('wrestle 45 ' + kg + ' ollie', tb.by.ollie.E); }
{ const x = { keepForm: false, airAbsorb: 0.5 }, A = ctx(1e14, R3, x), B = ctx(1e14, O3, x), L = P.catchLeg(A, B, obj('baseball'), 10, 'hard'); const t = TB('catch', { a: L }, { A, B, whoA: 'rex', obj: obj('baseball') }); out('fireball 1e14 ollie', t.by.ollie.E, { res: L.result }); out('fireball 1e14 rex', t.by.rex.E); }
for (const id of ['energy_krakatoa_1883', 'energy_chicxulub_impact']) { const r = D.energyRefs.find((e) => e.key === id); if (r) out('growth ' + id, r.J, { rough: r.rough }); }
for (const r of D.energyRefs.filter((e) => /sun/i.test(e.key))) out('growth? ' + r.key, r.J);
// round 1 moved
q = thr(1e17, 'pyramid', 90); out('pyramid up 1e17', q.t.E);
q = thr(1e16, 'esb', 90); out('esb up 1e16', q.t.E);
q = thr(Math.pow(10, 12.5), 'ruyi', 90); out('staff up 10^12.5', q.t.E);
{ const OD = P.makeBody({ build: 'ollie', H: 3.06, m: 1e6 }), cR = ctx(1e14), t = P.tossPartner(cR, OD, 'Ollie', 'hard', 10, 'friction'); out('dense ollie toss 1e14', TB('toss', t, { A: cR, B: ctx(1e14, OD), whoA: 'rex' }).E, { result: t.result }); }
{ const x = { ownRecoil: false, safePassenger: false, noKnockback: false }, c = ctx(1e16, R3, x), co = ctx(1e16, O3, x), L = P.catchLeg(c, co, obj('esb'), 1e5, 'hard'); out('esb catch 100 km 1e16', TB('catch', { a: L }, { A: c, B: co, whoA: 'rex', obj: obj('esb') }).E, { res: L.result }); }
{ const B = P.makeBody({ build: 'rex', H: 3.048, m: 1e12 }); q = thr(1e12, 'car', 45, B); out('dense rex 1e12 car 45', q.t.E, { v: s3(q.r.v), vOut: s3(q.r.vOut), rho: s3(B.rho) }); }
{ const B = P.makeBody({ build: 'rex', H: 3.048, m: 1e13 }); q = thr(1e14, 'car', 45, B); out('dense rex 1e13 car 1e14', q.t.E); }
for (const [id, D_, kg] of [['baseball', 300, 1e8], ['car', 1e4, 1e9]]) { const c = ctx(kg), co = ctx(kg, O3), a = P.catchLeg(c, co, obj(id), D_, 'hard'), b = P.catchLeg(co, c, obj(id), D_, 'hard'), t = TB('catch', { a, b }, { A: c, B: co, whoA: 'rex', obj: obj(id) }); console.log('catch', id, D_, kg, 'rex drag', s3(t.by.rex.parts.drag), 'catch', s3(t.by.rex.parts.catch)); }
// the ladder's steps
const gl = LAD.glow(1, D.energyRefs); console.log(JSON.stringify({ floor: gl.floor, flicker: gl.flicker, flare: gl.flare, steps: gl.steps }, null, 0));
