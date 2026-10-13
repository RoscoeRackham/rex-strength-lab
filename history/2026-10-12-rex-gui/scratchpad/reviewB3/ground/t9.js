const { P, D, g, surf, obj, rex, ollie, M, ctxOf, sig } = require('./common.js');
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const cR = ctxOf(1e7*g, ON);
const t = P.tossPartner(cR, ollie, 'Ollie', 'easy', 100, 'friction');
console.log(t.result, 'v', sig(t.v), 'vImpact', sig(t.flight.vImpact), 'catch F', sig(t.catch.F), 'tStroke', sig(t.catch.tStroke));
const J = P.vToMomentum(t.flight.vImpact, ollie.m), T = Math.max(P.limbPulse(rex), t.catch.tStroke || 0);
const s = P.impulseSource(cR.surface, J, T);
console.log('catch J', sig(J), 'T', sig(T), 'ppv5', sig(P.ppvAt(s,5)), 'plaster reach', sig(P.plasterReach(s)), 'over at 5 m', P.plasterOver(s,5));
// the toss push (Throw tab rule)
const tt = P.throwObject(cR, P.CATCHGAME ? null : null, 90);
