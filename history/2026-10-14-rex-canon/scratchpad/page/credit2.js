global.window = {};
const R = '/home/user/rex-strength-lab/rex-strength-lab/';
const P = require(R + 'src/engine.js'); require(R + 'src/data.js');
const D = window.DINO_DATA, g = P.K.g, M = P.RESTRAINT.MOVES.throw;
const surf = (id) => D.surfaces.find((x) => x.id === id), obj = (id) => D.objects.find((x) => x.id === id);
const rex = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const H = P.RESTRAINT.HAZARDS.find((h) => h.id === 'plaster');
const t0 = Date.now();
for (const sf of ['concrete', 'sand', 'gravel', 'asphalt', 'softclay', 'granite']) for (const oid of ['baseball', 'shot', 'piano', 'motorcycle', 'pickup', 'semi', 'tank', 'loco']) for (const ang of [0, 20, 45, 70, 90]) for (const lk of [5, 7, 9, 11]) {
  const c = Object.assign({ F: Math.pow(10, lk) * g, mode: 'comic', body: rex, surface: surf(sf), anchor: 'friction' }, ON);
  const o = { obj: obj(oid), angle: ang, target: 30 };
  const p = P.RESTRAINT.plan('throw', c, o);
  const res = p.ensure('hazard:plaster');
  if (!res.never) continue;
  const sw = { ownRecoil: false }, c0 = Object.assign({}, c, sw), o0 = Object.assign({}, p.opt, sw), r0 = M.run(c0, o0);
  const off = H.test(M, r0, o0), from = M.shakeFrom(r0, o0);
  if (off) console.log(sf, oid, ang, lk, 'never on; off all-out plaster', off, 'from', from);
}
console.log('done', (Date.now() - t0) / 1000, 's');
