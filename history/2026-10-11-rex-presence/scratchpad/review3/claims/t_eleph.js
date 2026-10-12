const { P, D, g, surf, obj, ctxOf } = require('./eng.js');
const b = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
const sand = surf('sand'), firm = Object.assign({}, sand, { id: 'firmsand' });
const o = { pace: 'walk', effort: 0, groundHolds: false };
for (const d of [3, 5, 20]) {
  const lo = P.presence(b, firm, o).ppv(d) / P.elephantPPV(d), hi = P.presence(b, sand, o).ppv(d) / P.elephantPPV(d);
  console.log('d', d, 'ratio firm..loose', lo.toFixed(1), '..', hi.toFixed(1), ' elephant PPV (1/D from 20 m)', (P.elephantPPV(d) * 1e6).toFixed(1), 'um/s');
}
