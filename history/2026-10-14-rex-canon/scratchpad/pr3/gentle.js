// The other reading of 'manageable' at the landing: a gentle 1.5 g stop. Where would the ceiling go?
global.window = {};
const ROOT = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(ROOT + '/src/engine.js'); require(ROOT + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g, R = P.RESTRAINT, M = R.MOVES;
const person = D.objects.find((o) => o.id === 'person'), sf = (id) => D.surfaces.find((s) => s.id === id);
const body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
const sig = (x) => Number(x.toPrecision(3));
const real = M.throw.landShake;
M.throw.landShake = (r, o) => { const s = real(r, o); if (!s || !(o.safePassenger && o.obj.passenger)) return s; const v = r.flight.vImpact; return P.impulseSource(o.surface, P.vToMomentum(v, o.obj.m), v / (1.5 * g)); };
for (const kg of [100 * 907.18474, 1e6, 1e9]) {
  const c = { F: kg * g, mode: 'comic', body, surface: sf('concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true };
  const p = R.planNow('throw', c, { near: 5, target: 30, obj: person, angle: 45, safePassenger: true });
  const ce = p.ceiling();
  console.log(sig(kg), 'kg dial: ceiling', ce.by || 'none', ce.by ? sig(Math.sqrt(ce.use * ce.below) / g) : '', '| presets', p.presets().map((x) => x.id + ':' + (x.never ? 'never' : sig(x.use / g))).join(' '));
}
