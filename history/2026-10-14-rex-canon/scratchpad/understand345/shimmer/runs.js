// Shimmer lens: energy taken back by each power, today's engine, at 3,000 kg (DEFAULT_BODIES)
global.window = {};
const M = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/main-tree/rex-strength-lab';
const P = require(M + '/src/engine.js');
require(M + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g, R = P.RESTRAINT;
const sf = (id) => D.surfaces.find((s) => s.id === id), ob = (id) => D.objects.find((o) => o.id === id);
const sig = (x, n = 3) => (typeof x !== 'number' || !isFinite(x) ? String(x) : Number(x.toPrecision(n)));
const F0 = 100 * 907.18474 * g;
const POW = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const body = (b) => P.makeBody({ build: b, ...P.DEFAULT_BODIES[b] });
const ctxOf = (extra, b) => Object.assign({ F: F0, mode: 'comic', body: body(b || 'rex'), surface: sf('concrete'), anchor: 'friction' }, POW, extra || {});
const E = (k) => D.energyRefs.find((x) => x.key === k).J;
const FL = E('energy_corolla_100kmh_kinetic'), FX = E('energy_chicxulub_impact'), FLOOR = E('energy_usain_bolt_top_speed');
const level = (e) => (e > 0 ? sig((Math.log10(e) - Math.log10(FL)) / (Math.log10(FX) - Math.log10(FL)), 2) : '-');
const L = require(M + '/src/ladder.js');
const cmp = (e) => (e > 0 ? L.compare(e, D.energyRefs).text : '-');
function least(move, c, o) {
  const p = R.planNow(move, c, o), gl = p.goal(), want = gl.never || gl.onlyUnlimited ? undefined : gl.use;
  const rr = p.run(want), Mv = R.MOVES[move], ce = p.ceiling();
  if (!R.HAZARDS.some((h) => h.test(Mv, rr, p.opt))) return { p, use: want, r: rr, capped: false, ce };
  const use = ce.below > 0 ? ce.below : p.lo;
  return { p, use, r: p.run(use), capped: true, ce };
}
// what real air would have taken from the same throw (the engine's dragLoss0 formula, at full drag), any speed
function realAirTake(c, t, obj, theta) {
  const b = c.body;
  if (!t.canMove || t.fallsBack) return 0;
  if (t.flight.relativistic) return t.Eobj;
  const f0 = P.fly({ v0: t.vOut, thetaDeg: theta, h0: b.releaseHeight, m: obj.m, A: obj.area, Cd: obj.Cd, CdSup: obj.CdSup });
  return f0.landed && !f0.relativistic ? Math.max(0, t.Eobj + obj.m * (P.K.GM / P.K.R_E - P.K.GM / (P.K.R_E + b.releaseHeight)) - P.keFromV(f0.vImpact, obj.m)) : t.Eobj;
}
const rows = [];
const row = (name, e, note) => rows.push({ run: name, E_J: sig(e), level: level(e), ladder: cmp(e), note: note || '' });

// throws
for (let [lbl, extra, use] of [['car 30 m 45°, least-disruptive', {}, 'least'], ['car, all-out, default dial', {}, undefined], ['car, all-out, dial 1e9', { F: 1e9 * g }, undefined]]) {
  const c = ctxOf(extra);
  let u = use;
  if (use === 'least') { const Lr = least('throw', c, { near: 5, target: 30, obj: ob('car'), angle: 45 }); u = Lr.use; lbl += ' (' + sig(u / g) + ' kg-force' + (Lr.capped ? ', capped' : '') + ')'; }
  const t = P.throwObject(Object.assign({}, c, { use: u }), ob('car'), 45);
  const ocean = t.flight.ocean ? t.flight.ocean.E : 0, real = realAirTake(c, t, ob('car'), 45);
  row('throw ' + lbl + ': fly ocean.E', ocean, 'v ' + sig(t.v) + ' m/s; Eobj ' + sig(t.Eobj) + ' J; dragLoss0 key present: ' + ('dragLoss0' in t));
  row('throw ' + lbl + ': real air would take (dragLoss0 formula)', real, 'ratio ocean/real ' + sig(ocean / real, 3) + '; real/Eobj ' + sig(real / t.Eobj, 3));
}
// stomp
for (const [lbl, extra] of [['all-out default dial', {}], ['all-out dial 1e9', { F: 1e9 * g }]]) {
  const s = P.stomp(ctxOf(extra));
  row('stomp ' + lbl + ': absorbed (Unbreakable footing)', s.absorbed, 'E ' + sig(s.E) + ' realBreaks ' + s.realBreaks + ' vFoot ' + sig(s.vFoot));
}
// stomp least-disruptive
{ const c = ctxOf(); const Ls = least('stomp', c, { near: 5 }); row('stomp least-disruptive (' + sig((Ls.use || c.F) / g) + ' kg-force): absorbed', Ls.r.absorbed, 'realBreaks ' + Ls.r.realBreaks); }
// jump: Unbreakable footing on the push-off (energy real ground would have taken) and the landing; Soft landing
for (const [lbl, extra] of [['all-out default dial', {}], ['all-out dial 1e9', { F: 1e9 * g }], ['all-out default dial, sand', { surface: sf('sand') }]]) {
  for (const soft of [false, true]) {
    const c = ctxOf(Object.assign({ softLanding: soft }, extra));
    const j = P.jump(c), jReal = P.jump(Object.assign({}, c, { unbreakable: false }));
    row('jump ' + lbl + (soft ? ', Soft landing on' : '') + ': engine figures', j.Eground, 'Eground(unbreakable) ' + sig(j.Eground) + '; landing.absorbed ' + sig(j.landing.absorbed) + '; landing.E ' + sig(j.landing.E) + '; landRatioReal ' + sig(j.landRatioReal) + '; overLimitReal ' + j.overLimitReal);
    row('   same on real ground (unbreakable off): Eground push-off', jReal.Eground, 'landing.Eground ' + sig(jReal.landing.Eground) + '; landing.ratio ' + sig(jReal.landing.ratio) + '; v ' + sig(jReal.v) + ' vs ' + sig(j.v));
  }
}
// punch, clap: Silent strike takes r.E when past Mach 1
for (const [lbl, extra] of [['all-out default dial', {}], ['all-out dial 1e9', { F: 1e9 * g }]]) {
  const p = P.punch(ctxOf(Object.assign({ silentStrike: true }, extra))), cl = P.clap(ctxOf(Object.assign({ silentStrike: true }, extra)));
  row('punch ' + lbl + ', Silent strike: E if mach>=1', p.mach >= 1 ? p.E : 0, 'mach ' + sig(p.mach) + ' E ' + sig(p.E));
  row('clap ' + lbl + ', Silent strike: E if mach>=1', cl.mach >= 1 ? cl.E : 0, 'mach ' + sig(cl.mach) + ' E ' + sig(cl.E));
}
// Collide: Ollie charges Rex
{
  const m = 3000, c = P.K.c;
  const cO = (F) => Object.assign(ctxOf({ F }, 'ollie'));
  for (const [lbl, F, src, gb] of [['sprint, default dial', F0, 'sprint'], ['set 0.1% c', 1e6 * g, 'set', 1e-3]]) {
    const r = P.collide(cO(F), ctxOf({ F }), { source: src, gb });
    const imm = P.collide(cO(F), Object.assign(ctxOf({ F }), { immovable: true }), { source: src, gb });
    const h = P.headOn(P.vToMomentum(r.v0, m), m, Infinity);
    row('collide ' + lbl + ' splat: today Q (Rex knocked back)', r.Q, 'v0 ' + sig(r.v0) + ' outcome ' + r.outcome);
    row('collide ' + lbl + ' splat: item 4 Q (charger unbounded; = immovable sums)', h.Q, 'immovable collide Q ' + sig(imm.Q));
  }
}
// Safe passenger: person thrown 30 m at 45° (PR 3); the landing's KE
{
  const t = P.throwObject(ctxOf({ use: 3350 * g }), ob('person'), 45);
  row('person thrown at 3,350 kg-force (brief\'s new least): landing KE', t.Eimpact, 'vImpact ' + sig(t.flight.vImpact) + ' m/s; Eobj ' + sig(t.Eobj));
  const c = ctxOf(); const Lp = least('throw', c, { near: 5, target: 30, obj: ob('person'), angle: 45, safePassenger: true });
  row('person 30 m, least with Safe passenger on (today\'s engine): landing KE', Lp.r.Eimpact, 'use ' + sig(Lp.use / g) + ' kg-force capped ' + Lp.capped + '; ceiling ' + (Lp.ce.by || 'none'));
}
// growth what-ifs (Weight tab)
for (const id of ['krakatoa', 'chicxulub', 'sun']) { const r = D.energyRefs.find((x) => x.id === id); row('Weight what-if: ' + id + (r.rough ? ' (rough)' : ''), r.J, 'becomes ' + sig(r.J / (P.K.c * P.K.c)) + ' kg'); }
// runaway growth: Egrav and the side effects
{
  const b = body('rex'), Eg = E('energy_krakatoa_1883');
  const I = P.instantGrowth(b, Eg, 0.5, { surface: sf('concrete'), unbreakable: true }), RW = P.runawayGrowth(b, Eg, 0.5, { surface: sf('concrete'), unbreakable: true });
  row('instant growth (Krakatoa, mix): blast energy Elo..Ehi (real in instant, absorbed in runaway)', I.Elo, 'Ehi ' + sig(I.Ehi) + '; Pocean ' + sig(I.Pocean) + ' N s; launchWould ' + sig(I.launchWould) + ' m; lift KE ' + sig(I.Pocean * I.Pocean / (2 * b.m)) + ' J');
  row('runaway (Krakatoa): Egrav to the ocean', RW.Egrav, 'kGround ' + sig(RW.kGround) + ' kGrav ' + sig(RW.kGrav));
}
console.table(rows);
console.log('flicker', FL, 'flare', FX, 'floor', FLOOR, 'floor level', level(FLOOR));
