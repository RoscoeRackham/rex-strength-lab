const path = require('path');
const load = (dir) => { for (const k of Object.keys(require.cache)) delete require.cache[k]; global.window = {}; const P = require(dir + '/src/engine.js'); require(dir + '/src/data.js'); return { P, D: window.DINO_DATA }; };
const HEAD = '/home/user/rex-strength-lab/rex-strength-lab', M = (id) => path.join(__dirname, 'mut', id);
const run = (dir, fn) => { const { P, D } = load(dir); const g = P.K.g; const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
  const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
  const ctx = (F, x) => Object.assign({ F, mode: 'comic', body: rex, surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, x || {});
  return fn({ P, D, g, surf, obj, rex, ctx }); };
const kg = (u, g) => isFinite(u) ? (u / g).toExponential(3) + ' kg' : String(u);
const cases = [
  ['M02_stomp_no_min', 'stomp preset plaster, unlimited, concrete', (E) => kg(E.P.RESTRAINT.planNow('stomp', E.ctx(Infinity), { near: 5 }).result('preset:plaster').use, E.g)],
  ['M02_stomp_no_min', 'stomp preset plaster, unlimited, granite', (E) => kg(E.P.RESTRAINT.planNow('stomp', E.ctx(Infinity, { surface: E.surf('granite') }), { near: 5 }).result('preset:plaster').use, E.g)],
  ['M03_plaster_always_low', 'jump ceiling, unlimited, granite', (E) => { const c = E.P.RESTRAINT.planNow('jump', E.ctx(Infinity, { surface: E.surf('granite') }), { near: 5, target: 3 }).ceiling(); return kg(c.below, E.g) + ' by ' + c.by; }],
  ['M05_throw_boom_no_recoil', 'loco throw boom onset, unlimited', (E) => kg(E.P.RESTRAINT.planNow('throw', E.ctx(Infinity), { near: 5, obj: E.obj('loco'), angle: 45, target: 30 }).result('hazard:boom').use, E.g)],
  ['M18_stomp_soil_removed', 'stomp ceiling, default dial, sand', (E) => { const c = E.P.RESTRAINT.planNow('stomp', E.ctx(90718.474 * E.g, { surface: E.surf('sand') }), { near: 5 }).ceiling(); return kg(c.below, E.g) + ' by ' + c.by; }],
  ['M04_sand_mean_p', 'Rex footprint on sand, effort 0 / 1', (E) => [0, 1].map((e) => (E.P.walkStep(E.rex, E.surf('sand'), { effort: e }).footprint.depth * 1000).toFixed(1) + ' mm').join(' / ')],
  ['N05_reltv_throw_no_blast', 'baseball, unlimited, all-out: blast E and air hazard', (E) => { const M = E.P.RESTRAINT.MOVES.throw; const r = E.P.throwObject(E.ctx(Infinity), E.obj('baseball'), 45); return (r.flight && r.flight.relativistic) + ' blast ' + M.blast(r).toExponential(2) + ' Eobj ' + r.Eobj.toExponential(2); }],
  ['M09_windows_near', 'punch windows preset, 10^7.5 kg dial, near 40', (E) => { const pw = E.P.RESTRAINT.PRESETS.find((x) => x.id === 'windows'), r = E.P.punch(E.ctx(Math.pow(10, 7.5) * E.g)); return pw.test(E.P.RESTRAINT.MOVES.punch, r, { near: 40 }) + ' radius ' + E.P.blastRadius(E.P.RESTRAINT.MOVES.punch.blast(r, {}), E.P.RESTRAINT.R.DP_WINDOWS).toFixed(1); }],
  ['N01_air_at_RNEAR', 'punch air hazard onset, unlimited, near 40', (E) => kg(E.P.RESTRAINT.planNow('punch', E.ctx(Infinity), { near: 40, target: 10.4 }).result('hazard:air').use, E.g)],
  ['N07_stepRate_neg', 'Rex walk step stepRate/stride', (E) => { const s = E.P.walkStep(E.rex, E.surf('concrete'), { effort: 0.5 }); return s.stepRate.toFixed(3) + ' ' + s.stride.toFixed(3) + ' ' + s.stance.toFixed(3); }],
];
for (const [id, label, fn] of cases) console.log(id, '|', label, '| HEAD:', run(HEAD, fn), '| mutant:', run(M(id), fn));
