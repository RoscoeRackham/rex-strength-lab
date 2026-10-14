global.window = {};
const P = require('./head/engine.js'); require('./head/data.js'); const D = window.DINO_DATA;
const g = 9.80665, K = P.K;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const obj = (id) => D.objects.find((o) => o.id === id);
const imp = (sf, J, T) => (J > 0 && T > 0 ? P.vibSource(sf, 'hann', 2 * J / T, T) : null);
const f = (x) => (typeof x === 'number' ? x.toPrecision(3) : String(x));
const F100 = 100 * 907.18474 * g;
const mk = (b, o) => Object.assign({ F: F100, mode: 'comic', body: P.makeBody({ H: 3.048, m: 3007, build: b }), surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, o || {});
const rep = (lbl, src) => console.log('   ', lbl.padEnd(40), 'ppv5', f(P.ppvAt(src, 5) * 1e3), 'mm/s plaster@5', P.plasterOver(src, 5), 'rattleReach', f(P.ppvReach(src, P.VIB.TH.rattle)), 'plasterReach', f(P.plasterReach(src)));
console.log('== shove (Rex shoves Ollie)');
for (const [lbl, oR, oO] of [['both friction', {}, {}], ['Ollie bolted', {}, { anchor: 'bolted' }], ['Rex bolted', { anchor: 'bolted' }, {}], ['1e6 t, Ollie bolted', { F: 1e9 * g }, { F: 1e9 * g, anchor: 'bolted' }]]) {
  const cA = mk('rex', oR), cB = mk('ollie', oO);
  const r = P.shove(cA, cB), p = r.push;
  const Fd = r.Fdrive;
  // ground impulses during the push: J = F t - p_side (pushApart's own momenta, before the arm-share correction)
  const JA = isFinite(p.t) ? Fd * p.t - p.pA : NaN, JB = isFinite(p.t) ? Fd * p.t - p.pB : NaN;
  console.log(' ', lbl, '| Fdrive', f(Fd), 't', f(p.t), 'pA', f(p.pA), 'pB', f(p.pB), 'vA', f(r.vA), 'vB', f(r.vB), 'slideA', f(r.slideA), 'slideB', f(r.slideB), 'J_A', f(JA), 'J_B', f(JB), 'stalled', r.stalled, 'heldBack', r.heldBack);
  if (JA > 0) rep('A stance (shover)', imp(cA.surface, JA, p.t));
  if (JB > 0) rep('B stance (shoved)', imp(cB.surface, JB, p.t));
}
console.log('== arm wrestle');
for (const [lbl, oR, oO] of [['default 100 t both', {}, {}], ['Ollie 10 t (weaker)', {}, { F: 1e4 * g }], ['Rex 1e6 t, Ollie 1e5 t, table', { F: 1e9 * g }, { F: 1e8 * g }], ['Rex 1e6 t, Ollie 1e5 t, gh', { F: 1e9 * g, groundHolds: true }, { F: 1e8 * g, groundHolds: true }], ['Rex 1e9 t, Ollie 1e8 t, gh', { F: 1e12 * g, groundHolds: true }, { F: 1e11 * g, groundHolds: true }]]) {
  const cA = mk('rex', oR), cB = mk('ollie', oO);
  const r = P.armWrestle(cA, cB);
  const pin = r.pin;
  const Jpin = pin ? P.vToMomentum(Math.min(pin.v, K.c * (1 - 1e-12)), pin.M) : 0;
  const Tpin = pin ? 2 * 0.025 * cA.body.H / pin.v : 0;
  console.log(' ', lbl, '| outcome', r.outcome, 'tableBreaks', r.tableBreaks, r.tableBreaksBy, 'contact', f(r.contact), 'pin v', pin && f(pin.v), 'pin t', pin && f(pin.t), 'pin E', pin && f(pin.E), 'quake', f(r.quake), 'crater', f(r.crater), 'slamRatio', f(r.slamRatio));
  if (pin) rep('pin slam J=' + f(Jpin) + ' T=' + f(Tpin), imp(cA.surface, Jpin, Tpin));
}
console.log('== catch');
for (const [lbl, oid, D0, style, o] of [['baseball 10 m easy', 'baseball', 10, 'easy', {}], ['car 30 m easy', 'car', 30, 'easy', {}], ['car 30 m hard', 'car', 30, 'hard', {}], ['car 30 m hard 1e6 t', 'car', 30, 'hard', { F: 1e9 * g }], ['bus 100 m hard 1e6 t bolted', 'bus', 100, 'hard', { F: 1e9 * g, anchor: 'bolted' }]]) {
  const cT = mk('rex', o), cC = mk('ollie', o);
  const L = P.catchLeg(cT, cC, obj(oid), D0, style);
  const k = L.catch;
  if (!k) { console.log(' ', lbl, '| result', L.result); continue; }
  const m = obj(oid).m, M = cC.body.m;
  const Jc = Math.max(0, m * L.vArrive - (M + m) * k.uAfter);
  const tab = null;
  console.log(' ', lbl, '| result', L.result, 'vL', f(L.aim.vL), 'vArrive', f(L.vArrive), 'angle', f(L.angleDeg), 'tStroke', f(k.tStroke), 'forced', k.forced, 'slips', k.slips, 'uAfter', f(k.uAfter), 'J_catch', f(Jc), 'tPush', f(L.tPush), 'recoil v', f(L.recoil.v), 'slide', f(L.recoil.slide));
  rep('catcher stop', imp(cC.surface, Jc, k.tStroke));
  // thrower: momentum given to the object along the line minus his own recoil momentum
  const Jt = m * L.aim.vL - cT.body.m * L.recoil.v;
  rep('thrower push J=' + f(Jt) + ' T=' + f(L.tPush), imp(cT.surface, Jt, L.tPush));
}
