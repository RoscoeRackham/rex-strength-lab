global.window = {};
const E = { orig: require('/home/user/dino-strength-sim/src/engine.js'), finding: require(__dirname + '/engine_fix.js'), fix2: require(__dirname + '/engine_fix2.js') };
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = E.orig.K.g;
const b = E.orig.makeBody({ H: 2 });
const f = x => typeof x === 'number' ? x.toPrecision(4) : String(x);
for (const k of Object.keys(E)) {
  let worst = { j: 0 };
  for (const s of D.surfaces) for (const anchor of ['friction', 'braced']) {
    const Nmax = s.qult * 2 * b.footArea, scale = s.mu * Nmax + (anchor === 'braced' ? s.shear * b.digArea : 0);
    for (let m = 0; m <= 2e5; m = m < 10 ? m + 1 : m * 1.02) {
      let prev = null;
      for (let d = 0; d <= 89.9; d += 0.05) {
        const R = E[k].anchorCapacity({ body: b, surface: s, theta: d * Math.PI / 180, extraMass: m, anchor }).R;
        if (prev !== null && isFinite(R) && isFinite(prev)) { const j = Math.abs(R - prev) / scale; if (j > worst.j) worst = { j: f(j), s: s.id, anchor, m: f(m), d: f(d), prev: f(prev), R: f(R) }; }
        prev = R;
      }
    }
  }
  console.log('max |dR| per 0.05deg / (mu Nmax + dig):', k, JSON.stringify(worst));
}
