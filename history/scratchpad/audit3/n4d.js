global.window = {};
const P = require('./engine_instr.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = P.K.g;
const body = P.makeBody({});
const surface = D.surfaces.find((s) => s.id === 'concrete');
const ball = D.objects.find((o) => o.id === 'baseball');
const ang = 30, th = ang * Math.PI / 180;
const d = body.strokes.whip, armMass = body.whipEff, mB = ball.m + armMass, mA = body.m - armMass;
const vmax = P.MUSCLE ? P.MUSCLE.throwWhip.vmax * body.s : null;
console.log('vmax', vmax, 'd', d, 'mB', mB, 'mA', mA);
for (const lg of [6, 9]) {
  const c = { F: Math.pow(10, lg) * g, mode: 'real', body, surface, groundHolds: false, anchor: 'friction' };
  const r = P.throwObject(c, ball, ang);
  const Fsink = (r.anchor.Nmax - r.anchor.N(0)) / Math.sin(th);
  const pu = P.pushApart({ F: r.F, d, mA, mB, RA: r.anchor.Rslide, RB: mB * g * Math.sin(th), mode: 'real', vmax, __thr: Fsink });
  const pu2 = P.pushApart({ F: r.F, d, mA, mB, RA: r.anchor.Rslide, RB: mB * g * Math.sin(th), mode: 'real', vmax, __thr: r.anchor.R });
  console.log(lg, 'full-F push: pB', pu.pB.toFixed(4), 'peak', pu.maxF.toFixed(0), 'impulse above ground limit', pu.impOver.toExponential(3), 'N s; dt', (pu.t/ (pu.t>0?1:1)).toExponential(3), 'impulse above footing R', pu2.impOver.toExponential(3), 'pA', pu.pA.toFixed(4), 'xA', pu.xA.toExponential(3));
  const vdown = pu.impOver * Math.sin(th) / mA;
  console.log('   if all of it went into his body vertically: dv =', vdown.toExponential(3), 'm/s');
}
