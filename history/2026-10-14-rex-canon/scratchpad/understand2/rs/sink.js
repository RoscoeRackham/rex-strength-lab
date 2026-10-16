// The throw's 'ground' preset (run on real ground with ownRecoil still on): is it set by the push's downward part on
// the bolted stance (his recoil)? Compare sinkRatio with the weights alone.
global.window = {};
const root = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(root + '/src/engine.js');
require(root + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g, R = P.RESTRAINT;
const sf = (id) => D.surfaces.find((s) => s.id === id), ob = (id) => D.objects.find((o) => o.id === id);
const sig = (x, n = 3) => (typeof x !== 'number' ? String(x) : !isFinite(x) ? String(x) : Number(x.toPrecision(n)));
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3000 });
const POW = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
for (const [sid, oid, ang, dial] of [['concrete', 'car', 45, 1e12], ['concrete', 'bus', 90, 1e9], ['asphalt', 'bus', 45, 1e9], ['asphalt', 'semi', 90, 1e9], ['asphalt', 'loco', 0, 1e9], ['concrete', 'car', 0, 1e12], ['granite', 'car', 45, 1e12]]) {
  const c = Object.assign({ F: dial * g, mode: 'comic', body: rex, surface: sf(sid), anchor: 'friction' }, POW);
  const p = R.planNow('throw', c, { near: 5, target: 30, obj: ob(oid), angle: ang });
  const pg = p.result('preset:ground');
  let detail = '';
  if (!pg.never) {
    const r = p.runReal(pg.use), Nmax = r.anchor.Nmax, Nw = (rex.m + ob(oid).m) * g;
    detail = 'at the preset: sinkRatio ' + sig(r.sinkRatio) + ', weights alone ' + sig(Nw / Nmax) + ', basis ' + (r.basis || 'comic');
    // with ownRecoil off too (they mean to break it): friction footing
    const r2 = P.throwObject(Object.assign({}, c, { unbreakable: false, ownRecoil: false, use: pg.use }), ob(oid), ang);
    detail += '; same effort with ownRecoil off too: sinkRatio ' + sig(r2.sinkRatio) + ', recoilV ' + sig(r2.recoilV);
  }
  console.log(sid, oid, ang, dial, 'ground preset', pg.never ? 'never' : sig(pg.use / g) + ' kgf', detail);
}
