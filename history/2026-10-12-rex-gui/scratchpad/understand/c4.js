global.window = {};
global.performance = require('perf_hooks').performance;
const P = require('./head/engine.js'); require('./head/data.js'); const D = window.DINO_DATA;
const g = 9.80665, K = P.K;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const imp = (sf, J, T) => (J > 0 && T > 0 ? P.vibSource(sf, 'hann', 2 * J / T, T) : null);
function setup(S) {
  const mkR = (u) => ({ F: Math.min(S.F, u), mode: S.mode || 'comic', body: P.makeBody({ H: 3.048, m: S.m || 3007, build: 'rex' }), surface: surf(S.sid), groundHolds: S.gh, anchor: S.anchor });
  const mkO = (u) => Object.assign(mkR(u), { body: P.makeBody({ H: 3.048, m: S.m || 3007, build: 'ollie' }), anchor: S.oAnchor });
  return { mkR, mkO };
}
// proposed: the Collide hit's push into the ground
function collideShake(r, splat, sf, bA) {
  if (!r || r.noCharge || r.blackHole || r.planetScale) return null;
  if (r.outcome === 'immovable') return null;
  const T = splat ? r.contact.soft.t : r.contact.softEl.t;
  if (r.held) return imp(sf, splat ? r.h.inel.pT : r.h.el.pT, T);
  if (r.partial) return imp(sf, r.partial.Jearth, r.partial.tau);
  return null;
}
function harmCollide(r, splat, near) {
  if (!r || r.blackHole || r.planetScale || r.noCharge) return null;
  const F = r.contact ? (splat ? r.contact.soft : r.contact.softEl) : null;
  const Q = r.Elocal != null && (r.relativistic || r.outcome === 'boltsLate') ? r.Elocal : r.h && splat ? r.h.Q : 0;
  const win = (E) => isFinite(E) ? E > 0 && P.blastRadius(E, P.RESTRAINT.R.DP_HARM) >= near : E > 0;
  const thump = isFinite(Q) && Q > 0 && (F ? F.t : 0) * K.a0 > Math.max(P.blastRadius(Q, 6900), 0.5);
  const af = r.after, slid = af ? (splat ? af.splat && af.splat.moved : af.bounce && Math.max(af.bounce.slideA || 0, af.bounce.slideB || 0)) : 0;
  return r.v0 >= K.a0 ? 'boom' : !thump && win(Q) ? 'air' : slid > near ? 'slide' : null;
}
function sim(label, S, opt) {
  const { mkR, mkO } = setup(S);
  const need = (m) => P.W8.WALK_LOAD * m * g / P.MUSCLE.jump.forceFrac;
  const lo = need(S.m || 3007), hi = isFinite(S.F) ? S.F : 1e34 * g;
  const memo = new Map(); let probes = 0;
  const run = (u) => { const k = u === Infinity ? 'inf' : u; if (!memo.has(k)) { probes++; memo.set(k, P.collide(S.ollieX ? mkO(u) : mkR(u), S.ollieX ? mkR(u) : mkO(u), opt)); } return memo.get(k); };
  const splat = !opt.bounce, near = S.near || 5, sf = surf(S.sid);
  const sigOf = (u) => { const r = run(u); return [r.v0, r.outcome].join('|'); };
  const same = (u0, u1) => sigOf(u0) === sigOf(u1) && sigOf(u1) === sigOf(hi);
  const finish = (s) => { while (s.use === undefined) s.step(); return s; };
  const s0 = finish(P.RESTRAINT.search((u) => !!harmCollide(run(u), splat, near), lo, hi, !isFinite(S.F), same, 0.05));
  const p0 = probes;
  const s1 = finish(P.RESTRAINT.search((u) => !!harmCollide(run(u), splat, near) || P.plasterOver(collideShake(run(u), splat, sf), near), lo, hi, !isFinite(S.F), same, 0.05));
  const p1 = probes;
  const presets = {
    rattle: (u) => P.ppvAt(collideShake(run(u), splat, sf), near) >= P.VIB.TH.rattle,
    plaster: (u) => P.plasterOver(collideShake(run(u), splat, sf), near),
  };
  const ps = {};
  for (const [k, t] of Object.entries(presets)) ps[k] = finish(P.RESTRAINT.search(t, lo, hi, !isFinite(S.F), same, 0.05));
  const fmtU = (s) => (s.never ? 'never' : s.onlyUnlimited ? 'onlyUnlimited' : (s.use / g).toPrecision(3) + ' kgf' + (s.use === lo ? ' (at lowest)' : ''));
  console.log(label, '| today harm:', fmtU(s0), harmCollide(run(isFinite(s0.use) ? s0.use : hi), splat, near), 'probes', p0, '| +plaster harm:', fmtU(s1), 'extra probes', p1 - p0, '| rattle', fmtU(ps.rattle), '| plaster', fmtU(ps.plaster), '| total probes', probes);
  const rr = run(s1.below > 0 ? s1.below : lo);
  console.log('    at new ceiling: v0', rr.v0.toPrecision(3), 'outcome', rr.outcome, 'ppv5', (P.ppvAt(collideShake(rr, splat, sf), 5) * 1e3).toPrecision(3), 'mm/s');
}
const F100 = 100 * 907.18474 * g;
sim('default (friction holder, concrete)', { F: F100, sid: 'concrete', anchor: 'friction', oAnchor: 'friction', gh: false, ollieX: true }, { source: 'sprint' });
sim('Rex bolted, concrete', { F: F100, sid: 'concrete', anchor: 'bolted', oAnchor: 'friction', gh: false, ollieX: true }, { source: 'sprint' });
sim('Rex bolted, comic ground', { F: F100, sid: 'concrete', anchor: 'bolted', oAnchor: 'friction', gh: true, ollieX: true }, { source: 'sprint' });
sim('Rex bolted, sand', { F: F100, sid: 'sand', anchor: 'bolted', oAnchor: 'friction', gh: false, ollieX: true }, { source: 'sprint' });
sim('Rex bolted, 1e6 t dial', { F: 1e9 * g, sid: 'concrete', anchor: 'bolted', oAnchor: 'friction', gh: false, ollieX: true }, { source: 'sprint' });
sim('jump onto Rex, concrete', { F: F100, sid: 'concrete', anchor: 'friction', oAnchor: 'friction', gh: false, ollieX: true }, { source: 'jump' });
sim('jump onto Rex, comic', { F: F100, sid: 'concrete', anchor: 'friction', oAnchor: 'friction', gh: true, ollieX: true }, { source: 'jump' });
sim('set 1 km/s Rex bolted (effort-independent)', { F: F100, sid: 'concrete', anchor: 'bolted', oAnchor: 'friction', gh: true, ollieX: true }, { source: 'set', gb: 1000 / K.c });
