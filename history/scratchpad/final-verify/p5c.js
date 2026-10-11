global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const obj = (id) => D.objects.find((o) => o.id === id);
const surface = D.surfaces.find((s) => s.id === 'concrete');
const R = P.DEFAULT_BODIES.rex;
for (const [id, v, ang, lg, anchor] of [['car', 30, 0, 3, 'friction'], ['car', 30, 0, 3, 'bolted'], ['tank', 20, 30, 4, 'bolted'], ['piano', 50, 0, 4, 'bolted'], ['car', 25, 0, 4.7, 'bolted']]) {
  const c = { F: Math.pow(10, lg) * g, mode: 'comic', body: P.makeBody({ H: R.H, m: R.m, build: 'rex' }), surface, groundHolds: false, anchor };
  const k = P.catchIt(c, obj(id), v, ang, null);
  const m = obj(id).m, mS = m + k.mh;
  // independent integration in the ground frame: body accel aC (sliding), object+hands decel (F-Fpull)/mS; stop when relative disp = d or rel vel = 0
  const aC = k.aNet - (k.F - k.Fpull) / mS;
  let vo = k.v1, vb = 0, x = 0, t = 0; const dt = 1e-7;
  while (vo - vb > 0 && x < k.stroke) { vo -= (k.F - k.Fpull) / mS * dt; vb += aC * dt; x += (vo - vb) * dt; t += dt; }
  console.log(id, v, ang, lg, anchor, 'clean', k.clean, 'slips', k.slips, 'forced', k.forced, 'F/Fcap', (k.F / k.Fcap).toFixed(3), 'tStroke', k.tStroke.toPrecision(4), 'int t', t.toPrecision(4), 'vSlam', k.vSlam.toPrecision(4), 'int vrel at end', (vo - vb).toPrecision(4), 'x', x.toPrecision(4));
}
