global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = P.K.g;
const body = P.makeBody({});
const surface = D.surfaces.find((s) => s.id === 'concrete');
const ball = D.objects.find((o) => o.id === 'baseball');
const d = body.strokes.whip, armMass = body.whipEff, mB = ball.m + armMass, mA = body.m - armMass;
const vmax = P.MUSCLE.throwWhip.vmax * body.s;
for (const [ang, lg] of [[30, 6], [30, 9], [45, 6]]) {
  const th = ang * Math.PI / 180;
  const c = { F: Math.pow(10, lg) * g, mode: 'real', body, surface, groundHolds: false, anchor: 'friction' };
  const r = P.throwObject(c, ball, ang);
  const RB = mB * g * Math.sin(th);
  const full = P.pushApart({ F: r.F, d, mA, mB, RA: r.anchor.Rslide, RB, mode: 'real', vmax });
  const out = ['full ' + full.pB.toPrecision(12)];
  for (const f of [1, 1.25, 1.6, 2, 3, 5, 10]) {
    const Fc = r.anchor.R * (1 - 1e-9) * f;
    const h = P.pushApart({ F: r.F, Fcap: Fc, d, mA, mB, RA: r.anchor.Rslide, RB, mode: 'real', vmax });
    out.push(f + ':' + h.pB.toPrecision(12));
  }
  console.log(ang, lg, out.join('  '));
}
