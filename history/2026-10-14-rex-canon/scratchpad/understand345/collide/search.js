// Emulates the page's two-player effort search for Collide's charge (duoFacts / makeDuoPlan / DUO_PRESET_TEST),
// for main's engine and for the prototype.
const { P, g, sig, F0, ctxOf, sf } = require('./common');
const { newCollide } = require('./proto');
const K = P.K, R = P.RESTRAINT;
function chargeTakeoff(r, cA) {
  if (!cA.unbreakable || !r || !r.speed) return null;
  if (r.speed.jump && r.speed.jump.pushOff && r.speed.jump.pushOff.J > 0) return r.speed.jump.pushOff;
  if (r.speed.stomp) { const b = R.MOVES.stomp.blow(r.speed.stomp, { body: cA.body, surface: cA.surface, unbreakable: true, groundHolds: cA.groundHolds }); if (b && b.J > 0) return b; }
  return null;
}
function facts(collide, st, over, near) {
  const cR = ctxOf('rex', Object.assign({ F: st.FR, anchor: st.anchor || 'friction', surface: sf(st.surface || 'concrete') }, st.pow || {}, over || {}));
  const cO = ctxOf('ollie', Object.assign({ F: st.FO, anchor: st.oAnchor || 'friction', surface: sf(st.surface || 'concrete') }, st.pow || {}, over || {}));
  const cA = cO, cB = cR;   // Ollie charges
  const realRun = !!(over && over.unbreakable === false && (st.pow ? st.pow.unbreakable !== false : true));
  const meanIt = !!(over && over.meanIt);
  const r = collide(cA, cB, { source: st.colSrc || 'sprint', gb: st.gb, bounce: !!st.bounce, toGround: realRun, meanIt });
  const tk = chargeTakeoff(r, cA);
  const srcOf = (c, x) => (x ? P.impulseSource(c.surface, x.J, Math.max(1e-9, x.T)) : null);
  const out = { shake: [], blast: 0, ground: false, harm: null, r };
  if (!r || r.blackHole || r.planetScale || r.noCharge) return out;
  const splat = !st.bounce, F = r.contact ? (splat ? r.contact.soft : r.contact.softEl) : null;
  let Q = r.Elocal != null && (r.relativistic || r.outcome === 'boltsLate') ? r.Elocal : r.h && splat ? r.h.Q : 0;
  if (r.unbounded && !meanIt && splat && !r.relativistic) Q = 0;          // the prototype: the hit's energy absorbed unless meant
  const thump = isFinite(Q) && Q > 0 && (F ? F.t : 0) * K.a0 > Math.max(P.blastRadius(Q, 6900), 0.5);
  out.shake = [srcOf(cB, r.toGround), srcOf(cA, tk)].filter(Boolean);
  out.blast = thump ? 0 : Q;
  const rk = r.rock, af = r.after, sp = af && (splat ? af.splat : af.bounce);
  out.ground = !!(rk && !rk.comic && (rk.planet || !isFinite(rk.rT) || rk.rT >= 0.05)) || !!(r.bolts && r.bolts.crater > 0) || !!(sp && (sp.D > 0 || (sp.depth >= 0.01 && !R.SOIL.has(cB.surface.id)))) || !!(r.carry && r.carry.rockGives);
  const slid = af ? (splat ? af.splat && af.splat.moved : af.bounce && Math.max(af.bounce.slideA || 0, af.bounce.slideB || 0)) : 0;
  const win = (E) => isFinite(E) ? E > 0 && P.blastRadius(E, R.R.DP_HARM) >= near : E > 0;
  out.harm = r.v0 >= K.a0 ? 'sound barrier' : !thump && win(Q) ? 'blast' : out.ground && !P.holdsGround(cB) ? 'ground breaks' : P.plasterOver(out.shake.length ? [srcOf(cB, r.toGround)].filter(Boolean) : [], near) && r.toGround ? 'hit shakes' : tk && P.plasterOver(srcOf(cA, tk), near) ? 'takeoff shakes' : slid > near ? 'slides ' + sig(slid) + ' m' : null;
  return out;
}
const TEST = {
  rattle: (f, near) => f.shake.some((x) => P.ppvAt(x, near) >= P.VIB.TH.rattle) || P.blastRadius(f.blast, R.R.DP_RATTLE) >= near,
  plaster: (f, near) => P.plasterOver(f.shake, near),
  windows: (f) => P.blastRadius(f.blast, R.R.DP_WINDOWS) >= R.R.STREET,
  ground: (f) => f.ground,
  houses: (f, near) => P.blastRadius(f.blast, R.R.DP_HOUSES) >= near,
  block: (f) => P.blastRadius(f.blast, R.R.DP_HOUSES) >= R.R.BLOCK,
};
function plan(collide, st, near) {
  const need = (m) => P.W8.WALK_LOAD * m * g / P.MUSCLE.jump.forceFrac;
  const lo = need(3000), hi = st.dial;
  let probes = 0, ms = 0;
  const memo = {};
  const at = (u, v) => { const k = v + '|' + u; if (!memo[k]) { const t0 = Date.now(); probes++; memo[k] = facts(collide, Object.assign({}, st, { FR: Math.min(st.dial, Math.max(u, lo)), FO: Math.min(st.dial, Math.max(u, lo)) }), v === 'real' ? { unbreakable: false } : v === 'mean' ? { meanIt: true } : null, near); ms += Date.now() - t0; } return memo[k]; };
  const run = (fn, v) => { const s = R.search((u) => !!fn(at(u, v)), lo, hi, false, null, 0.05); let i = 0; while (s.use === undefined && i++ < 500) s.step(); return s; };
  const least = run((f) => f.harm, '');
  const res = { least: least.never ? 'never (all-out)' : sig(least.below / g) + ' kg (' + at(least.use, '').harm + ')' };
  for (const e of Object.keys(TEST)) {
    const v = e === 'ground' ? 'real' : (collide === newCollide && ['rattle', 'windows', 'houses', 'block'].includes(e)) ? 'mean' : '';
    const s = run((f) => TEST[e](f, near), v);
    res[e] = s.never ? 'never' : sig(s.use / g) + ' kg';
  }
  res.probes = probes; res.msPerProbe = sig(ms / probes, 2);
  return res;
}
module.exports = { facts, plan };
if (require.main === module) {
  const cases = [
    ['sprint, defaults', { colSrc: 'sprint', dial: F0 }],
    ['sprint, bounce', { colSrc: 'sprint', dial: F0, bounce: true }],
    ['jump, defaults', { colSrc: 'jump', dial: F0 }],
    ['jump, 1e9 dial', { colSrc: 'jump', dial: 1e9 * g }],
    ['stomp, 1e9 dial', { colSrc: 'stomp', dial: 1e9 * g }],
    ['sprint, Rex bolted', { colSrc: 'sprint', dial: F0, anchor: 'bolted' }],
    ['jump, Rex bolted, 1e6 dial (shots.js colRead)', { colSrc: 'jump', dial: 1e6 * g, anchor: 'bolted' }],
    ['set 0.1% c', { colSrc: 'set', gb: 1e-3, dial: F0 }],
  ];
  for (const [label, st] of cases) {
    const a = plan(P.collide, st, 5), b = plan(newCollide, st, 5);
    console.log(label, '\n  main ', JSON.stringify(a), '\n  proto', JSON.stringify(b));
  }
}
