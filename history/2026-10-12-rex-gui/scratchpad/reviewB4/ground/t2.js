const { P, D, rex, surf, obj, ctx, ON } = require('./h.js');
for (const s of ['sand', 'concrete']) for (const kg of [2e4, 1e5, 1e6]) for (const th of [0, 45, -30]) {
  const c = ctx(Object.assign({ kg, s }, ON));
  const r = P.throwOnce(c, obj('car'), th);
  const q = P.qultFor(surf(s), rex.footB), Nmax = q * 2 * rex.footArea;
  const stat = (rex.m - r.armMass) * P.K.g + r.mB * P.K.g * Math.cos(th*Math.PI/180)**2;
  const tg = r.toGround || {};
  console.log(s, kg, th, 'v', r.v.toFixed(1), 'sinkRaw', (r.sinkRatioRaw||0).toFixed(2), 'J', tg.J && tg.J.toFixed(0), 'T', tg.T && tg.T.toFixed(3), 'sup', tg.supplied && tg.supplied.toFixed(0), 'Nmax', Nmax.toFixed(0), 'static', stat.toFixed(0), 'pushT', r.push && r.push.t.toFixed(3), 'pObj', (r.v*1340).toFixed(0));
}
