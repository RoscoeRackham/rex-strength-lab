// re-check fixes: the pull's figures with the 1.0x leg rule (this branch's engine), and the bolted sprint over 10 m
const R = process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab/src/';
global.window = {}; const P = require(R + 'engine.js'); require(R + 'data.js'); const D = window.DINO_DATA, g = P.K.g;
const body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
const ctx = (kg, anchor, extra) => Object.assign({ F: kg * g, mode: 'comic', body, surface: D.surfaces.find((s) => s.id === 'concrete'), anchor, airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, extra || {});
for (const anc of ['bolted', 'friction']) for (const id of ['baseball', 'person', 'motorcycle', 'piano', 'car', 'pickup', 'bus', 'loco']) {
  const o = D.objects.find((x) => x.id === id);
  for (const use of [undefined, 30 * g]) {
    const r = P.pull(ctx(90718.474, anc, use ? { use } : {}), o);
    if (!r.canMove) { console.log(anc, id, use ? '30kg' : 'all', 'cannot move'); continue; }
    console.log(anc.padEnd(8), id.padEnd(10), 'm', o.m, use ? '30kg' : 'all ', 't', r.t10m.toFixed(4), 'a', r.accel.toFixed(2), 'vEnd', r.vEnd.toFixed(2), 'legs/use', (r.walkPush.J / r.walkPush.T / r.usable).toFixed(4), 'foot', r.footLimited, 'rope', (r.ropeT / 1000).toFixed(1), 'kN');
  }
}
// the Sprint tab, bolted, default dial: thrust, accel, vTop and 10 m from rest with drag (v = vD tanh(a t / vD)) and its
// leg-speed cap (constant speed past vTop)
const sp = P.sprint(ctx(90718.474, 'bolted'));
const vD = Math.sqrt(2 * sp.thrust / (P.K.rho0 * body.Cd * body.frontArea));
let t = 0, x = 0, v = 0; const dt = 1e-6;
while (x < 10) { const a = v < sp.vTop ? (sp.thrust - 0.5 * P.K.rho0 * body.Cd * body.frontArea * v * v) / body.m : 0; v = Math.min(sp.vTop, v + a * dt); x += v * dt; t += dt; }
console.log('sprint bolted: thrust', (sp.thrust / 1000).toFixed(1), 'kN accel', sp.accel.toFixed(2), 'vTop', sp.vTop.toFixed(2), sp.topLimit, 't100', sp.t100.toFixed(4), '10 m from rest', t.toFixed(4), 's, v there', v.toFixed(2));
const pc = P.pull(ctx(90718.474, 'bolted'), D.objects.find((x) => x.id === 'car'));
console.log('pull car bolted all-out: t10m', pc.t10m.toFixed(4), 'vEnd', pc.vEnd.toFixed(2), 'accel', pc.accel.toFixed(2), 'to 27.78 m/s', (27.78 / pc.accel).toFixed(4), 's; momentum of his body', Math.round(pc.walkPush.J), 'legs', (pc.walkPush.J / pc.walkPush.T / 1000).toFixed(1), 'kN');
