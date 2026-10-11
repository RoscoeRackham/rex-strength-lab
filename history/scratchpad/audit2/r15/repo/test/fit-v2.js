// Fit throwPush.forceFrac and throwWhip.vmax so real-muscle throws at record strength hit the records.
global.window = {};
const P = require('../src/engine.js');
require('../src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const body = P.makeBody({});
const surface = D.surfaces.find((s) => s.id === 'concrete');
const ctx = (mode) => ({ F: 511 * g, mode, body, surface, groundHolds: false, anchor: 'friction' });
const shot = D.objects.find((o) => o.id === 'shot'), ball = D.objects.find((o) => o.id === 'baseball');
const bis = (fn, lo, hi, target) => { for (let i = 0; i < 80; i++) { const mid = 0.5 * (lo + hi); if (fn(mid) < target) lo = mid; else hi = mid; } return 0.5 * (lo + hi); };
for (const vmax of [30, 35, 40, 45, 55]) {
  P.MUSCLE.throwPush.vmax = vmax;
  const ff = bis((f) => { P.MUSCLE.throwPush.forceFrac = f; return P.throwObject(ctx('real'), shot, 37).flight.range; }, 0.05, 1.5, 23.56);
  console.log('push vmax', vmax, 'forceFrac', ff.toFixed(4), 'v', P.throwObject(ctx('real'), shot, 37).v.toFixed(2));
}
for (const ff of [0.3]) {
  P.MUSCLE.throwWhip.forceFrac = ff;
  const vm = bis((v) => { P.MUSCLE.throwWhip.vmax = v; return P.throwObject(ctx('real'), ball, 0).v; }, 30, 300, 47.3);
  console.log('whip forceFrac', ff, 'vmax', vm.toFixed(2));
}
