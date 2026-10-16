// The engine report's figures, printed as Markdown rows from the engine and the ladder (no figure typed by hand).
// Run: node report-figures.js
global.window = {};
const M = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(M + '/src/engine.js'); require(M + '/src/data.js');
const LAD = require(M + '/src/ladder.js');
const D = window.DINO_DATA, g = P.K.g, R = P.RESTRAINT, TB = R.takenBack;
const sf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const sig = (x, n = 3) => (x === Infinity ? 'unbounded' : Number(x.toPrecision(n)).toLocaleString('en-US', { maximumSignificantDigits: n }));
const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const J = (x) => { if (x === Infinity) return 'unbounded'; if (x >= 1e18) { const e = Math.floor(Math.log10(x)), m = x / Math.pow(10, e); return sig(m) + ' × 10' + String(e).split('').map((c) => SUP[c]).join('') + ' J'; } const u = [[1e15, 'PJ'], [1e12, 'TJ'], [1e9, 'GJ'], [1e6, 'MJ'], [1e3, 'kJ'], [1, 'J']].find(([k]) => x >= k) || [1, 'J']; return sig(x / u[0]) + ' ' + u[1]; };
const DEF = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true };
const R3 = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), O3 = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
const c9 = (F, body, x) => Object.assign({ F, mode: 'comic', body: body || R3, surface: sf('concrete'), anchor: 'friction' }, DEF, x || {});
const dial = 100 * 907.18474 * g;
const least = (move, c, o) => { const p = R.planNow(move, c, o), gl = p.goal(), want = gl.never || gl.onlyUnlimited ? undefined : gl.use, rr = p.run(want); if (!R.HAZARDS.some((h) => h.test(R.MOVES[move], rr, p.opt))) return want; const ce = p.ceiling(); return ce.below > 0 ? ce.below : p.lo; };
const lv = (x) => { const gw = LAD.glow(x, D.energyRefs); return gw.none ? 'none' : (gw.unbounded ? 'unbounded' : gw.level.toFixed(3)) + ', ' + gw.text; };
const parts = (tb, who) => Object.entries(who ? tb.by[who].parts : tb.parts).filter(([, v]) => v).map(([k, v]) => k + ' ' + J(v)).join(' + ') || 'nothing';
const rows = [];
const row = (run, tb, note) => rows.push('| ' + run + ' | ' + J(tb.E) + ' | ' + parts(tb) + ' | Rex ' + J(tb.by.rex.E) + (tb.by.ollie.E ? '; Ollie ' + J(tb.by.ollie.E) : '') + ' | ' + lv(tb.E) + (tb.by.ollie.E && tb.by.rex.E ? ' (Rex\'s alone: ' + lv(tb.by.rex.E) + ')' : '') + ' | ' + (note || '') + ' |');
const thr = (c, id, th, use) => { const cc = Object.assign({}, c, use != null ? { use } : {}); return TB('throw', P.throwObject(cc, obj(id), th), Object.assign({}, cc, { obj: obj(id), angle: th })); };
{ const c = c9(dial), goal = { near: 5, target: 30, angle: 45, safePassenger: true };
  const u = least('throw', c, Object.assign({ obj: obj('car') }, goal)), up = least('throw', c, Object.assign({ obj: obj('person') }, goal));
  const r = P.throwObject(Object.assign({}, c, { use: u }), obj('car'), 45);
  row('Car thrown 30 m at 45°, least disruptive (' + sig(u / g) + ' kg-force)', thr(c, 'car', 45, u), 'fly()\'s drag-free tally would say ' + J(r.flight.ocean.E));
  row('The same, all-out (the dial)', thr(c, 'car', 45));
  row('The same, all-out at 10⁹ kg', thr(c9(1e9 * g), 'car', 45));
  row('The same, all-out at 10¹² kg (past 1% of light speed)', thr(c9(1e12 * g), 'car', 45));
  row('The same, unlimited', thr(c9(Infinity), 'car', 45));
  const tp = thr(c, 'person', 45, up), tp0 = TB('throw', P.throwObject(Object.assign({}, c, { use: up }), obj('person'), 45), Object.assign({}, c, { use: up, obj: obj('person'), angle: 45, safePassenger: false }));
  row('Person thrown 30 m, least disruptive (' + sig(up / g) + ' kg-force), Safe passenger', tp, 'Safe passenger off: drag ' + J(tp0.E));
  const st = (F, use) => { const cc = Object.assign({}, c9(F), use != null ? { use } : {}); return TB('stomp', P.stomp(cc), cc); };
  const us = least('stomp', c, { near: 5 });
  row('Stomp, least disruptive (' + sig(us / g) + ' kg-force)', st(dial, us), 'the ground wouldn\'t break');
  row('Stomp all-out (the dial)', st(dial));
  row('Stomp all-out at 10⁹ kg', st(1e9 * g));
  for (const F of [dial, 1e9 * g]) {
    const cc = c9(F, R3, { softLanding: true, silentStrike: true }), tag = F === dial ? 'the dial' : '10⁹ kg';
    row('Jump all-out, Soft landing (' + tag + ')', TB('jump', P.jump(cc), cc));
    const pu = P.punch(cc), cl = P.clap(cc);
    row('Punch all-out, Silent strike (' + tag + ', Mach ' + pu.mach.toFixed(2) + ')', TB('punch', pu, cc));
    row('Clap all-out, Silent strike (' + tag + ', Mach ' + cl.mach.toFixed(2) + ')', TB('clap', cl, cc));
  }
}
const gb1 = 0.001 / Math.sqrt(1 - 1e-6);
for (const [lab, o] of [['sprint', { source: 'sprint' }], ['0.1% of light speed', { source: 'set', gb: gb1 }], ['0.1% of light speed, meant (a blast preset)', { source: 'set', gb: gb1, meanIt: true }], ['0.1% of light speed, bounce', { source: 'set', gb: gb1, bounce: true }]]) {
  const r = P.collide(c9(dial, O3), c9(dial), o);
  row('Collide: Ollie charges Rex, ' + lab, TB('collide', r, { A: c9(dial, O3), B: c9(dial), whoA: 'ollie' }));
}
for (const [F, id, st, D0] of [[dial, 'baseball', 'hard', 10], [dial, 'car', 'easy', 10], [1e9 * g, 'car', 'hard', 10], [dial, 'person', 'easy', 10]]) {
  const cR = c9(F), cO = c9(F, O3), a = P.catchLeg(cR, cO, obj(id), D0, st), b = P.catchLeg(cO, cR, obj(id), D0, st);
  row('Game of catch: ' + id + ', ' + (st === 'hard' ? 'fastball' : 'gentle lob') + ', ' + D0 + ' m, ' + (F === dial ? 'the dial' : '10⁹ kg') + ' (a round trip; leg a ' + a.result + ')', TB('catch', { a, b }, { A: cR, B: cO, whoA: 'rex', obj: obj(id) }));
}
{ const cR = c9(dial), cO = c9(dial, O3), a = P.catchLeg(cR, cO, obj('person'), 10, 'easy');
  row('The same person, leg a, "if he misses" what-if', TB('catch', { a }, { A: cR, B: cO, whoA: 'rex', obj: obj('person'), miss: true }), 'the tile\'s run is the catch'); }
{ const x = { keepForm: false, airAbsorb: 0.5 }, cR = c9(1e14 * g, R3, x), cO = c9(1e14 * g, O3, x), a = P.catchLeg(cR, cO, obj('baseball'), 10, 'hard');
  row('Game of catch: fastball 10 m at 10¹⁴ kg, Things keep their form off, half the drag (leg a: ' + a.result + ')', TB('catch', { a }, { A: cR, B: cO, whoA: 'rex', obj: obj('baseball') }), 'pull request 4\'s fireball'); }
{ const cR = c9(1e16 * g), cO = c9(1e16 * g, O3), a = P.catchLeg(cR, cO, obj('person'), 31.6e3, 'hard');
  row('Game of catch: a person 31.6 km apart at 10¹⁶ kg (leg a: ' + a.result + ')', TB('catch', { a }, { A: cR, B: cO, whoA: 'rex', obj: obj('person') }), 'hitsGround.E'); }
