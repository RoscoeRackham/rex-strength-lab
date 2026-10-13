global.window = {};
const { performance } = require('perf_hooks');
const P = require('./head/engine.js'); require('./head/data.js'); const D = window.DINO_DATA;
const g = 9.80665, K = P.K;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const obj = (id) => D.objects.find((o) => o.id === id);
const imp = (sf, J, T) => (J > 0 && T > 0 ? P.vibSource(sf, 'hann', 2 * J / T, T) : null);
const near = 5;
function catchCase(label, oid, D0, style, F, extra) {
  const mk = (b, u) => Object.assign({ F: Math.min(F, u), mode: 'comic', body: P.makeBody({ H: 3.048, m: 3007, build: b }), surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, extra || {});
  const o = obj(oid);
  const lo = P.W8.WALK_LOAD * 3007 * g / P.MUSCLE.jump.forceFrac, hi = isFinite(F) ? F : 1e34 * g;
  const memo = new Map(); let probes = 0, ms = 0;
  const legsAt = (u) => { const k = u === Infinity ? 'inf' : u; if (!memo.has(k)) { const t0 = performance.now(); probes++; memo.set(k, [P.catchLeg(mk('rex', u), mk('ollie', u), o, D0, style), P.catchLeg(mk('ollie', u), mk('rex', u), o, D0, style)]); ms += performance.now() - t0; } return memo.get(k); };
  const harm = (u) => {
    const legs = legsAt(u);
    const recoil = Math.max(...legs.map((L) => (L && L.recoil && isFinite(L.recoil.slide) ? L.recoil.slide : 0)));
    if (recoil > near) return 'recoil';
    for (const L of legs) { if (!L) continue; if (L.aim && L.aim.vL >= K.a0) return 'boom'; if (['crushed-launch', 'breaks-up', 'burns-up', 'wreckage', 'fireball'].includes(L.result) || L.bursts) return 'destroyed'; if (L.catch && L.catch.gripRatio > 1) return 'crush'; }
    return null;
  };
  const src = (u) => legsAt(u).flatMap((L) => {
    if (!L || !L.catch || !L.aim) return [];
    const k = L.catch, m = o.m, M = 3007;
    return [imp(surf('concrete'), Math.max(0, m * L.vArrive - (M + m) * k.uAfter), k.tStroke)].filter(Boolean);
  });
  const sig = (u) => legsAt(u).map((L) => (L ? [L.aim && L.aim.vL, L.vArrive, L.result, L.bursts].join(',') : 'none')).join('|');
  const same = (u0, u1) => sig(u0) === sig(u1) && sig(u1) === sig(hi);
  const fin = (s) => { while (s.use === undefined) s.step(); return s; };
  const s0 = fin(P.RESTRAINT.search((u) => !!harm(u), lo, hi, !isFinite(F), same, 0.05));
  const p0 = probes, m0 = ms;
  const s1 = fin(P.RESTRAINT.search((u) => !!harm(u) || P.plasterOver(src(u), near), lo, hi, !isFinite(F), same, 0.05));
  const p1 = probes, m1 = ms;
  const sr = fin(P.RESTRAINT.search((u) => P.ppvAt(src(u), near) >= P.VIB.TH.rattle, lo, hi, !isFinite(F), same, 0.05));
  const sp = fin(P.RESTRAINT.search((u) => P.plasterOver(src(u), near), lo, hi, !isFinite(F), same, 0.05));
  const fu = (s) => (s.never ? 'never' : (s.use / g).toPrecision(3) + ' kgf');
  console.log(label.padEnd(34), '| today: harm', fu(s0), 'probes', p0, (m0 / 1000).toFixed(2) + ' s | +plaster harm', fu(s1), '+' + (p1 - p0), 'probes | rattle', fu(sr), '| plaster', fu(sp), '| all searches', probes, 'probes', (ms / 1000).toFixed(2), 's');
}
const F100 = 100 * 907.18474 * g;
catchCase('baseball 10 m easy, 100 t', 'baseball', 10, 'easy', F100);
catchCase('car 30 m easy, 100 t', 'car', 30, 'easy', F100);
catchCase('car 30 m hard, 100 t', 'car', 30, 'hard', F100);
catchCase('car 30 m easy, 1e6 t', 'car', 30, 'easy', 1e9 * g);
catchCase('bus 100 m easy, 1e6 t, bolted', 'bus', 100, 'easy', 1e9 * g, { anchor: 'bolted' });
