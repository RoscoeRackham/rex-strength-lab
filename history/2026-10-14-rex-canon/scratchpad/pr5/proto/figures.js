// The spec's runs through RESTRAINT.takenBack (engine on this branch). Run: node figures.js
global.window = {};
const M = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(M + '/src/engine.js');
require(M + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g, R = P.RESTRAINT;
const sf = (id) => D.surfaces.find((s) => s.id === id), ob = (id) => D.objects.find((o) => o.id === id);
const sig = (x, n = 3) => (typeof x !== 'number' || !isFinite(x) ? String(x) : Number(x.toPrecision(n)));
const F0 = 100 * 907.18474 * g;
const POW = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true };
const body = (b) => P.makeBody({ build: b, ...P.DEFAULT_BODIES[b] });
const ctxOf = (extra, b) => Object.assign({ F: F0, mode: 'comic', body: body(b || 'rex'), surface: sf('concrete'), anchor: 'friction' }, POW, extra || {});
const E = (k) => D.energyRefs.find((x) => x.key === k).J;
const FL = E('energy_corolla_100kmh_kinetic'), FX = E('energy_chicxulub_impact');
const level = (e) => (e > 0 ? sig((Math.log10(e) - Math.log10(FL)) / (Math.log10(FX) - Math.log10(FL)), 2) : '-');
function least(move, c, o) {
  const p = R.planNow(move, c, o), gl = p.goal(), want = gl.never || gl.onlyUnlimited ? undefined : gl.use;
  const rr = p.run(want), Mv = R.MOVES[move];
  if (!R.HAZARDS.some((h) => h.test(Mv, rr, p.opt))) return { use: want, r: rr };
  const ce = p.ceiling(); const use = ce.below > 0 ? ce.below : p.lo;
  return { use, r: p.run(use) };
}
const show = (name, tb) => console.log(name.padEnd(58), sig(tb.E).toString().padStart(10), 'J  level', level(tb.E), ' parts', JSON.stringify(Object.fromEntries(Object.entries(tb.parts).filter(([, v]) => v).map(([k, v]) => [k, sig(v)]))), ' rex', sig(tb.by.rex.E), 'ollie', sig(tb.by.ollie.E));
// car 30 m least disruptive and all-out
{
  const c = ctxOf(), o = { near: 5, target: 30, obj: ob('car'), angle: 45, safePassenger: true };
  const L = least('throw', c, o);
  const r = P.throwObject(Object.assign({}, c, { use: L.use }), ob('car'), 45);
  show('car 30 m least (' + sig(L.use / g) + ' kg-f)', R.takenBack('throw', r, Object.assign({}, c, { use: L.use }, o)));
  const ra = P.throwObject(c, ob('car'), 45);
  show('car all-out', R.takenBack('throw', ra, Object.assign({}, c, o)));
  const c9 = ctxOf({ F: 1e9 * g });
  show('car all-out 1e9', R.takenBack('throw', P.throwObject(c9, ob('car'), 45), Object.assign({}, c9, o)));
  const c12 = ctxOf({ F: 1e12 * g });
  show('car all-out 1e12', R.takenBack('throw', P.throwObject(c12, ob('car'), 45), Object.assign({}, c12, o)));
  const ci = ctxOf({ F: Infinity });
  show('car all-out unlimited', R.takenBack('throw', P.throwObject(ci, ob('car'), 45), Object.assign({}, ci, o)));
}
// stomp
{
  const c = ctxOf();
  show('stomp all-out', R.takenBack('stomp', P.stomp(c), c));
  const c9 = ctxOf({ F: 1e9 * g });
  show('stomp all-out 1e9', R.takenBack('stomp', P.stomp(c9), c9));
  const L = least('stomp', c, { near: 5 });
  show('stomp least (' + sig(L.use / g) + ')', R.takenBack('stomp', L.r, c));
}
// collide: Ollie charges Rex at 0.1% c, and the sprint
{
  const gb1 = 0.001 / Math.sqrt(1 - 1e-6);
  const cO = ctxOf({}, 'ollie'), cR = ctxOf();
  const r = P.collide(cO, cR, { source: 'set', gb: gb1 });
  show('collide 0.1% c (' + r.outcome + ')', R.takenBack('collide', r, { A: cO, B: cR, whoA: 'ollie' }));
  const rs = P.collide(cO, cR, { source: 'sprint' });
  show('collide sprint', R.takenBack('collide', rs, { A: cO, B: cR, whoA: 'ollie' }));
  const rm = P.collide(cO, cR, { source: 'set', gb: gb1, meanIt: true });
  show('collide 0.1% c meant', R.takenBack('collide', rm, { A: cO, B: cR, whoA: 'ollie' }));
}
// person 30 m least disruptive
{
  const c = ctxOf(), o = { near: 5, target: 30, obj: ob('person'), angle: 45, safePassenger: true };
  const L = least('throw', c, o);
  const r = P.throwObject(Object.assign({}, c, { use: L.use }), ob('person'), 45);
  show('person 30 m least (' + sig(L.use / g) + ')', R.takenBack('throw', r, Object.assign({}, c, { use: L.use }, o)));
  console.log('   person drag alone (no SP):', sig(R.takenBack('throw', r, Object.assign({}, c, { use: L.use }, o, { safePassenger: false })).E));
}
// jump, punch, clap
{
  for (const F of [F0, 1e9 * g]) {
    const c = ctxOf({ F, softLanding: true, silentStrike: true });
    show('jump soft ' + sig(F / g), R.takenBack('jump', P.jump(c), c));
    show('punch silent ' + sig(F / g), R.takenBack('punch', P.punch(c), c));
    show('clap silent ' + sig(F / g), R.takenBack('clap', P.clap(c), c));
  }
}
// catches
{
  for (const [F, id, st] of [[F0, 'baseball', 'hard'], [1e9 * g, 'baseball', 'hard'], [F0, 'car', 'easy'], [1e9 * g, 'car', 'hard']]) {
    const cR = ctxOf({ F }), cO = ctxOf({ F }, 'ollie');
    const a = P.catchLeg(cR, cO, ob(id), 10, st), b = P.catchLeg(cO, cR, ob(id), 10, st);
    show('catch ' + id + ' ' + sig(F / g) + ' ' + st + ' ' + a.result, R.takenBack('catch', { a, b }, { A: cR, B: cO, whoA: 'rex', obj: ob(id) }));
  }
  const cR = ctxOf(), cO = ctxOf({}, 'ollie');
  const t = P.tossPartner(cR, cO.body, 'Ollie', 'easy', 10, 'friction');
  show('toss easy 10 m ' + t.result, R.takenBack('toss', t, { A: cR, B: cO, whoA: 'rex' }));
  const th = P.tossPartner(cR, cO.body, 'Ollie', 'hard', 10, 'friction');
  show('toss hard ' + th.result, R.takenBack('toss', th, { A: cR, B: cO, whoA: 'rex' }));
  const w = P.throwPartner(cR, cO, 45);
  show('wrestle throw 45', R.takenBack('wrestleThrow', w, { A: cR, B: cO, whoA: 'rex', angle: 45 }));
  const c9 = ctxOf({ F: 1e9 * g }), o9 = ctxOf({ F: 1e9 * g }, 'ollie');
  const w9 = P.throwPartner(c9, o9, 45);
  show('wrestle throw 45 1e9 (crater ' + sig(w9.r.crater) + ')', R.takenBack('wrestleThrow', w9, { A: c9, B: o9, whoA: 'rex', angle: 45 }));
}
// weight
for (const id of ['krakatoa', 'chicxulub', 'sun']) show('weight ' + id, R.takenBack('weight', null, { growE: D.energyRefs.find((x) => x.id === id).J }));
