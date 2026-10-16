// main vs branch: the pull's courtesy ceiling, presets, least effort and all-out time, as the page plans them
const path = require('path');
const base = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r3-recheck/fixes/';
const load = (dir) => { global.window = {}; const e = path.join(dir, 'src/engine.js'), d = path.join(dir, 'src/data.js'); delete require.cache[require.resolve(e)]; delete require.cache[require.resolve(d)]; const P = require(e); require(d); return { P, D: global.window.DINO_DATA }; };
const E = { main: load(base + 'maintree/rex-strength-lab'), branch: load(process.argv[4] || (base + 'repo/rex-strength-lab')) };
const f = (x) => (typeof x === 'string' ? x : x == null ? '-' : x < 100 ? x.toFixed(1) : Math.round(x).toLocaleString('en-US'));
function run(name, kg, sid, anchor, oid) {
  const { P, D } = E[name], g = P.K.g, body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
  const c = { F: kg * g, mode: 'comic', body, surface: D.surfaces.find((s) => s.id === sid), anchor, airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const o = { near: 5, target: 10, obj: D.objects.find((x) => x.id === oid), silentStrike: false, softLanding: false, safePassenger: true };
  const p = P.RESTRAINT.planNow('pull', c, o), ce = p.ceiling();
  const pr = (id) => { const r = p.result('preset:' + id); return r.never ? 'never' : r.use / g; };
  const gl = p.goal(), all = p.run(c.F); const lu = gl.never ? (ce.by ? ce.below : c.F) : (ce.by ? Math.min(gl.use, ce.below) : gl.use); const least = { use: lu };
  let lt = null; if (least && least.use != null) { const rr = P.pull(Object.assign({}, c, { use: least.use }), o.obj); lt = rr.t10m; }
  return { ceil: ce.by ? ce.below / g : 'none', by: ce.by || '', rattle: pr('rattle'), plaster: pr('plaster'), t: all.t10m, least: least && least.use != null ? least.use / g : null, lt };
}
const objs = process.argv[2].split(','), cases = JSON.parse(process.argv[3]);
for (const [kg, s, a] of cases) {
  console.log('### ' + kg + ' kg, ' + s + ', ' + a);
  for (const ob of objs) { const m = run('main', kg, s, a, ob), b = run('branch', kg, s, a, ob);
    console.log(ob.padEnd(10) + ' ceil ' + (f(m.ceil) + ' ' + m.by).padEnd(16) + '-> ' + (f(b.ceil) + ' ' + b.by).padEnd(16) + ' rattle ' + f(m.rattle).padEnd(8) + '-> ' + f(b.rattle).padEnd(8) + ' plaster ' + f(m.plaster).padEnd(8) + '-> ' + f(b.plaster).padEnd(8) + ' least ' + f(m.least) + ' (' + (m.lt || 0).toFixed(2) + ' s) -> ' + f(b.least) + ' (' + (b.lt || 0).toFixed(2) + ' s) allout ' + (m.t || 0).toFixed(3) + ' -> ' + (b.t || 0).toFixed(3)); }
}
