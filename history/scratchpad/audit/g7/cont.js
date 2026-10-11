global.window = {};
const E = { orig: require('/home/user/dino-strength-sim/src/engine.js'), finding: require(__dirname + '/engine_fix.js'), fix2: require(__dirname + '/engine_fix2.js') };
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = E.orig.K.g;
const S = Object.fromEntries(D.surfaces.map(s => [s.id, s]));
const b = E.orig.makeBody({ H: 2 });
const f = x => typeof x === 'number' ? x.toPrecision(4) : String(x);
// 1) theta continuity of anchorCapacity for an overloaded load (car on sand), and at 90 deg
for (const k of Object.keys(E)) {
  const row = [0, 1e-6, 0.01, 1, 10, 45, 80, 89.9, 90].map(d => f(E[k].anchorCapacity({ body: b, surface: S.sand, theta: d * Math.PI / 180, extraMass: 1360 }).R));
  console.log('theta-scan car/sand', k.padEnd(8), row.join(' '));
}
// 2) W continuity across W = Nmax at theta = 30 deg (vary extraMass around threshold on sand)
const mThr = S.sand.qult * 2 * b.footArea / g - b.m;
for (const k of Object.keys(E)) {
  const row = [-50, -5, -0.5, -0.01, 0, 0.01, 0.5, 5, 50].map(dm => f(E[k].anchorCapacity({ body: b, surface: S.sand, theta: 30 * Math.PI / 180, extraMass: mThr + dm }).R));
  console.log('W-scan 30deg sand', k.padEnd(8), row.join(' '));
}
// 3) brute-force max jump in R over a fine grid of (theta, extraMass) for every surface/anchor
for (const k of Object.keys(E)) {
  let worst = { j: 0 };
  for (const s of D.surfaces) for (const anchor of ['friction', 'braced']) {
    for (let m = 0; m <= 2e5; m = m < 10 ? m + 1 : m * 1.02) {
      let prev = null;
      for (let d = 0; d <= 90; d += 0.05) {
        const R = E[k].anchorCapacity({ body: b, surface: s, theta: d * Math.PI / 180, extraMass: m, anchor }).R;
        if (prev !== null && isFinite(R) && isFinite(prev)) { const j = Math.abs(R - prev) / Math.max(R, prev, 1); if (j > worst.j) worst = { j, s: s.id, anchor, m: f(m), d: f(d), prev: f(prev), R: f(R) }; }
        prev = R;
      }
    }
  }
  console.log('max rel jump per 0.05deg', k, JSON.stringify(worst));
}
// 4) Sinking dino, throw straight up (90) vs 0: recoil should be nonzero at 90 (ground already failing)
for (const k of Object.keys(E)) for (const deg of [0, 1, 45, 90]) {
  const c = { F: 90718 * g, mode: 'comic', body: b, surface: S.sand, groundHolds: false, anchor: 'friction' };
  const r = E[k].throwObject(c, D.objects.find(o => o.id === 'car'), deg);
  console.log('Thing car/sand', k.padEnd(8), deg + 'deg', 'R', f(r.anchor.R), r.anchor.limit, 'v', f(r.v), 'recoil', f(r.recoilV), 'range', f(r.flight.range));
}
