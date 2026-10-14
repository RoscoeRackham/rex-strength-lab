const { P, surf, ctx } = require('./common.js');
const cc = surf('concrete');
const cR = ctx(1e7, {}), cO = ctx(1e7, {});
const t = P.tossPartner(cR, cO.body, 'Ollie', 'easy', 100, 'friction');
const k = t.catch;
console.log('result', t.result, 'v toss', t.v.toFixed(2), 'vImpact', t.flight.vImpact.toFixed(2), 'catch F', (k.F/1e6).toFixed(2), 'MN sinkRatioRaw', k.sinkRatioRaw && k.sinkRatioRaw.toFixed(2), 'tStroke', k.tStroke.toFixed(3), 'uAfter', k.uAfter);
const J = 3007 * t.flight.vImpact - (cR.body.m + 3007) * (k.uAfter || 0);
const T = Math.max(P.limbPulse(cR.body), k.tStroke);
const src = P.impulseSource(cc, J, T);
console.log('catch J', J.toExponential(3), 'T', T.toFixed(4), 'ppv@5', (P.ppvAt(src, 5) * 1e3).toFixed(1), 'mm/s plasterReach', P.plasterReach(src).toFixed(1), 'm rattle', P.ppvReach(src, 1e-3).toFixed(1));
// the toss's push into the ground
const th = P.throwObject ? P.throwObject(cR, t.obj, 90) : null;
console.log('toss toGround', th && th.toGround);
if (th && th.toGround) { const s2 = P.impulseSource(cc, th.toGround.J, th.toGround.T); console.log('toss ppv@5', (P.ppvAt(s2, 5) * 1e3).toFixed(2)); }
// what toGround the lab would get at the lob speed: object's momentum at the lob speed
