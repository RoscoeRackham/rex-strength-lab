// CPU time of each step of the two-player 'least disruptive' search for Catch, reproducing makeDuoPlan's harmAt/same
// (app.html) with the engine's catch legs: the longest single step is the longest the page can block in one probe.
global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g, K = P.K;
const [mode, ob, style, lgArg] = process.argv.slice(2);
const rex = P.makeBody({ build: 'rex', H: P.DEFAULT_BODIES.rex.H, m: P.DEFAULT_BODIES.rex.m }), ol = P.makeBody({ build: 'ollie', H: P.DEFAULT_BODIES.ollie.H, m: P.DEFAULT_BODIES.ollie.m });
const surf = D.surfaces.find((s) => s.id === 'concrete'), o = D.objects.find((x) => x.id === ob);
const FR = lgArg === 'inf' ? Infinity : Math.pow(10, Number(lgArg)) * g;
const need = (m) => P.W8.WALK_LOAD * m * g / P.MUSCLE.jump.forceFrac;
const lo = Math.max(need(rex.m), need(ol.m)), hi = isFinite(FR) ? FR : 1e34 * g;
const memo = new Map(), sigs = new Map();
const fp = (...xs) => xs.map((x) => (typeof x === 'number' ? (isFinite(x) ? x.toPrecision(9) : String(x)) : String(x))).join('|');
let runs = 0;
const harmAt = (u) => {
  const k = u === Infinity ? 'inf' : u;
  if (!memo.has(k)) {
    runs++;
    const F = Math.min(FR, Math.max(u, lo));
    const cR = { F, mode, body: rex, surface: surf, groundHolds: false, anchor: 'friction' }, cO = Object.assign({}, cR, { body: ol });
    const legs = [P.catchLeg(cR, cO, o, 10, style), P.catchLeg(cO, cR, o, 10, style)];
    sigs.set(k, fp(...legs.flatMap((L) => (L ? [L.aim && L.aim.vL, L.vArrive, L.result, L.bursts] : ['none']))));
    memo.set(k, legs.some((L) => L && L.aim && L.aim.vL >= K.a0) ? 'boom' : null);
  }
  return memo.get(k);
};
const same = (u0, u1) => { harmAt(u0); harmAt(u1); harmAt(hi); const a = sigs.get(u0), b = sigs.get(u1); return !!a && a === b && b === sigs.get(hi); };
const s = P.RESTRAINT.search((u) => !!harmAt(u), lo, hi, !isFinite(FR), same, 0.05);
let steps = 0, worst = 0, total = 0;
while (s.use === undefined) { const r0 = runs, t0 = process.cpuUsage(); s.step(); const t = process.cpuUsage(t0); const ms = (t.user + t.system) / 1000; steps++; total += ms; if (ms > worst) worst = ms; if (ms > 400) console.log('step', steps, 'cpu', ms.toFixed(0), 'ms, runs in step', runs - r0); }
console.log({ mode, ob, style, lg: lgArg, steps, runs, worstStepCpuMs: Math.round(worst), totalCpuMs: Math.round(total), use: s.use / g, never: s.never });
