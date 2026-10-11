const { P, g, ctx, obj } = require('./common.js');
const { refHill } = require('./ref.js');
const b = P.makeBody({}); const car = obj('car'); const th = Math.PI / 4;
const mB = car.m + 2 * b.handEff, RB = mB * g * Math.sin(th);
for (const over of [1.5, 1.1, 1.02, 1.005, 1.001]) {
  const F0 = RB * over;
  const anc = P.anchorCapacity({ body: b, surface: ctx(1, 'real').surface, theta: th, anchor: 'friction', groundHolds: false, extraMass: car.m });
  const o = { F: F0, d: b.strokes.throw, mA: b.m - 2 * b.handEff, mB, RA: anc.R, RB, vmax: 55 };
  const e = P.pushApart(Object.assign({ mode: 'real' }, o));
  const r = refHill(Object.assign({ N: 400000 }, o));
  console.log('F0/RB', over, 'engine vB', e.vB.toFixed(4), 'xA+xB', (e.xA + e.xB).toFixed(3), 't', e.t.toFixed(2), '| ref vB', r.vB.toFixed(4), 't', r.t.toFixed(2));
}
