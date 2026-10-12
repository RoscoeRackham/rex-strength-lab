const { P, D, g, surf, obj, rex, ollie, ctxOf } = require('./lib.js');
const lo = P.W8.WALK_LOAD * 3007 * g / P.MUSCLE.jump.forceFrac;
console.log('lo kg', lo / g);
const o = obj(process.argv[2] || 'bus');
const hiKg = Number(process.argv[3] || 1e7);
for (let i = 0; ; i++) {
  const u = Math.min(lo * Math.pow(10, i / 2), hiKg * g);
  const cR = ctxOf(u / g, { surface: surf('concrete') }), cO = Object.assign({}, cR, { body: ollie });
  const L = [P.catchLeg(cR, cO, o, 10, 'hard'), P.catchLeg(cO, cR, o, 10, 'hard')];
  console.log((u / g).toPrecision(4), L.map(x => x ? [x.result, x.aim && x.aim.vL && x.aim.vL.toPrecision(4), x.vArrive && x.vArrive.toPrecision(4), x.catch && x.catch.gripRatio && x.catch.gripRatio.toFixed(2)].join('/') : 'none').join('  '));
  if (u >= hiKg * g) break;
}
