// Like ../sweep.js, with a third column 'full': the shake patch AND his push's downward part taken off the ground's
// bearing (sinkRatio with the weights alone when ownRecoil is on), i.e. 'nothing of their recoil reaches the ground'.
global.window = {};
const root = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(root + '/src/engine.js');
require(root + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g, R = P.RESTRAINT;
const sf = (id) => D.surfaces.find((s) => s.id === id), ob = (id) => D.objects.find((o) => o.id === id);
const sig = (x, n = 3) => (typeof x !== 'number' ? String(x) : !isFinite(x) ? String(x) : Number(x.toPrecision(n)));
const F0 = 100 * 907.18474 * g;
const [sArg, oArg, aArg, dArg, pw, outFile] = process.argv.slice(2);
const POW = pw === 'noUnbreak' ? { airAbsorb: 1, keepForm: true, unbreakable: false, ownRecoil: true } : { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3000 });
const run0 = R.MOVES.throw.run, cache = new Map();
let full = false;
R.MOVES.throw.run = (c, o) => {
  const k = [c.F, c.use, c.surface.id, o.obj.id, o.angle, c.unbreakable, c.ownRecoil, c.airAbsorb, c.keepForm].join('|');
  let r = cache.get(k); if (!r) { r = run0(c, o); cache.set(k, r); }
  if (full && c.ownRecoil && r.canMove && isFinite(r.anchor.Nmax)) {
    const Nw = (c.body.m + o.obj.m) * g;
    return Object.assign({}, r, { sinkRatio: Nw / r.anchor.Nmax });
  }
  if (full && c.ownRecoil && r.sinkRatioRaw != null) return Object.assign({}, r, { sinkRatioRaw: (c.body.m + o.obj.m) * g / (P.qultFor(c.surface, c.body.footB) * 2 * c.body.footArea) });
  return r;
};
const oldShake = R.MOVES.throw.shake, oldFrom = R.MOVES.throw.shakeFrom;
const setNew = (on) => { R.MOVES.throw.shake = on ? (r, o) => (o.ownRecoil ? R.MOVES.throw.landShake(r, o) : oldShake(r, o)) : oldShake; R.MOVES.throw.shakeFrom = on ? (r, o) => (o.ownRecoil ? 'landing' : oldFrom(r, o)) : oldFrom; };
function least(p) {
  const gl = p.goal(), want = gl.never || gl.onlyUnlimited ? undefined : gl.use;
  const rr = p.run(want), ce = p.ceiling();
  if (!R.HAZARDS.some((h) => h.test(R.MOVES.throw, rr, p.opt))) return want;
  return ce.below > 0 ? ce.below : p.lo;
}
const fmt = (x) => (x.never ? 'never' : x.onlyUnlimited ? 'onlyUnl' : sig(x.use / g));
const rows = [];
for (const sid of sArg.split(',')) for (const oid of oArg.split(',')) for (const ang of aArg.split(',').map(Number)) for (const d of dArg.split(',')) {
  const F = d === 'F0' ? F0 : Number(d) * g;
  const c = Object.assign({ F, mode: 'comic', body: rex, surface: sf(sid), anchor: 'friction' }, POW);
  const o = { near: 5, target: 30, obj: ob(oid), angle: ang };
  const res = {};
  for (const [tag, sh, fu] of [['old', false, false], ['new', true, false], ['full', true, true]]) {
    setNew(sh); full = fu;
    const p = R.planNow('throw', c, o), ce = p.ceiling(), pr = p.presets(), L = least(p);
    res[tag] = { ce: ce.by ? ce.by + '@' + sig(ce.use / g) : 'none', pr: pr.map((x) => x.id + ':' + fmt(x)).join(' '), least: L === undefined ? 'allout' : sig(L / g) };
  }
  const moved = JSON.stringify(res.old) !== JSON.stringify(res.new) || JSON.stringify(res.new) !== JSON.stringify(res.full);
  rows.push({ sid, oid, ang, d, moved, res });
}
require('fs').writeFileSync(outFile, JSON.stringify(rows, null, 1));
console.log('done', rows.length);
