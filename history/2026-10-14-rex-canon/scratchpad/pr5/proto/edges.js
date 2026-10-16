global.window = {};
const M = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(M + '/src/engine.js'); require(M + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g, TB = P.RESTRAINT.takenBack;
const sf = (id) => D.surfaces.find((s) => s.id === id), ob = (id) => D.objects.find((o) => o.id === id);
const sig = (x) => (typeof x === 'number' && isFinite(x) ? Number(x.toPrecision(3)) : String(x));
const DEF = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true };
const R3 = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), O3 = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
const c9 = (F, body, x) => Object.assign({ F, mode: 'comic', body: body || R3, surface: sf('concrete'), anchor: 'friction' }, DEF, x || {});
const show = (n, tb) => console.log(n.padEnd(50), sig(tb.E), JSON.stringify(Object.fromEntries(Object.entries(tb.parts).filter(([, v]) => v).map(([k, v]) => [k, sig(v)]))), 'rex', sig(tb.by.rex.E), 'ollie', sig(tb.by.ollie.E), tb.unbounded);
// hits-ground person
for (const [lab, x] of [['100%', {}], ['99.9% kept', { airAbsorb: 0.999 }], ['SP off', { safePassenger: false }]]) {
  const cR = c9(1e16 * g, R3, x), cO = c9(1e16 * g, O3, x);
  const a = P.catchLeg(cR, cO, ob('person'), 31.6e3, 'hard');
  console.log(lab, a.result, a.hitsGround && sig(a.hitsGround.E), a.hitsGround && a.hitsGround.own && sig(a.hitsGround.own.E), a.miss && sig(a.miss.E), a.fast);
  show('hits-ground person ' + lab, TB('catch', { a }, { A: cR, B: cO, whoA: 'rex', obj: ob('person') }));
}
// fireball, 8j's state
for (const [lab, x, mean] of [['nkb on', {}, false], ['meant', {}, true], ['nkb off', { noKnockback: false }, false]]) {
  const cR = c9(1e14 * g, R3, Object.assign({ keepForm: false, airAbsorb: 0.5 }, x)), cO = Object.assign(c9(1e14 * g, O3, Object.assign({ keepForm: false, airAbsorb: 0.5 }, x)), mean ? { meanIt: true } : {});
  const a = P.catchLeg(cR, cO, ob('baseball'), 10, 'hard');
  console.log(lab, a.result, a.fireball && a.fireball.kind, a.fireball && sig(a.fireball.E), a.fireball && a.fireball.knockAbsorbed && sig(a.fireball.knockAbsorbed.E));
  show('fireball ' + lab, TB('catch', { a }, { A: cR, B: cO, whoA: 'rex', obj: ob('baseball') }));
}
// unlimited
const ci = c9(Infinity), oi = c9(Infinity, O3);
show('throw car unlimited', TB('throw', P.throwObject(ci, ob('car'), 45), Object.assign({}, ci, { obj: ob('car'), angle: 45 })));
show('stomp unlimited', TB('stomp', P.stomp(ci), ci));
show('punch unlimited silent', TB('punch', P.punch(Object.assign({}, ci, { silentStrike: true })), Object.assign({}, ci, { silentStrike: true })));
show('jump unlimited soft', TB('jump', P.jump(Object.assign({}, ci, { softLanding: true })), Object.assign({}, ci, { softLanding: true })));
for (const st of ['easy', 'hard']) { const a = P.catchLeg(ci, oi, ob('baseball'), 10, st), b = P.catchLeg(oi, ci, ob('baseball'), 10, st); console.log(st, a.result); show('catch unlimited ' + st, TB('catch', { a, b }, { A: ci, B: oi, whoA: 'rex', obj: ob('baseball') })); }
for (const st of ['easy', 'hard']) { const t = P.tossPartner(ci, O3, 'Ollie', st, 10, 'friction'); console.log(st, t.result, t.v); show('toss unlimited ' + st, TB('toss', t, { A: ci, B: oi, whoA: 'rex' })); }
{ const r = P.collide(oi, ci, { source: 'sprint' }); console.log('collide unl', r.outcome, sig(r.Q)); show('collide unlimited', TB('collide', r, { A: oi, B: ci, whoA: 'ollie' })); }
{ const r = P.collide(oi, Object.assign({}, ci, { immovable: true }), { source: 'sprint' }); console.log('immovable unl', r.outcome, r.h && r.h.undefinedResult, r.Q); show('immovable unlimited', TB('collide', r, { A: oi, B: ci, whoA: 'ollie' })); }
{ const w = P.throwPartner(ci, oi, 45); show('wrestle unlimited', TB('wrestleThrow', w, { A: ci, B: oi, whoA: 'rex', angle: 45 })); }
// orbit sweep car at 0
for (const kg of [4e9, 5e9, 6e9, 8e9, 1e10]) { const c = c9(kg * g), r = P.throwObject(c, ob('car'), 0), t = TB('throw', r, Object.assign({}, c, { obj: ob('car'), angle: 0 })); console.log(kg, r.flight.orbit, r.flight.escaped, sig(t.parts.drag), sig(r.Eobj), sig(r.flight.ocean ? r.flight.ocean.E : 0)); }
// catch: paradox in collide: bolted Rex
{ const r = P.collide(c9(1e9 * g, O3), c9(1e9 * g, R3, { anchor: 'bolted' }), { source: 'sprint' }); console.log('paradox', r.outcome); show('paradox', TB('collide', r, { A: c9(1e9*g,O3), B: c9(1e9*g,R3,{anchor:'bolted'}), whoA: 'ollie' })); }
