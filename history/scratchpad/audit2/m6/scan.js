const f = require('./fmt.js');
const P = require('/home/user/dino-strength-sim/src/engine.js');
const D = window.DINO_DATA;
const g = 9.80665;
const hits = [];
for (const H of [0.4, 2, 50]) for (const mode of ['comic', 'real']) {
  const body = P.makeBody({ H, m: 180 * Math.pow(H / 2, 3) });
  const surface = D.surfaces.find((s) => s.id === 'concrete');
  for (let i = 100; i <= 3400; i++) {
    const logKg = i / 100;
    const c = { F: Math.pow(10, logKg) * g, mode, body, surface, groundHolds: false, anchor: 'friction' };
    const vals = {};
    try { const r = P.stomp(c); vals.stomp = r.E; } catch (e) {}
    try { const r = P.punch(c); vals.punch = r.E || r.KE; } catch (e) {}
    try { const r = P.clap(c); vals.clap = r.E; } catch (e) {}
    for (const [k, J] of Object.entries(vals)) if (J > 0 && /^1,000 /.test(f.fmtTNT(J))) hits.push([H, mode, logKg, k, J, f.fmtTNT(J)]);
  }
}
console.log(hits.slice(0, 20));
