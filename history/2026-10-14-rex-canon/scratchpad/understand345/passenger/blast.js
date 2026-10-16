// The landing blast with Safe passenger: main engine vs the scratch PR3 engine (landing energy taken back), a person
// thrown 30 m at 45° on a 10^9 kg dial, the default powers on; and passengerLanding at the least effort.
global.window = {};
const ROOT = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/main-tree/rex-strength-lab';
require(ROOT + '/src/data.js');
const D = window.DINO_DATA;
const sig = (x, n = 3) => (typeof x !== 'number' || !isFinite(x) ? String(x) : Number(x.toPrecision(n)));
for (const [lab, file] of [['main', ROOT + '/src/engine.js'], ['PR3 scratch', __dirname + '/engine-pr3.js']]) {
  const P = require(file), g = P.K.g, R = P.RESTRAINT;
  const body = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), person = D.objects.find((o) => o.id === 'person');
  for (const dial of [100 * 907.18474, 1e9]) {
    const c = { F: dial * g, mode: 'comic', body, surface: D.surfaces.find((s) => s.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true };
    const p = R.planNow('throw', c, { near: 5, target: 30, obj: person, angle: 45, safePassenger: true });
    const ce = p.ceiling(), gl = p.goal();
    const pre = p.presets().map((x) => x.id + ': ' + (x.never ? 'never' : x.onlyUnlimited ? 'unlimited' : sig(x.use / g) + ' kgf')).join(', ');
    const haz = p.hazards().map((x) => x.id + ': ' + (x.never ? 'never' : sig(x.use / g) + ' kgf')).join(', ');
    const pl = R.MOVES.throw.passengerLanding ? R.MOVES.throw.passengerLanding(p.run(gl.use), p.opt) : 'n/a';
    console.log(lab, '| dial', sig(dial), 'kg | least', sig(gl.use / g), '| ceiling', ce.by, sig(ce.use / g), '| hazards', haz, '| presets', pre, '| passengerLanding at least', JSON.stringify(pl && pl.absorbed ? { absorbed: sig(pl.absorbed), J: sig(pl.J) } : pl));
  }
}
