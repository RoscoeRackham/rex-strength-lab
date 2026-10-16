// node pullceil.js : main vs branch pull ceilings and presets, page-style plan
const path = require('path');
const B = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r3/verify-code/';
function load(dir) {
  const ePath = require.resolve(B + dir + '/rex-strength-lab/src/engine.js'), dPath = require.resolve(B + dir + '/rex-strength-lab/src/data.js');
  delete require.cache[ePath]; delete require.cache[dPath];
  const P = require(ePath); global.window = {}; require(dPath); return { P, D: global.window.DINO_DATA };
}
const engines = { main: load('mainrepo'), branch: load('repo') };
const fmt = (x) => x == null ? '-' : (x === 'never' || x === 'none' ? x : Math.round(x).toLocaleString('en-US'));
function run(name, kgDial, surfaceId, anchor, objId) {
  const { P, D } = engines[name], g = P.K.g;
  const body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
  const c = { F: kgDial * g, mode: 'comic', body, surface: D.surfaces.find((s) => s.id === surfaceId), anchor, airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: false, silentStrike: false, softLanding: false };
  const o = { near: 5, target: 10, obj: D.objects.find((x) => x.id === objId) };
  const p = P.RESTRAINT.planNow('pull', c, o);
  const ce = p.ceiling();
  const pr = (id) => { const r = p.result('preset:' + id); return r.never ? 'never' : r.use / g; };
  const all = p.run(c.F);
  return { ceil: ce.by ? ce.below / g : 'none', by: ce.by, rattle: pr('rattle'), plaster: pr('plaster'), t: all.t10m };
}
const objs = (process.argv[2] || 'person,motorcycle,piano,bar511,car,pickup,bus,semi,tank,loco,cc177,b777').split(',');
for (const [kg, surf, anc] of [[90718.474, 'sand', 'friction'], [90718.474, 'concrete', 'friction'], [90718.474, 'concrete', 'bolted'], [90718.474, 'sand', 'bolted'], [1e6, 'concrete', 'bolted'], [1e6, 'asphalt', 'friction'], [1e6, 'gravel', 'friction']]) {
  console.log('### dial ' + kg + ' kg, ' + surf + ', ' + anc);
  for (const ob of objs) {
    const m = run('main', kg, surf, anc, ob), b = run('branch', kg, surf, anc, ob);
    console.log(ob.padEnd(10) + ' ceiling ' + (fmt(m.ceil) + ' (' + m.by + ')').padEnd(22) + ' -> ' + (fmt(b.ceil) + ' (' + b.by + ')').padEnd(22) + ' rattle ' + fmt(m.rattle).padEnd(9) + ' -> ' + fmt(b.rattle).padEnd(9) + ' plaster ' + fmt(m.plaster).padEnd(9) + ' -> ' + fmt(b.plaster).padEnd(9) + ' t ' + (m.t||0).toFixed(3) + ' -> ' + (b.t||0).toFixed(3));
  }
}
