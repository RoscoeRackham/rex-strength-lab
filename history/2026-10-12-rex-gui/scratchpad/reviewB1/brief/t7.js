const { P, D, g, surf, rex, ollie, ON, ctxOf } = require('./setup.js');
const obj = (id) => D.objects.find(o => o.id === id);
for (const [oid, lg, Dd, st] of [['car', 9, 30, 'hard'], ['car', 7, 30, 'hard'], ['bus', 8, 30, 'hard'], ['piano', 8, 100, 'hard'], ['car', 6, 30, 'hard']]) {
  const off = Object.assign({}, ON, { unbreakable: false });
  const L0 = P.catchLeg(ctxOf(Math.pow(10, lg), off), ctxOf(Math.pow(10, lg), off, ollie()), obj(oid), Dd, st);
  const L1 = P.catchLeg(ctxOf(Math.pow(10, lg), ON), ctxOf(Math.pow(10, lg), ON, ollie()), obj(oid), Dd, st);
  console.log(oid, lg, 'off:', L0.result, 'sink', L0.catch && L0.catch.sinkRatio && L0.catch.sinkRatio.toFixed(2), ' on:', L1.result, 'sink', L1.catch && L1.catch.sinkRatio, 'raw', L1.catch && L1.catch.sinkRatioRaw);
}
