global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
for (const [H,m] of [[2,7.416e16],[2,1e18],[3.048,7.416e16],[3.048,1.049e18],[2,1e17]]) {
  const b = P.makeBody({H, m});
  const st = P.settle(b);
  const f = P.fallThrough(b);
  const ref = m * P.K.g * (f.firstPass ? f.firstPass.depthShort : NaN);
  console.log(H, m, 'years', st.years.toFixed(1), 'loss', st.firstPassLossJ.toExponential(3), 'mg*short', ref.toExponential(3), 'ratio', (st.firstPassLossJ/ref).toFixed(3), 'short', f.firstPass && f.firstPass.depthShort.toFixed(2));
  // fast/slow ranges
  const fast = P.settle(b, undefined, { sigma: P.W8.SIGMA_HIGH, k: 2, cs: P.W8.CS_LOW });
  const slow = P.settle(b, undefined, { sigma: P.W8.SIGMA_LOW, k: 0.5, noDF: true });
  console.log('  fast', fast.years.toFixed(1), 'slow', slow.years.toFixed(1));
  const ctx = { F: 1e5*P.K.g, body: b, surface: D.surfaces.find(s=>s.id==='concrete'), groundHolds: false };
  const w = P.weight(ctx);
  console.log('  weight settle', w.settle && w.settle.years.toFixed(1), JSON.stringify(w.settleRange), JSON.stringify(w.shortRange));
}
// dimensional check: the passFor term
