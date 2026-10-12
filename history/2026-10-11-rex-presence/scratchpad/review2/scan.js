// Dense scan of every effort move: goal minimal, ceiling harmless below, named hazard on at use, presets minimal.
const { P, D, g, surf, obj, rex, ollie, ctxOf } = require('./common.js');
const R = P.RESTRAINT;
const PER = Number(process.env.PER || 12);
const only = process.argv[2];
const bodies = {
  rex, cal: P.makeBody({}), rex50: P.makeBody({ build: 'rex', H: 50, m: 3007 * Math.pow(50 / 3.048, 3) }),
};
const strengths = [1e3, 90718, 1e7, 1e12, Infinity];
const surfaces = ['concrete', 'sand', 'softclay', 'granite', 'ice'];
const moveOpts = {
  throw: [{ obj: obj('car'), angle: 45, target: 30 }, { obj: obj('person'), angle: 45, target: 30 }, { obj: obj('baseball'), angle: 30, target: 30 }, { obj: obj('piano'), angle: 90, target: 10 }, { obj: obj('desoto'), angle: 45, target: 30 }],
  jump: [{ target: 3 }, { target: 0.3 }],
  stomp: [{}],
  punch: [{ target: 10.4 }],
  clap: [{ target: 6 }],
  sprint: [{ target: 12.42 }],
  pull: [{ obj: obj('bus'), target: 10 }],
};
const issues = [];
let nconf = 0;
for (const [bk, body] of Object.entries(bodies)) for (const Fk of strengths) for (const mode of ['comic', 'real']) for (const sid of surfaces) for (const [mv, list] of Object.entries(moveOpts)) for (const o0 of list) {
  if (only && mv !== only) continue;
  const F = Fk * g * (bk === 'rex50' ? Math.pow(50 / 3.048, 3) : bk === 'cal' ? 180/3007 : 1);
  const c = { F, mode, body, surface: surf(sid), groundHolds: false, anchor: 'friction' };
  const o = Object.assign({ near: 5 }, o0);
  const p = R.planNow(mv, c, o);
  nconf++;
  const M = R.MOVES[mv];
  const gl = p.goal(), ce = p.ceiling();
  const tag = [bk, Fk, mode, sid, mv, o.obj ? o.obj.id : '', o.angle || '', o.target || ''].join('|');
  const hiScan = isFinite(p.hi) ? p.hi : Math.min(p.hi, 1e22 * g);
  const n = Math.ceil(PER * Math.log10(hiScan / p.lo));
  const haz = (r) => R.HAZARDS.filter((h) => h.test(M, r, p.opt)).map((h) => h.id);
  const firstOn = {};
  for (let k = 0; k <= n; k++) {
    const u = p.lo * Math.pow(hiScan / p.lo, k / n);
    const r = p.run(u);
    if (gl.reached && u < gl.use * (1 - 0.006) && M.goal(r, p.opt)) issues.push(tag + ' GOAL-NOT-MINIMAL at ' + (u / g).toPrecision(3) + ' kg < goal ' + (gl.use / g).toPrecision(3));
    if (!gl.reached && !gl.onlyUnlimited && M.goal(r, p.opt)) issues.push(tag + ' GOAL-UNREACHABLE-BUT-REACHED at ' + (u / g).toPrecision(3));
    const hz = haz(r);
    if (ce.by && u <= ce.below && hz.length) issues.push(tag + ' HAZARD-BELOW-CEILING ' + hz.join(',') + ' at ' + (u / g).toPrecision(3) + ' kg; ceiling ' + (ce.below / g).toPrecision(3));
    if (!ce.by && hz.length) issues.push(tag + ' HAZARD-BUT-NO-CEILING ' + hz.join(',') + ' at ' + (u / g).toPrecision(3));
    for (const pr of R.PRESETS) if (!(pr.id in firstOn) && pr.test(M, r, p.opt)) firstOn[pr.id] = u;
  }
  if (ce.by && ce.below > 0) {
    if (!R.HAZARDS.find((h) => h.id === ce.by).test(M, p.run(ce.use), p.opt)) issues.push(tag + ' CEILING-HAZARD-NOT-ON-AT-USE ' + ce.by);
  }
  for (const pr of R.PRESETS) {
    const res = p.result('preset:' + pr.id);
    if (res.never && firstOn[pr.id] !== undefined) issues.push(tag + ' PRESET-NEVER-BUT-ON ' + pr.id + ' at ' + (firstOn[pr.id] / g).toPrecision(3));
    if (!res.never && firstOn[pr.id] !== undefined && firstOn[pr.id] < res.use * (1 - 0.006)) issues.push(tag + ' PRESET-NOT-MINIMAL ' + pr.id + ' scan ' + (firstOn[pr.id] / g).toPrecision(3) + ' < ' + (res.use / g).toPrecision(3));
  }
}
console.log('configs', nconf, 'issues', issues.length);
const byKind = {};
for (const s of issues) { const k = s.split(' ')[1]; (byKind[k] = byKind[k] || []).push(s); }
for (const [k, v] of Object.entries(byKind)) { console.log('==', k, v.length); const seen = new Set(); for (const s of v) { const key = s.split(' ')[0]; if (seen.has(key)) continue; seen.add(key); console.log(s); } }
