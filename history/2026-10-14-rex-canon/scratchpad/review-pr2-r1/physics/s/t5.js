const { P, D, g, c, surf, obj, rex, ollie, ON, ctxOf, DEF, sig } = require('./hv.js');
const cT = ctxOf(DEF, ON), cC = Object.assign({}, cT, { body: ollie });
const L = P.catchLeg(cT, cC, obj('bus'), 10, 'hard');
const m = obj('bus').m, v = L.vArrive, a = L.angleDeg * Math.PI / 180;
const mh = 2 * ollie.handEff, mS = m + mh, d = 0.3 * ollie.H;
const v1 = v * m / mS, Fcap = L.catch.Fcap;
const Fpull = m * g * Math.max(0, Math.sin(a));
const aNet = (Fcap - Fpull) / mS;
const vSlam = Math.sqrt(Math.max(0, v1 * v1 - 2 * aNet * d));
console.log('m', m, 'v', v, 'angle', L.angleDeg, 'mh', mh, 'd', d, 'stroke', L.catch.stroke, 'Fcap', Fcap, 'vSlam indep', vSlam, 'engine', L.catch.vSlam);
// energy freed: whole KE  (+ gravity work over stroke)
console.log('E0', 0.5*m*v*v, 'Ecatch', L.catch.Ecatch, 'diff', L.catch.Ecatch - 0.5*m*v*v, 'mg d sin', m*g*d*Math.sin(a));
console.log('RAC', L.recoilAbsorbedC, 'p=m v', m * v);
console.log('sinkRatioRaw', L.catch.sinkRatioRaw, 'indep', (ollie.m + m) * g / (L.catch.sinkRatioRaw ? 1 : 1));
