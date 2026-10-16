// main vs branch: the pull's least disruptive effort (kg-force) and its time, and all-out times, by load and footing
const path = require('path');
const load = (dir) => { global.window = {}; const e = path.join(dir, 'src/engine.js'), d = path.join(dir, 'src/data.js'); delete require.cache[require.resolve(e)]; delete require.cache[require.resolve(d)]; const P = require(e); require(d); return { P, D: global.window.DINO_DATA }; };
const E = { main: load('/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/main-tree/rex-strength-lab'), branch: load('/home/user/rex-strength-lab/rex-strength-lab') };
function run(name, kg, surfaceId, anchor, objId) {
  const { P, D } = E[name], g = P.K.g, body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
  const c = { F: kg * g, mode: 'comic', body, surface: D.surfaces.find((s) => s.id === surfaceId), anchor, airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const o = { near: 5, target: 10, obj: D.objects.find((x) => x.id === objId), silentStrike: false, softLanding: false, safePassenger: true };
  const p = P.RESTRAINT.planNow('pull', c, o);
  // the page's least disruptive effort (resolveEffort): the goal's effort, unless something is harmed there; then the
  // courtesy ceiling (or the floor, p.lo)
  const gl = p.goal(), want = gl.reached ? gl.use : c.F, M = P.RESTRAINT.MOVES.pull;
  let use = want;
  if (P.RESTRAINT.HAZARDS.some((h) => h.test(M, p.run(want), p.opt))) { const ce = p.ceiling(); if (ce.by) use = ce.below > 0 ? ce.below : p.lo; }
  const rl = p.run(use), ra = p.run(c.F);
  const sh = P.RESTRAINT.MOVES.pull.shake(ra, Object.assign({ surface: c.surface }, c, o)), ppv = sh ? P.ppvAt(sh, 5) : 0;
  return { least: use / g, tl: rl.t10m, ta: ra.t10m, ppv, legs: ra.walkPush ? ra.walkPush.J / ra.walkPush.T / ra.usable : null };
}
for (const [kg, surf, anc] of [[90718.474, 'concrete', 'friction'], [90718.474, 'concrete', 'bolted']]) {
  console.log('### ' + kg + ' ' + surf + ' ' + anc);
  for (const ob of ['baseball', 'person', 'motorcycle', 'piano', 'car', 'pickup', 'bus']) {
    const m = run('main', kg, surf, anc, ob), b = run('branch', kg, surf, anc, ob);
    console.log(ob.padEnd(10), 'least', m.least.toFixed(1), '->', b.least.toFixed(1), 'kg-f; t', m.tl.toFixed(2), '->', b.tl.toFixed(2), 's; allout t', m.ta.toFixed(3), '->', b.ta.toFixed(3), '; ppv5 mm/s', (m.ppv * 1000).toFixed(4), '->', (b.ppv * 1000).toFixed(4), '; legs/use', m.legs && m.legs.toFixed(3), '->', b.legs && b.legs.toFixed(3));
  }
}
