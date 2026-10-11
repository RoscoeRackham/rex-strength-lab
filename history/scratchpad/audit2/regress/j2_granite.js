const { P, ctx } = require('./common.js');
const c = ctx({ kg: 1e30, mode: 'real', surface: 'granite' });
const body = c.body;
const d = body.strokes.leg, mA = body.m - body.feetMass, mB = body.feetMass;
const RB = P.qultFor(c.surface, body.footB) * 2 * body.footArea;
const cB = P.K.PONCELET_K * c.surface.rho * 2 * body.footArea;
console.log('RB', RB, 'cB', cB, 'mA', mA, 'mB', mB);
for (const lgF of [8, 8.2, 8.5, 9, 10, 12, 15, 20, 31]) {
  const F = Math.pow(10, lgF);
  const pu = P.pushApart({ F, d, mA, mB, RA: mA * P.K.g, RB, cB, mode: 'real', vmax: 12 });
  console.log('F=1e' + lgF, 'vA', pu.vA.toFixed(4), 'vB', pu.vB.toFixed(4), 'vA+vB', (pu.vA + pu.vB).toFixed(4), 'xA', pu.xA.toFixed(4), 'xB', pu.xB.toFixed(4), 't', pu.t.toExponential(3), 'p', (pu.pA - pu.pB).toFixed(1), 'stalled', pu.stalled);
}
