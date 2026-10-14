const { P, D, rex, ollie, surf, obj, ctx, ON } = require('./h.js');
const s = 'sand', Nmax = P.qultFor(surf(s), rex.footB) * 2 * rex.footArea;
for (const [style, h] of [['easy', 10], ['easy', 100]]) {
  const cT = ctx(Object.assign({ kg: 90718, s }, ON));
  const t = P.tossPartner(cT, ollie, 'Ollie', style, h, 'friction');
  const k = t.catch;
  const Jfull = t.toGroundC ? t.toGroundC.J + (t.toGroundC.supplied || 0) : 0;
  const stat = (rex.m + ollie.m) * P.K.g;
  console.log(style, h, t.result, 'vImpact', t.flight && t.flight.vImpact.toFixed(2), 'over', k && k.sinkRatioRaw && k.sinkRatioRaw.toFixed(2), 'toGroundC J', t.toGroundC && t.toGroundC.J.toFixed(0), 'of', Jfull.toFixed(0), 'T', t.toGroundC && t.toGroundC.T.toFixed(3), '| static', stat.toFixed(0), 'Nmax', Nmax.toFixed(0), '-> ground can bear beyond static:', Math.max(0, Nmax - stat).toFixed(0));
}
