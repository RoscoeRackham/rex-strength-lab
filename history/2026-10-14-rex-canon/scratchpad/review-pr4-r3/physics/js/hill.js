const { P, D, g, R3, O3, c3, dial, sig } = require('./h.js');
const vmax = P.MUSCLE.throwPush.vmax * R3.s, k = P.MUSCLE.k || 0.25, F0 = dial;
const hill = (u) => (u <= 0 ? 1 : u >= 1 ? 0 : (1 - u) / (1 + u / k));
// Rex's speed under Ollie's real shove (Ollie bolted, planted): integrate Ollie's push on Rex less Rex's hold
const H = 17652; let v = 0, t = 0, x = 0, imp = 0; const dt = 1e-5, d = Math.min(R3.strokes.throw, O3.strokes.throw);
while (x < d && t < 1) { const Fo = F0 * hill(v / vmax); const a = (Fo - H) / R3.m; v += a * dt; x += v * dt; t += dt; imp += F0 * hill(v / vmax) * dt; }
console.log('vmax', sig(vmax), 'Rex leaves at', sig(v), 'after', sig(t), 's; Rex\'s own real press on the bolts over that time (his arm extending at his own speed):', sig(imp), 'kg m/s, average', sig(imp / t), 'N; engine pulse', 55830);
