// usage: node sweepw.js <which: branch|main> <kg> <angles csv> <objs csv> <surfs csv> -> JSON lines
const which = process.argv[2];
const base = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r2/physics/' + (which === 'main' ? 'main-wt' : 'repo') + '/rex-strength-lab';
const P = require(base + '/src/engine.js'); global.window = {}; require(base + '/src/data.js'); const D = window.DINO_DATA;
const kg = +process.argv[3], angles = process.argv[4].split(',').map(Number), objs = process.argv[5].split(','), surfs = process.argv[6].split(',');
const pw = JSON.parse(process.argv[7] || '{"airAbsorb":1,"keepForm":true,"unbreakable":true,"ownRecoil":true}');
const body = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const out = {};
for (const s of surfs) for (const oid of objs) for (const a of angles) {
  const obj = D.objects.find(o => o.id === oid), surface = D.surfaces.find(x => x.id === s);
  const c = Object.assign({ F: kg * P.K.g, mode: 'comic', body, surface, anchor: 'friction', safePassenger: false, silentStrike: false, softLanding: false }, pw);
  const p = P.RESTRAINT.planNow('throw', c, { near: P.RESTRAINT.R.NEAR, target: 30, obj, angle: a, silentStrike: false, softLanding: false, safePassenger: false });
  const ce = p.ceiling(), pr = p.presets(), g = p.goal();
  const f = (r) => r.never ? 'never' : r.onlyUnlimited ? 'unl' : +(r.use / P.K.g).toPrecision(4);
  out[[s, oid, a].join('|')] = { ceil: ce.by ? f(ce) + ':' + ce.by : 'none', goal: f(g), presets: pr.map(r => r.id + ':' + f(r)).join(' ') };
}
console.log(JSON.stringify(out));
