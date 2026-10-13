const { P, D, surf, obj, rex, tons, ctx } = require('./lib.js');
const fmt = (x) => (typeof x === 'number' ? x.toPrecision(4) : x);
const body = rex();
console.log('limbPulse', P.limbPulse(body), 'punch stroke', body.strokes.punch, 'handEff', body.handEff);
for (const lt of [1.5, 2, 2.5, 3, 3.5, 4, 5, 6]) {
  const c = ctx({ surface: 'concrete', kg: Math.pow(10, lt) });
  const r = P.punch(c);
  console.log('1e' + lt + ' kg', 'vFist', fmt(r.vFist), 'push.t', fmt(r.push.t), 'pFist', fmt(r.push.pB), 'basis', r.basis || '');
}
