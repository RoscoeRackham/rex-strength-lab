// Risk sweep for BRIEF-canon item 2: does the throw's courtesy ceiling or any preset move when his push stops shaking
// the ground (runs.js's own patch: throw.shake = landing only when ownRecoil)? Also: least effort for a 30 m goal.
// argv: surfaces (comma), objects (comma), angles (comma), dials (comma, kg or 'F0'), powers ('all' | 'noUnbreak')
global.window = {};
const root = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(root + '/src/engine.js');
require(root + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g, R = P.RESTRAINT;
const sf = (id) => D.surfaces.find((s) => s.id === id), ob = (id) => D.objects.find((o) => o.id === id);
const sig = (x, n = 3) => (typeof x !== 'number' ? String(x) : !isFinite(x) ? String(x) : Number(x.toPrecision(n)));
const F0 = 100 * 907.18474 * g;
const [sArg, oArg, aArg, dArg, pw, tgt] = process.argv.slice(2);
const POW = pw === 'noUnbreak' ? { airAbsorb: 1, keepForm: true, unbreakable: false, ownRecoil: true } : { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3000 });
// share runs between the old and new plans (runs don't depend on shake)
const run0 = R.MOVES.throw.run, cache = new Map();
R.MOVES.throw.run = (c, o) => { const k = [c.F, c.use, c.surface.id, o.obj.id, o.angle, c.unbreakable, c.ownRecoil, c.airAbsorb, c.keepForm].join('|'); let r = cache.get(k); if (!r) { r = run0(c, o); cache.set(k, r); } return r; };
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
  const o = { near: 5, target: Number(tgt || 30), obj: ob(oid), angle: ang };
  const res = {};
  for (const on of [false, true]) {
    setNew(on);
    const p = R.planNow('throw', c, o), ce = p.ceiling(), pr = p.presets(), L = least(p);
    const atCe = p.run(ce.by ? ce.use : undefined);
    res[on ? 'new' : 'old'] = { ce: ce.by ? ce.by + '@' + sig(ce.use / g) : 'none', pr: pr.map((x) => x.id + ':' + fmt(x)).join(' '), least: L === undefined ? 'allout' : sig(L / g), from: R.MOVES.throw.shakeFrom(atCe, p.opt) };
  }
  const moved = res.old.ce !== res.new.ce || res.old.pr !== res.new.pr || res.old.least !== res.new.least;
  rows.push({ sid, oid, ang, d, moved, old: res.old, new: res.new });
  if (moved) console.log('MOVED', sid, oid, ang, d, JSON.stringify(res));
}
console.log('cases', rows.length, 'moved', rows.filter((r) => r.moved).length);
require('fs').writeFileSync(process.argv[8] || 'sweep-out.json', JSON.stringify(rows, null, 1));
