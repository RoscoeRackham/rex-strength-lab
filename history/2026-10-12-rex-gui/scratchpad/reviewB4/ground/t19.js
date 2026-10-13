const { P, D, rex, ollie, surf, obj, ctx, ON } = require('./h.js');
const s = 'sand';
const cT = ctx(Object.assign({ kg: 90718, s }, ON));
const t = P.tossPartner(cT, ollie, 'Ollie', 'easy', 10, 'friction');
const srcC = P.impulseSource(surf(s), t.toGroundC.J, t.toGroundC.T), srcT = t.toGroundT ? P.impulseSource(surf(s), t.toGroundT.J, t.toGroundT.T) : null;
console.log('catch J', t.toGroundC.J.toFixed(0), 'ppv5', (P.ppvAt(srcC, 5) * 1e3).toFixed(2), 'mm/s; rattle reach', P.ppvReach(srcC, P.VIB.TH.rattle).toFixed(1), 'm; toss J', t.toGroundT && t.toGroundT.J.toFixed(0), 'ppv5', srcT && (P.ppvAt(srcT, 5) * 1e3).toFixed(2), 'rattle reach', srcT && P.ppvReach(srcT, P.VIB.TH.rattle).toFixed(1));
