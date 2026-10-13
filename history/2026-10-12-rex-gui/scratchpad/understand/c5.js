global.window = {};
const P = require('./head/engine.js'); require('./head/data.js'); const D = window.DINO_DATA;
const g = 9.80665, K = P.K;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const imp = (sf, J, T) => (J > 0 && T > 0 ? P.vibSource(sf, 'hann', 2 * J / T, T) : null);
const F100 = Math.pow(10, Math.log10(100 * 907.18474)) * g;
function caseRun(mode, aR, aO, u) {
  const R = { F: Math.min(F100, u), mode, body: P.makeBody({ H: 3.048, m: 3007, build: 'rex' }), surface: surf('concrete'), groundHolds: false, anchor: aR };
  const O = Object.assign({}, R, { body: P.makeBody({ H: 3.048, m: 3007, build: 'ollie' }), anchor: aO });
  return P.collide(O, R, { source: 'sprint' });
}
const src = (r) => (r.held ? imp(surf('concrete'), r.h.inel.pT, r.contact.soft.t) : r.partial ? imp(surf('concrete'), r.partial.Jearth, r.partial.tau) : null);
for (const [mode, aR, aO] of [['real', 'bolted', 'bolted'], ['comic', 'bolted', 'friction'], ['comic', 'bolted', 'bolted']]) {
  const need = P.W8.WALK_LOAD * 3007 * g / P.MUSCLE.jump.forceFrac;
  // scan effort for plaster onset
  let onset = null, ceilingAir = null;
  for (let lk = Math.log10(need / g); lk <= Math.log10(F100 / g) + 1e-9; lk += 0.005) {
    const u = Math.pow(10, lk) * g, r = caseRun(mode, aR, aO, u);
    if (onset == null && P.plasterOver(src(r), 5)) onset = { kg: Math.pow(10, lk), pct: 100 * u / F100, v: r.v0, ppv: P.ppvAt(src(r), 5) };
  }
  const rAll = caseRun(mode, aR, aO, F100);
  console.log(mode, 'Rex', aR, 'Ollie', aO, '| all-out v0', rAll.v0.toPrecision(3), 'ppv5', (P.ppvAt(src(rAll), 5) * 1e3).toPrecision(3), 'mm/s', 'plasterReach', P.plasterReach(src(rAll)).toPrecision(3), 'm | plaster onset', onset ? (onset.kg / 1000).toPrecision(3) + ' t (' + onset.pct.toPrecision(2) + '%), v0 ' + onset.v.toPrecision(3) : 'never');
}
