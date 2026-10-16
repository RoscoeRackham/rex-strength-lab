// main (960fdfa) vs this branch (the re-check's fixes): the pull's courtesy ceiling and presets, planned as the page plans
// them (RESTRAINT.planNow; comic, all four powers on, the 3,000 kg Rex, near 5 m, goal 10 s), in kg-force
const path = require('path');
const load = (dir) => { global.window = {}; const e = path.join(dir, 'src/engine.js'), d = path.join(dir, 'src/data.js'); delete require.cache[require.resolve(e)]; delete require.cache[require.resolve(d)]; const P = require(e); require(d); return { P, D: global.window.DINO_DATA }; };
const engines = { main: load('/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/main-tree/rex-strength-lab'), branch: load('/home/user/rex-strength-lab/rex-strength-lab') };
const fmt = (x) => (typeof x === 'string' ? x : Math.round(x).toLocaleString('en-US'));
function run(name, kg, surfaceId, anchor, objId) {
  const { P, D } = engines[name], g = P.K.g;
  const body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
  const c = { F: kg * g, mode: 'comic', body, surface: D.surfaces.find((s) => s.id === surfaceId), anchor, airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const o = { near: 5, target: 10, obj: D.objects.find((x) => x.id === objId), silentStrike: false, softLanding: false, safePassenger: true };
  const p = P.RESTRAINT.planNow('pull', c, o), ce = p.ceiling();
  const pr = (id) => { const r = p.result('preset:' + id); return r.never ? 'never' : r.use / g; };
  const all = p.run(c.F), least = p.result('least');
  return { m: body.m, ceil: ce.by ? ce.below / g : 'none', by: ce.by || '', rattle: pr('rattle'), plaster: pr('plaster'), t: all.t10m, least: least && least.use != null ? least.use / g : null };
}
const objs = (process.argv[2] || 'person,motorcycle,piano,bar511,car,pickup,bus,semi,tank,loco,cc177,b777').split(',');
const cases = process.argv[3] ? JSON.parse(process.argv[3]) : [[90718.474, 'concrete', 'friction'], [90718.474, 'sand', 'friction'], [90718.474, 'concrete', 'bolted'], [90718.474, 'sand', 'bolted'], [1e6, 'concrete', 'bolted'], [1e6, 'sand', 'bolted'], [1e6, 'asphalt', 'friction'], [1e6, 'gravel', 'friction'], [1e6, 'sand', 'friction']];
for (const [kg, surf, anc] of cases) {
  console.log('### dial ' + kg + ' kg, ' + surf + ', ' + anc);
  for (const ob of objs) {
    const m = run('main', kg, surf, anc, ob), b = run('branch', kg, surf, anc, ob);
    console.log(ob.padEnd(10) + ' ceiling ' + (fmt(m.ceil) + ' ' + m.by).padEnd(18) + ' -> ' + (fmt(b.ceil) + ' ' + b.by).padEnd(18) + ' rattle ' + fmt(m.rattle).padEnd(9) + ' -> ' + fmt(b.rattle).padEnd(9) + ' plaster ' + fmt(m.plaster).padEnd(9) + ' -> ' + fmt(b.plaster).padEnd(9) + ' allout t ' + (m.t || 0).toFixed(3) + ' -> ' + (b.t || 0).toFixed(3) + (m.m !== 3000 || b.m !== 3000 ? ' MASS ' + m.m + '/' + b.m : ''));
  }
}
