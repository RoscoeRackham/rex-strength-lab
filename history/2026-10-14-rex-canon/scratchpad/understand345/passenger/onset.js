global.window = {};
const ROOT = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/main-tree/rex-strength-lab';
const P = require(ROOT + '/src/engine.js'); require(ROOT + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g, R = P.RESTRAINT, M = R.MOVES;
const body = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const F = 100 * 907.18474 * g;
const oldPass = M.throw.passenger; M.throw.passenger = (r, o) => (o.safePassenger ? false : oldPass(r, o));
for (const sp of [false, true]) for (const four of [true, false]) {
  const pw = four ? { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true } : { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
  const c = Object.assign({ F, mode: 'comic', body, surface: D.surfaces.find((s) => s.id === 'concrete'), anchor: 'friction', safePassenger: sp }, pw);
  const p = R.planNow('throw', c, { near: 5, target: 30, obj: D.objects.find((o) => o.id === 'person'), angle: 45, safePassenger: sp, silentStrike: false, softLanding: false });
  const gl = p.goal(), ce = p.ceiling();
  const onset = ce.by ? Math.sqrt(ce.below * ce.use) : null;
  console.log(JSON.stringify({ sp, four, goal_kgf: gl.use / g, ceilingBy: ce.by, use_kgf: ce.use / g, below_kgf: ce.below / g, onset_kgf: onset && onset / g, onsetPct: onset && 100 * onset / F, goalPct: 100 * gl.use / F, runs: p.runs() }));
}
