const which = process.argv[2];
const ROOT = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r2/verify-copy/' + (which === 'main' ? 'main/repo' : 'repo') + '/rex-strength-lab/src/';
const P = require(ROOT + 'engine.js'); global.window = {}; require(ROOT + 'data.js'); const D = window.DINO_DATA;
const g = P.K.g;
const body = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const objs = JSON.parse(process.argv[3]), surfs = JSON.parse(process.argv[4]), angles = JSON.parse(process.argv[5]);
const out = {};
for (const sid of surfs) for (const oid of objs) for (const a of angles) {
  const surface = D.surfaces.find(s => s.id === sid), obj = D.objects.find(o => o.id === oid);
  const c = { F: 100 * 907.18474 * g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: false, silentStrike: false, softLanding: false };
  const p = P.RESTRAINT.planNow('throw', c, { near: 5, target: 30, silentStrike: false, softLanding: false, safePassenger: false, obj, angle: a });
  const r = p.result('preset:rattle');
  out[sid + ' ' + oid + ' ' + a] = r.never ? 'never' : r.use == null ? 'least?' : Math.round(r.use / g);
}
console.log(JSON.stringify(out));
