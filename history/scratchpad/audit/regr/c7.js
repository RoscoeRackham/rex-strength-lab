const { P, D, g, surf, obj, V, C } = require('./h.js');
let n = 0;
for (const id of ['baseball', 'shot', 'piano', 'car', 'tank']) for (const lg of [3, 4.96, 7, 9]) for (const ld of [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4]) {
  const o = obj(id), Dd = Math.pow(10, ld);
  const cR = C({ kg: Math.pow(10, lg) }), cO = C({ kg: Math.pow(10, lg) });
  const e = P.catchLeg(cR, cO, o, Dd, 'easy'), h = P.catchLeg(cR, cO, o, Dd, 'hard');
  if (e.time != null && h.time != null && h.time > e.time * 1.02) { n++; console.log('FASTBALL SLOWER', id, 'lg' + lg, 'D' + Dd.toPrecision(3), 'easy t', e.time.toPrecision(4), 'vL', e.aim.vL.toPrecision(4), 'th', e.aim.thetaDeg.toFixed(1), e.result, '| hard t', h.time.toPrecision(4), 'vL', h.aim.vL.toPrecision(4), 'th', h.aim.thetaDeg.toFixed(1), h.result); }
  if (e.result === 'caught' && ['too-weak', 'unreachable'].includes(h.result)) { n++; console.log('LOB OK BUT FASTBALL CANT', id, lg, Dd, e.result, h.result); }
}
console.log('n', n);