for (const [st, h] of [['easy', 10], ['hard', 10]]) { const t = P.tossPartner(c9(dial), O3, 'Ollie', st, h, 'friction'); row('Partner toss, ' + (st === 'easy' ? 'gentle, 10 m up' : 'all-out') + ' (the dial; ' + t.result + ')', TB('toss', t, { A: c9(dial), B: c9(dial, O3), whoA: 'rex' })); }
for (const F of [dial, 1e9 * g]) { const w = P.throwPartner(c9(F), c9(F, O3), 45); row('Wrestle throw: Rex throws Ollie at 45° (' + (F === dial ? 'the dial' : '10⁹ kg, crater ' + sig(w.r.crater) + ' m') + ')', TB('wrestleThrow', w, { A: c9(F), B: c9(F, O3), whoA: 'rex', angle: 45 })); }
for (const id of ['krakatoa', 'chicxulub', 'sun']) { const r = D.energyRefs.find((x) => x.id === id); row('Weight: growth what-if, ' + r.short, TB('weight', null, { growE: r.J })); }
console.log('| Run | Taken back | Parts | Who | Level, word | Note |\n|---|---|---|---|---|---|\n' + rows.join('\n'));
const gs = LAD.glow(1, D.energyRefs);
console.log('\nSteps:\n' + gs.steps.map((s) => '- ' + s.word + ' (level ' + s.level + '): ' + J(s.J) + ', "' + s.text + '"' + (s.rough ? ', rough' : '')).join('\n'));
console.log('- floor: ' + J(gs.floor.J) + ' (level ' + gs.floor.level.toFixed(3) + '), "' + gs.floor.text + '"');
