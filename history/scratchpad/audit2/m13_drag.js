global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const body = P.makeBody({ H: 2, m: 180 });
for (const s of D.surfaces) for (const gh of [false, true]) {
  const c = { F: 9071.8474 * 9.80665, mode: 'comic', body, surface: s, groundHolds: gh, anchor: 'friction' };
  const r = P.sprint(c);
  if (r.vTop <= 27.78) { console.log(s.id, gh, 'vTop', r.vTop.toFixed(1), 'no 100'); continue; }
  // integrate a = (thrust - 0.5 rho Cd A v^2)/m with leg cap
  const k = 0.5 * 1.225 * body.Cd * body.frontArea;
  let v = 0, t = 0, dt = 1e-4;
  while (v < 27.78 && t < 1000) { const a = (r.thrust - k * v * v) / body.m; v += a * dt; t += dt; }
  console.log(s.id, 'gh=' + gh, 'mu', s.mu, 'limit', r.limit, 'vTop', r.vTop.toFixed(1), 'engine t100', r.t100.toFixed(2), 'with drag', t.toFixed(2));
}
