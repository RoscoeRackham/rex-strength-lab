global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const body = P.makeBody({ H: 2, m: 180 });
const MOON = 3.844e8;
for (const mode of ['comic', 'real']) for (const sid of D.surfaces.map(s=>s.id)) for (const gh of [true, false]) {
  const surface = D.surfaces.find((s) => s.id === sid);
  let jh = [];
  for (let lg = 1; lg <= 34; lg += 0.01) {
    const c = { F: Math.pow(10, lg) * g, mode, body, surface, groundHolds: gh, anchor: 'friction' };
    const r = P.jump(c); const f = r.flight;
    if (f && !f.escaped && f.apex > MOON) jh.push(lg.toFixed(2) + ':' + (f.apex / 1e3).toFixed(0) + (f.landed ? 'L' : f.timedOut ? 'TO' : '?'));
  }
  if (jh.length) console.log(mode, sid, gh, jh.join(' '));
}
