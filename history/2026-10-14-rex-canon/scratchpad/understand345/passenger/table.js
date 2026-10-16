// Reproduce BRIEF-canon.md item 5's table at 3,000 kg, with and without PR2's recoil rule emulated.
global.window = {};
const ROOT = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/main-tree/rex-strength-lab';
const P = require(ROOT + '/src/engine.js');
require(ROOT + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g, R = P.RESTRAINT, M = R.MOVES;
const sf = (id) => D.surfaces.find((s) => s.id === id), ob = (id) => D.objects.find((o) => o.id === id);
const sig = (x, n = 3) => (typeof x !== 'number' || !isFinite(x) ? String(x) : Number(x.toPrecision(n)));
const kgf = (u) => (u === undefined ? 'all-out' : sig(u / g) + ' kg-force');
const F0 = 100 * 907.18474 * g;
const POW = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const OFF4 = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
const body = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const ctxOf = (extra) => Object.assign({ F: F0, mode: 'comic', body, surface: sf('concrete'), anchor: 'friction' }, POW, extra || {});
function least(c, o) {
  const p = R.planNow('throw', c, o), gl = p.goal(), want = gl.never || gl.onlyUnlimited ? undefined : gl.use;
  const rr = p.run(want), ce = p.ceiling();
  if (!R.HAZARDS.some((h) => h.test(M.throw, rr, p.opt))) return { p, use: want, r: rr, capped: false, ce };
  const use = ce.below > 0 ? ce.below : p.lo;
  return { p, use, r: p.run(use), capped: true, ce };
}
// PR2 emulation (runs.js newRecoil): with ownRecoil the throw's shake is the landing only
const oldShake = M.throw.shake, oldFrom = M.throw.shakeFrom, oldPass = M.throw.passenger;
const pr2 = (on) => { M.throw.shake = on ? (r, o) => (o.ownRecoil ? M.throw.landShake(r, o) : oldShake(r, o)) : oldShake; M.throw.shakeFrom = on ? (r, o) => (o.ownRecoil ? 'landing' : oldFrom(r, o)) : oldFrom; };
// PR3 emulation: Safe passenger covers launch, drag (and the catch); never fires with it on
const pr3 = (on) => { M.throw.passenger = on ? (r, o) => (o.safePassenger ? false : oldPass(r, o)) : oldPass; };
function run(label, extra, sp) {
  const o = { near: 5, target: 30, obj: ob('person'), angle: 45, safePassenger: sp };
  const c = ctxOf(Object.assign({ safePassenger: sp }, extra)), L = least(c, o);
  const A = L.p.run(undefined);
  const land = (r) => M.throw.landShake(r, L.p.opt);
  const shakes = (r) => [].concat(M.throw.shake(r, L.p.opt) || []).filter(Boolean);
  const side = (r) => ({ v: sig(r.v), range: sig(r.flight && r.flight.range), vImpact: sig(r.flight && r.flight.vImpact), Eimpact_J: sig(r.Eimpact), fallH_m: sig(r.flight.vImpact ** 2 / (2 * g)), ppv5_landing_mm_s: sig(land(r) ? P.ppvAt(land(r), 5) * 1000 : 0), plasterReach_m: sig(shakes(r).length ? P.plasterReach(shakes(r)) : 0), passengerHaz: M.throw.passenger(r, L.p.opt), dragG: sig(P.PASSENGER.dragG(ob('person'), r.v) * P.dragFactor(L.p.opt)), launchG: sig(r.launchG), launchT: sig(r.launchT) });
  const haz = R.HAZARDS.map((h) => { const x = L.p.result('hazard:' + h.id); return h.id + ':' + (x.never ? 'never' : x.onlyUnlimited ? 'unlimited' : kgf(x.use)); }).join(', ');
  return { label, least: Object.assign({ effort: kgf(L.use), capped: L.capped }, side(L.r)), ceiling: L.ce.by ? L.ce.by + ' at ' + kgf(L.ce.use) + ' (below ' + kgf(L.ce.below) + ')' : 'none', hazards: haz, allout: side(A),
    presets: L.p.presets().map((x) => x.id + ': ' + (x.never ? 'never' : kgf(x.use))).join(', ') };
}
const out = [];
for (const [p2, p3] of [[false, false], [true, false], [true, true], [false, true]]) {
  pr2(p2); pr3(p3);
  const tag = (p2 ? 'PR2' : 'main') + (p3 ? '+PR3' : '');
  out.push(run(tag + ' | powers on, SP off', {}, false));
  out.push(run(tag + ' | powers on, SP on', {}, true));
  out.push(run(tag + ' | four off, SP off', OFF4, false));
  out.push(run(tag + ' | four off, SP on', OFF4, true));
}
pr2(false); pr3(false);
for (const x of out) console.log(JSON.stringify(x));
