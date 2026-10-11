const { P, g, ctx, obj } = require('./common.js');
const { refHill } = require('./ref.js');
const b = P.makeBody({});
// whip throw of baseball, 45 deg, concrete friction anchor (same as throwObject)
const th = Math.PI / 4, ball = obj('baseball');
let worst = 0, worstAt = 0;
for (let lg = 2.7; lg <= 6.5; lg += 0.05) {
  const kg = 10 ** lg; const F = kg * g;
  const anc = P.anchorCapacity({ body: b, surface: ctx(1,'real').surface, theta: th, anchor: 'friction', groundHolds: false, extraMass: ball.m });
  const o = { F: F * 0.3, d: b.strokes.whip, mA: b.m - b.whipEff, mB: ball.m + b.whipEff, RA: anc.R, RB: (ball.m + b.whipEff) * g * Math.sin(th), vmax: 55 };
  const e = P.pushApart(Object.assign({ mode: 'real' }, o)), r = refHill(Object.assign({ N: 20000 }, o));
  const err = Math.abs(e.vB - r.vB) / r.vB;
  if (lg > 6.2 || err > 0.002) console.log(kg.toExponential(2), 'eng', e.vB.toFixed(3), 'ref', r.vB.toFixed(3), 'relerr', err.toExponential(1));
  if (err > worst && e.vB > 0) { worst = err; worstAt = kg; }
}
console.log('worst nonzero rel err', worst.toExponential(2), 'at', worstAt.toExponential(2));
