const { P, ctx, octx, K, g } = require('./h.js');
const keys = Object.keys(P).filter(k => /splat|COLL|headOn|contact/i.test(k)); console.log(keys);
const sw = P.splatWithFooting || (P.COLLIDE && P.COLLIDE.splatWithFooting);
for (const [lab, v, H] of [['default sprint', 18.145765872146825, 17651.97], ['least sprint', 7.31, 17651.97], ['bolted real rock sprint', 18.145765872146825, 696772.8], ['set 1 m/s', 1.0000002150454732, 17651.97]]) {
  const s = 0.3144492733278289, mB = 3000;
  const r = sw ? sw(1e12, mB, v, s, H) : null;
  const Ffree = 0.5 * mB * v * v / s, T = 2 * s / v;
  console.log(lab, 'free F', Ffree.toFixed(0), 'T', T.toFixed(4), 'pGain', (mB * v).toFixed(0), '| engine footJ', (Math.min(H, Ffree) * T).toFixed(0), 'supplied', (mB * v + Math.min(H, Ffree) * T).toFixed(0), 'F*T', (Ffree * T).toFixed(0), '| F+H model: F', (Ffree + H).toFixed(0), 'footJ', (H * T).toFixed(0), 'supplied', (mB * v + H * T).toFixed(0), sw ? '| splatWithFooting(mA=1e12): F ' + r.F.toFixed(0) + ' tau ' + r.tau.toFixed(4) + ' Jearth ' + r.Jearth.toFixed(0) + ' V ' + r.V.toFixed(4) : '');
}
