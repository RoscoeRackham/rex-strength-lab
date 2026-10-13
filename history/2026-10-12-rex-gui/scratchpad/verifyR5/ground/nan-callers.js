const { P, g, M, surf, obj, rex, ollie, ON, ctxOf } = require('./env.js');
const S = (x) => x && JSON.stringify(x, (k, v) => (typeof v === 'number' && !isFinite(v) ? String(v) : v));
const pick = (t) => t && { J: t.J, whole: t.whole, supplied: t.supplied, dn: t.suppliedDown, sd: t.suppliedSide, T: t.T };
const cA = ctxOf(Infinity, ON), cB = Object.assign({}, cA, { body: ollie });
for (const ang of [45, 75]) { const t = P.throwPartner(cA, cB, ang); console.log('throwPartner', ang, 'toGround', S(pick(t.r && t.r.toGround)), 'landToGround', S(pick(t.landToGround))); }
for (const style of ['easy', 'hard']) for (const anc of ['bolted', 'friction']) {
  try { const L = P.catchLeg(cA, Object.assign({}, cB, { anchor: anc }), obj('car'), 1000, style); console.log('catchLeg', style, anc, L.result, 'toGroundT', S(pick(L.toGroundT)), 'toGroundC', S(pick(L.toGroundC))); } catch (e) { console.log('catchLeg err', e.message); }
}
const t = P.tossPartner(cA, ollie, 'Ollie', 'hard', 10, 'friction'); console.log('toss', t.result, S(pick(t.toGroundT)), S(pick(t.toGroundC)));
