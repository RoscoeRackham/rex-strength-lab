const repo = process.argv[2];
global.window = {};
const P = require(repo + '/rex-strength-lab/src/engine.js');
require(repo + '/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const ctxOf = (F, extra) => Object.assign({ F, mode: 'comic', body: rex, surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, extra || {});
const R = P.RESTRAINT, M = R.MOVES.jump;
for (const [sid, kg] of [['ice', 1e12], ['concrete', 1e7], ['concrete', 1e12], ['granite', 1e12]]) {
  const c = ctxOf(kg * g, { surface: surf(sid) });
  const p = R.planNow('jump', c, { target: 3, near: 5 });
  const hz = p.hazards().map((h) => h.id + ':' + (h.never ? 'never' : (h.use / g).toPrecision(3)));
  const pr = p.presets().map((h) => h.id + ':' + (h.never ? 'never' : (h.use / g).toPrecision(3)));
  const ce = p.ceiling();
  const all = p.run(p.hi);
  const nowAll = R.HAZARDS.filter((h) => h.test(M, all, p.opt)).map((h) => h.id);
  const presAll = R.PRESETS.filter((h) => h.test(M, all, p.opt)).map((h) => h.id);
  console.log(sid, kg, 'ceiling by', ce.by, ce.by ? (ce.use / g).toPrecision(3) : '', '| hazards', hz.join(' '), '| presets', pr.join(' '), '| all-out v', M.speed(all).toFixed(1), 'hazards', nowAll.join(','), 'presets', presAll.join(','));
}
// speed scan
const c = ctxOf(1e12 * g, { surface: surf('concrete') });
const [lo, hi] = [0.01 * rex.m * g, 1e12 * g];
for (let i = 0; i < 14; i++) { const u = lo * Math.pow(10, i / 2); const r = M.run(Object.assign({}, c, { use: u }), { near: 5, target: 3, surface: c.surface, body: rex, m: rex.m, groundHolds: false }); console.log(i, (u / g).toExponential(2), M.speed(r).toFixed(3), r.groundFails); }
