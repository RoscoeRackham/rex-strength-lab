// What moved against pull request 2's branch: a person thrown 30 m at 45°, the planner as the page runs it, on PR2's
// engine and this branch's, for several settings. node moved.js
global.window = {};
const S = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr3';
const ENG = { pr2: S + '/pr2-tree/rex-strength-lab/src/engine.js', pr3: '/home/user/rex-strength-lab/rex-strength-lab/src/engine.js' };
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const sig = (x, n = 3) => (typeof x !== 'number' || !isFinite(x) ? String(x) : Number(x.toPrecision(n)));
const sf = (id) => D.surfaces.find((s) => s.id === id), person = D.objects.find((o) => o.id === 'person');
const POW = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const OFF4 = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
const cases = [
  ['default dial, four on, SP on', 100 * 907.18474, POW, true, 'concrete', 45],
  ['default dial, four on, SP off', 100 * 907.18474, POW, false, 'concrete', 45],
  ['default dial, four off, SP on', 100 * 907.18474, OFF4, true, 'concrete', 45],
  ['default dial, air 0% (others on), SP on', 100 * 907.18474, Object.assign({}, POW, { airAbsorb: 0 }), true, 'concrete', 45],
  ['default dial, air 50%, SP on', 100 * 907.18474, Object.assign({}, POW, { airAbsorb: 0.5 }), true, 'concrete', 45],
  ['1e9 kg dial, four on, SP on', 1e9, POW, true, 'concrete', 45],
  ['1e9 kg dial, four on, SP off', 1e9, POW, false, 'concrete', 45],
  ['1e6 kg dial, four on, SP on', 1e6, POW, true, 'concrete', 45],
  ['1e6 kg dial, air 0%, SP on', 1e6, Object.assign({}, POW, { airAbsorb: 0 }), true, 'concrete', 45],
];
const out = {};
for (const [lab, file] of Object.entries(ENG)) {
  delete require.cache[require.resolve(file)];
  const P = require(file), g = P.K.g, R = P.RESTRAINT;
  const body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
  for (const [name, kg, pw, sp, sid, ang] of cases) {
    const c = Object.assign({ F: kg * g, mode: 'comic', body, surface: sf(sid), anchor: 'friction', safePassenger: sp }, pw);
    const p = R.planNow('throw', c, { near: 5, target: 30, obj: person, angle: ang, safePassenger: sp, silentStrike: false, softLanding: false });
    const gl = p.goal(), ce = p.ceiling(), onset = ce.by ? Math.sqrt(ce.below * ce.use) / g : null;
    let use = gl.reached ? gl.use : undefined;
    if (R.HAZARDS.some((h) => h.test(R.MOVES.throw, p.run(use), p.opt))) use = ce.below > 0 ? ce.below : p.lo;
    const row = { least: sig((use || c.F) / g), ceiling: ce.by ? ce.by + ' ' + sig(onset) : 'none', presets: p.presets().map((x) => x.id + ':' + (x.never ? 'never' : x.onlyUnlimited ? 'unl' : sig(x.use / g))).join(' '), hazards: p.hazards().map((x) => x.id + ':' + (x.never ? 'never' : sig(Math.sqrt(x.below * x.use) / g))).join(' ') };
    (out[name] = out[name] || {})[lab] = row;
  }
}
for (const [name, v] of Object.entries(out)) {
  const same = JSON.stringify(v.pr2) === JSON.stringify(v.pr3);
  console.log((same ? 'same  ' : 'MOVED ') + name + '\n   pr2 ' + JSON.stringify(v.pr2) + (same ? '' : '\n   pr3 ' + JSON.stringify(v.pr3)));
}
