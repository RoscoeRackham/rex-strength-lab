// Proposed guards: node guards.js <rexlab dir>
const dir = process.argv[2];
global.window = {};
const P = require(dir + '/src/engine.js'); require(dir + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const ctxOf = (F, x) => Object.assign({ F, mode: 'comic', body: rex, surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, x || {});
const H = (id) => P.RESTRAINT.HAZARDS.find((h) => h.id === id), M = P.RESTRAINT.MOVES;
const out = [];
const ok = (n, c, d) => out.push((c ? 'ok   ' : 'FAIL ') + n + (d != null ? ': ' + d : ''));
// 1 stomp body share capped at the stamp's leg speed
{ const vSt = Math.sqrt(2 * g * P.WALK.STAMP.thigh * rex.H), o = { surface: surf('concrete'), body: rex };
  const J = (v) => { const s = M.stomp.shake({ vFoot: v, holeDepth: 0 }, o); return s.F * s.T / 2; };
  ok('stomp: above the stamp speed only the leg adds momentum', Math.abs((J(3 * vSt) - J(2 * vSt)) - rex.legEff * vSt) < 1e-6 * J(3 * vSt), (J(3 * vSt) - J(2 * vSt)).toFixed(1) + ' vs ' + (rex.legEff * vSt).toFixed(1)); }
// 2 plaster limit by pulse frequency
{ const gr = surf('concrete'); const s10 = P.vibSource(gr, 'hann', 1, 0.01), s50 = P.vibSource(gr, 'hann', 1, 0.05);
  const at = (s, v) => Object.assign({}, s, { F: v / P.ppvAt(s, 5) });
  ok('plaster: 20 mm/s is safe for a 10 ms pulse (100 Hz), not for a 50 ms one (20 Hz)', !P.plasterOver(at(s10, 0.02), 5) && P.plasterOver(at(s50, 0.02), 5)); }
// 3 sand print follows the peak
ok('sand: a stamp prints deeper than a soft step', P.walkStep(rex, surf('sand'), { effort: 1 }).footprint.depth > 2 * P.walkStep(rex, surf('sand'), { effort: 0 }).footprint.depth);
// 4 throw boom counts recoil
{ const r = P.throwObject(ctxOf(Infinity, { use: 5e7 * g }), obj('loco'), 45);
  ok('a locomotive throw: his own recoil past Mach 1 is a boom', r.v < P.K.a0 && r.recoilV >= P.K.a0 && H('boom').test(M.throw, r, { near: 5, obj: obj('loco') }), r.v.toFixed(0) + ' / ' + r.recoilV.toFixed(0) + ' m/s'); }
// 5 stomp on sand: the ceiling is plaster, not the footprint
{ const p = P.RESTRAINT.planNow('stomp', ctxOf(90718 * g, { surface: surf('sand') }), { near: 5 }), ce = p.ceiling(), r = p.run(ce.below);
  ok('stomp on sand: a dent is a footprint; the ceiling is set by plaster', ce.by === 'plaster' && r.holeDepth >= 0.01 && !H('ground').test(M.stomp, r, p.opt), ce.by + ' ' + (ce.below / g).toPrecision(3) + ' kg, hole ' + (r.holeDepth * 100).toFixed(1) + ' cm'); }
// 6 near moves the air and plaster onsets
{ const on = (mv, c, near, id, x) => P.RESTRAINT.planNow(mv, c, Object.assign({ near }, x)).result('hazard:' + id).use;
  const p5 = on('stomp', ctxOf(1e9 * g), 5, 'plaster', {}), p40 = on('stomp', ctxOf(1e9 * g), 40, 'plaster', {});
  ok('stomp: plaster 40 m away needs more effort than 5 m away', p40 > p5 * 1.5, (p5 / g).toPrecision(3) + ' -> ' + (p40 / g).toPrecision(3));
  const t5 = on('throw', ctxOf(Infinity), 5, 'air', { obj: obj('baseball'), angle: 45, target: 30 }), t1k = on('throw', ctxOf(Infinity), 1000, 'air', { obj: obj('baseball'), angle: 45, target: 30 });
  ok('throw: air blast 1 km away needs more effort than 5 m away', t1k > t5 * 1.5, (t5 / g).toPrecision(3) + ' -> ' + (t1k / g).toPrecision(3)); }
// 7 relativistic throw's fireball
{ const r = P.throwObject(ctxOf(Infinity), obj('baseball'), 45);
  ok('a relativistic throw lets its whole energy go as a blast', r.flight.relativistic && M.throw.blast(r) === r.Eobj); }
// 8 windows preset at 15 m
{ const pw = P.RESTRAINT.PRESETS.find((x) => x.id === 'windows'), r = P.punch(ctxOf(Math.pow(10, 7.5) * g)), rad = P.blastRadius(M.punch.blast(r, {}), P.RESTRAINT.R.DP_WINDOWS);
  ok('windows preset judged at 15 m, not at near', rad > 15 && rad < 40 && pw.test(M.punch, r, { near: 40 }), rad.toFixed(1) + ' m'); }
// 9 rattle preset at the rattle level
{ const p = P.RESTRAINT.planNow('stomp', ctxOf(90718 * g), { near: 5 }), u = p.result('preset:rattle').use, r = p.run(u);
  ok('stomp rattle preset starts at the rattle level', Math.abs(P.ppvAt(M.stomp.shake(r, p.opt), 5) / P.VIB.TH.rattle - 1) < 0.02, (P.ppvAt(M.stomp.shake(r, p.opt), 5) * 1000).toFixed(3) + ' mm/s'); }
// 10 firm sand
ok('elephant comparison firm end: 280 m/s', P.VIB.GROUND.firmsand.cs === 280 && P.VIB.GROUND.firmsand.rho === 1800);
console.log(out.join('\n'));
