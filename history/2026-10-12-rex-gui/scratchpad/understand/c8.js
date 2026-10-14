global.window = {};
const P = require('./head/engine.js'); require('./head/data.js'); const D = window.DINO_DATA;
const g = 9.80665, K = P.K;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const f = (x) => (typeof x === 'number' ? x.toPrecision(3) : String(x));
const F100 = 100 * 907.18474 * g;
const tau = (b) => P.WALK.RAMP * Math.sqrt(P.WALK.HIP * b.H / 0.875);
const mk = (b, o) => Object.assign({ F: F100, mode: 'comic', body: P.makeBody({ H: 3.048, m: 3007, build: b }), surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, o || {});
console.log('ramp tau at 3.048 m', f(tau(mk('rex').body)), 's; footPulse', f(2 * P.WALK.STAMP.t * Math.sqrt(P.WALK.HIP * 3.048 / P.WALK.HS.h)), 's');
for (const [lbl, oA, oB] of [['both friction', {}, {}], ['Rex (holder) bolted', {}, { anchor: 'bolted' }], ['both bolted', { anchor: 'bolted' }, { anchor: 'bolted' }], ['both bolted 1e6 t', { anchor: 'bolted', F: 1e9 * g }, { anchor: 'bolted', F: 1e9 * g }], ['both bolted inf, comic ground', { anchor: 'bolted', F: Infinity, groundHolds: true }, { anchor: 'bolted', F: Infinity, groundHolds: true }]]) {
  const cA = mk('ollie', oA), cB = mk('rex', oB);
  const r = P.standoff(cA, cB);
  const src = isFinite(r.contact) ? P.vibSource(cA.surface, 'ramp', r.contact, tau(cA.body)) : { kind: 'ramp', F: Infinity, tau: 0.187, ground: P.groundOf(cA.surface) };
  console.log(lbl.padEnd(32), '| outcome', r.outcome, 'contact', f(r.contact), '| ramp: ppv5', f(P.ppvAt(src, 5) * 1e3), 'mm/s plaster@5', P.plasterOver(src, 5), 'rattleReach', f(P.ppvReach(src, P.VIB.TH.rattle)), 'feelReach', f(P.ppvReach(src, P.VIB.TH.feel)));
}
// the walk step for comparison (ordinary step) and Rex just standing (weight as ramp)
const st = P.walkStep(mk('rex').body, surf('concrete'), { pace: 'walk', effort: 0.5 });
console.log('walk ordinary step ppv5', f(P.ppvAt(st.src, 5) * 1e3), 'mm/s');
// pushMatch
for (const [lbl, oA, oB] of [['push match both friction', {}, {}], ['push match both bolted', { anchor: 'bolted' }, { anchor: 'bolted' }], ['push match both bolted 1e6 t', { anchor: 'bolted', F: 1e9 * g }, { anchor: 'bolted', F: 1e9 * g }]]) {
  const r = P.pushMatch(mk('rex', oA), mk('ollie', oB));
  const src = isFinite(r.contact) ? P.vibSource(surf('concrete'), 'ramp', r.contact, tau(mk('rex').body)) : null;
  console.log(lbl.padEnd(32), '| outcome', r.outcome, 'contact', f(r.contact), 'tear', f(r.tear), '| ppv5', f(P.ppvAt(src, 5) * 1e3), 'mm/s plaster@5', P.plasterOver(src, 5));
}
