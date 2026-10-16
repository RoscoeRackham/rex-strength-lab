// compare PR engine vs base engine with Safe passenger off (and on for non-person objects): plan results must match
const BASE = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/physics/base/rex-strength-lab';
const NEW = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/physics/repo/rex-strength-lab';
global.window = {};
const PB = require(BASE + '/src/engine.js'); require(BASE + '/src/data.js'); const DB = window.DINO_DATA;
global.window = {};
const PN = require(NEW + '/src/engine.js'); require(NEW + '/src/data.js'); const DN = window.DINO_DATA;
const g = PN.K.g;
let n = 0, bad = 0, badOn = 0, nOn = 0;
const run = (P, D, F, x, objId, sp, angle) => {
  const body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
  const ctx = Object.assign({ F, mode: x.mode || 'comic', body, surface: D.surfaces.find(s => s.id === x.surf), anchor: x.anchor, safePassenger: sp }, x.pw);
  const p = P.RESTRAINT.planNow('throw', ctx, { near: 5, target: 30, obj: D.objects.find(o => o.id === objId), angle, safePassenger: sp, silentStrike: false, softLanding: false });
  const res = { goal: p.goal(), hz: p.hazards(), pr: p.presets() };
  const rAll = p.run(isFinite(F) ? F : Infinity);
  res.reach = P.RESTRAINT.reach('throw', rAll, p.opt);
  return JSON.stringify(res);
};
const PW = [{ airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, { airAbsorb: 0.5, keepForm: true, unbreakable: true, ownRecoil: true }, { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }, { airAbsorb: 0, keepForm: true, unbreakable: false, ownRecoil: true }];
const diffs = [];
for (const logKg of [5, 8, 9.15]) for (const pw of PW) for (const surf of ["concrete"]) for (const anchor of ["friction"]) for (const objId of ["person", "car"]) for (const angle of [10, 45]) {
  const F = Math.pow(10, logKg) * g, x = { pw, surf, anchor };
  for (const sp of [false, true]) {
    if (sp && objId === 'person') continue;
    n++;
    const a = run(PB, DB, F, x, objId, sp, angle), b = run(PN, DN, F, x, objId, sp, angle);
    if (a !== b) { bad++; if (diffs.length < 5) diffs.push([logKg, JSON.stringify(pw), surf, anchor, objId, angle, sp].join(' ')); }
  }
}
console.log('cases', n, 'differ', bad, diffs);
