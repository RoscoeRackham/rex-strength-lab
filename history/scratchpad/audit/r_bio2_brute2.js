const P = require('/home/user/dino-strength-sim/src/engine.js');
const { limit, brute } = require('./r_bio2_ref.js');
const g = P.K.g; const body = P.makeBody({});
const arm = 2 * body.handEff;
const cases = {
  'bus45 concrete': { d: body.strokes.throw, mA: body.m - arm, mB: 11500 + arm, RA: 6.479e5, RB: (11500 + arm) * g * Math.SQRT1_2, vmax: 55 },
  'stomp': { d: body.strokes.stomp, mA: body.m - body.legEff, mB: body.legEff, RA: (body.m - body.legEff) * g, RB: 0, vmax: 16 },
  'punch concrete': { d: body.strokes.punch, mA: body.m - body.handEff, mB: body.handEff, RA: 1412, RB: 0, vmax: 17 },
};
for (const [n, c] of Object.entries(cases)) {
  const L = limit(c);
  for (const mult of [1e2, 1e3, 1e4]) {
    const F0 = mult * (Math.max(c.mA, c.mB) * c.vmax ** 2 / c.d + c.RA + c.RB);
    const b = brute(c, F0);
    console.log(n.padEnd(15), 'F0', F0.toExponential(2), 'brute vA', b.vA.toFixed(4), 'vB', b.vB.toFixed(4), '| limit vA', L.vA.toFixed(4), 'vB', L.vB.toFixed(4), '| engine sat', (() => { const e = P.pushApart(Object.assign({}, c, { F: 1e30, mode: 'real' })); return 'vA ' + e.vA.toFixed(4) + ' vB ' + e.vB.toFixed(4); })());
  }
}
