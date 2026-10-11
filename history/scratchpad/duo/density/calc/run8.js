const X = require('./weight.js'); const { W, P, K } = X;
require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const ball = D.objects.find((o) => o.id === 'baseball'), car = D.objects.find((o) => o.id === 'car');
const surf = D.surfaces.find((s) => s.id === 'concrete');
const H = 2;
for (const [id, rho] of [['default', 1000], ['NS', 4.12e17]]) {
  const body = P.makeBody({ H, m: rho * 0.18 });
  const r0 = 0.25 * H, vNeed = X.escapeSpeedFrom(body.m, r0);
  console.log('\n==', id, 'm', body.m.toExponential(3), 'escape from r0=0.5 m:', vNeed.toExponential(4), 'm/s; pull at 1 m', (X.selfPull(body.m, 1) / K.g).toExponential(3), 'g');
  for (const liftKg of [90718.474, 1e20, 1e22, 1e24]) {
    for (const mode of ['comic', 'real']) {
      const ctx = { F: liftKg * K.g, mode, body, surface: surf, groundHolds: true, anchor: 'bolted' };
      const t = P.throwObject(ctx, ball, 45);
      const vinf = X.vInfinity(t.v, body.m, r0);
      const j = P.jump(ctx);
      const mv = X.moveCheck(ctx.F, body.m);
      console.log(' lift', liftKg.toExponential(2), mode, 'ball v', t.v.toExponential(3), 'canHold', t.canHold, 'vInf', vinf.toExponential(3), '| jump v', j.v.toExponential(3), 'apex', j.flight && j.flight.apex != null ? j.flight.apex.toExponential(3) : '-', '| stand/walk/run', mv.stand, mv.walk, mv.run);
    }
  }
}
// threshold strength for the baseball to escape NS-Rex (comic, bolted, comic ground)
const body = P.makeBody({ H, m: 4.12e17 * 0.18 }); const r0 = 0.5;
const thr = P.threshold((kg) => { const t = P.throwObject({ F: kg * K.g, mode: 'comic', body, surface: surf, groundHolds: true, anchor: 'bolted' }, ball, 45); return t.v > X.escapeSpeedFrom(body.m, r0); }, 1e10, 1e34);
console.log('\nNS-Rex: lift needed for a baseball to get away from his own gravity:', thr.toExponential(3), 'kg');
const thrD = P.threshold((kg) => { const t = P.throwObject({ F: kg * K.g, mode: 'comic', body: P.makeBody({ H }), surface: surf, groundHolds: true, anchor: 'bolted' }, ball, 45); return t.v > 1; }, 1e0, 1e34);
