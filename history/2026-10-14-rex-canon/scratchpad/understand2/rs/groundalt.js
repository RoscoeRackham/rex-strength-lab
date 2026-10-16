// The throw's 'break the ground' preset if it set aside They take their own recoil too (option A), vs today's
global.window = {};
const root = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(root + '/src/engine.js');
require(root + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g, R = P.RESTRAINT;
const sf = (id) => D.surfaces.find((s) => s.id === id), ob = (id) => D.objects.find((o) => o.id === id);
const sig = (x, n = 3) => (typeof x !== 'number' ? String(x) : !isFinite(x) ? String(x) : Number(x.toPrecision(n)));
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3000 });
for (const [sid, oid, ang, dial] of [['concrete', 'car', 45, 1e12], ['concrete', 'bus', 90, 1e9], ['concrete', 'car', 90, 1e12], ['concrete', 'semi', 45, 1e12], ['granite', 'car', 45, 1e12]]) {
  const base = { F: dial * g, mode: 'comic', body: rex, surface: sf(sid), anchor: 'friction', airAbsorb: 1, keepForm: true };
  const o = { near: 5, target: 30, obj: ob(oid), angle: ang };
  const today = R.planNow('throw', Object.assign({}, base, { unbreakable: true, ownRecoil: true }), o).result('preset:ground');
  const A = R.planNow('throw', Object.assign({}, base, { unbreakable: false, ownRecoil: false }), o).result('hazard:ground');
  const r = A.never ? null : P.throwObject(Object.assign({}, base, { unbreakable: false, ownRecoil: false, use: A.use }), ob(oid), ang);
  console.log(sid, oid, ang, sig(dial), '| today', today.never ? 'never' : sig(today.use / g), '| both set aside', A.never ? 'never' : sig(A.use / g) + (r ? ' (heldBack ' + r.heldBack + ', recoilV ' + sig(r.recoilV) + ')' : ''));
}
