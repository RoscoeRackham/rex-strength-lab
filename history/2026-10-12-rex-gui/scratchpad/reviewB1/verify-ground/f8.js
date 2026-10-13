const { P, D, g, ON, OFF, ctx } = require('./h.js');
const car = D.objects.find(o => o.id === 'car');
for (const [nm, pw] of [['ON', ON], ['unb off', Object.assign({}, ON, { unbreakable: false })]]) {
  const cR = ctx(1e5, { surf: 'sand', pw }), cO = ctx(1e5, { build: 'ollie', surf: 'sand', pw });
  const a = P.catchLeg(cR, cO, car, 30, 'easy');
  const k = a.catch;
  console.log(nm, a.result, 'sinkRatio', k.sinkRatio.toFixed(2), 'R', (k.R/1e3).toFixed(1), 'kN slide', k.slide.toFixed(3), 'sinkRatioRaw', k.sinkRatioRaw);
}
