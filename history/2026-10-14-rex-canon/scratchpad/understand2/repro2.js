// Copy of runs.js's item-2 part. argv[2]: 'old' pins kV 0.10017 & m 3007 (as runs.json was made); 'now' uses DEFAULT_BODIES (3000 kg, kV 0.099947)
global.window = {};
const root = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(root + '/src/engine.js');
require(root + '/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g, R = P.RESTRAINT;
const sf = (id) => D.surfaces.find((s) => s.id === id);
const ob = (id) => D.objects.find((o) => o.id === id);
const sig = (x, n = 3) => (typeof x !== 'number' ? String(x) : !isFinite(x) ? String(x) : Number(x.toPrecision(n)));
const kgf = (u) => (u === undefined ? 'all-out' : sig(u / g) + ' kg-force');
const ppv = (src, d) => (src ? P.ppvAt(src, d) * 1000 : 0);
const F0 = 100 * 907.18474 * g;
const POW = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const MODE = process.argv[2] || 'old';
if (MODE === 'old') { P.BUILDS.rex.kV = P.BUILDS.ollie.kV = 0.10017; }
const M = MODE === 'old' ? 3007 : 3000;
const body = (b, m) => P.makeBody({ build: b, H: 3.048, m: m || M });
const ctxOf = (m, extra) => Object.assign({ F: F0, mode: 'comic', body: body('rex', m), surface: sf('concrete'), anchor: 'friction' }, POW, extra || {});
function least(move, c, o) {
  const p = R.planNow(move, c, o), gl = p.goal(), want = gl.never || gl.onlyUnlimited ? undefined : gl.use;
  const rr = p.run(want), Mv = R.MOVES[move], ce = p.ceiling();
  if (!R.HAZARDS.some((h) => h.test(Mv, rr, p.opt))) return { p, use: want, r: rr, capped: false, ce };
  const use = ce.below > 0 ? ce.below : p.lo;
  return { p, use, r: p.run(use), capped: true, ce };
}
const ceilingText = (ce) => (ce.by ? ce.by + ' at ' + kgf(ce.use) : 'none');
const oldThrowShake = R.MOVES.throw.shake, oldShakeFrom = R.MOVES.throw.shakeFrom, oldPullShake = R.MOVES.pull.shake;
function newRecoil(on) {
  R.MOVES.throw.shake = on ? (r, o) => (o.ownRecoil ? R.MOVES.throw.landShake(r, o) : oldThrowShake(r, o)) : oldThrowShake;
  R.MOVES.throw.shakeFrom = on ? (r, o) => (o.ownRecoil ? 'landing' : oldShakeFrom(r, o)) : oldShakeFrom;
  R.MOVES.pull.shake = on ? () => null : oldPullShake;
}
function throwRun(m, objId, extra, oExtra) {
  const o = Object.assign({ near: 5, target: 30, obj: ob(objId), angle: 45 }, oExtra || {});
  const c = ctxOf(m, extra), L = least('throw', c, o);
  const A = R.MOVES.throw.run(Object.assign({}, c, { use: undefined }), L.p.opt);
  const shakes = (r) => [].concat(R.MOVES.throw.shake(r, L.p.opt) || []).filter(Boolean);
  const own = (r) => (r.toGround && R.MOVES.throw.shake === oldThrowShake ? P.impulseSource(c.surface, r.toGround.J, Math.max(1e-9, r.toGround.T)) : null);
  const land = (r) => R.MOVES.throw.landShake(r, L.p.opt);
  const side = (r) => ({
    v: sig(r.v), range: sig(r.flight && r.flight.range), leaves: !!(r.flight && (r.flight.relativistic || r.flight.escaped || r.flight.orbit || !r.flight.landed)),
    toGroundJ: own(r) ? sig(r.toGround.J) : 0, toGroundSupplied: own(r) && r.toGround.supplied ? sig(r.toGround.supplied) : 0,
    ppv5_hisPush: sig(ppv(own(r), 5)), ppv5_landing: sig(ppv(land(r), 5)), plasterReach_m: sig(shakes(r).length ? P.plasterReach(shakes(r)) : 0),
    airTakenBack_J: r.flight && r.flight.ocean ? sig(r.flight.ocean.E) : 0, Eobj_J: sig(r.Eobj),
  });
  return { volume_m3: sig(c.body.volume, 4), least: Object.assign({ effort: kgf(L.use), capped: L.capped }, side(L.r)), ceiling: ceilingText(L.ce), allout: side(A),
    presets: L.p.presets().map((x) => x.id + ': ' + (x.never ? 'never' : kgf(x.use))).join(', ') };
}
const out = {};
for (const [tag, on] of [['old, into the planet', false], ['new, into their source', true]]) {
  newRecoil(on);
  const x = {};
  x.throwCar30m = throwRun(M, 'car');
  x.throwCar30m_dial1e12 = throwRun(M, 'car', { F: 1e12 * g });
  x.throwBusUp1km_dial1e9 = throwRun(M, 'bus', { F: 1e9 * g }, { angle: 90, target: 1000 });
  { const c = ctxOf(M), pl = least('pull', c, { near: 5, target: 10, obj: ob('car') }), A = R.MOVES.pull.run(Object.assign({}, c, { use: undefined }), { obj: ob('car') });
    x.pullCar10s = { least: kgf(pl.use), allout_ppv5: sig(ppv(R.MOVES.pull.shake(A, pl.p.opt), 5)), ceiling: ceilingText(pl.ce) }; }
  out['2 recoil, ' + tag] = x;
}
newRecoil(false);
{
  const cR = ctxOf(M), cO = Object.assign(ctxOf(M), { body: body('ollie') });
  const s = P.shove(cR, cO), src = s.toGround ? P.impulseSource(cR.surface, s.toGround.J, Math.max(1e-9, s.toGround.T)) : null;
  out['2 recoil, Rex shoves Ollie (old; new drops the push)'] = { ollieV: sig(s.vB), ollieSlide_m: sig(s.slideB), rexV: sig(s.vA), toGroundJ: sig(s.toGround ? s.toGround.J : 0), ppv5: sig(ppv(src, 5)) };
  const F9 = 1e9 * g, cR9 = ctxOf(M, { F: F9 }), cO9 = Object.assign(ctxOf(M, { F: F9 }), { body: body('ollie') });
  const L = P.catchLeg(cR9, cO9, ob('baseball'), 10, 'hard');
  const sT = L.toGroundT ? P.impulseSource(cR9.surface, L.toGroundT.J, Math.max(1e-9, L.toGroundT.T)) : null, sC = L.toGroundC ? P.impulseSource(cR9.surface, L.toGroundC.J, Math.max(1e-9, L.toGroundC.T)) : null;
  out['2 recoil, game of catch, fastball 10 m, dial 1e9 (old; new drops the thrower\'s push)'] = { result: L.result, throwV: sig(L.aim && L.aim.vL), throwerPushJ: sig(L.toGroundT ? L.toGroundT.J : 0), throwerPPV5: sig(ppv(sT, 5)), catcherStopJ: sig(L.toGroundC ? L.toGroundC.J : 0), catcherPPV5: sig(ppv(sC, 5)) };
  const F20 = 1e20 * g, L20 = P.catchLeg(ctxOf(M, { F: F20 }), Object.assign(ctxOf(M, { F: F20 }), { body: body('ollie') }), ob('baseball'), 10, 'hard');
  out['5Q catch, fastball 10 m, dial 1e20: is the catcher carried off?'] = { result: L20.result, carried: !!(L20.catch && L20.catch.carried), carriedAt_m_s: sig(L20.catch && L20.catch.uAfter) };
}
{ const j = P.jump(ctxOf(M, { F: Infinity })); out['3 audit, unlimited comic jump push-off'] = { groundTakes: j.pushOff.J, pushTime: j.pushOff.T, supplied: String(j.pushOff.supplied) }; }
console.log(JSON.stringify(out, null, 1));
