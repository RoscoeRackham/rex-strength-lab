const { P, D, body, surf, ctx } = require('./eng.js');
const o = D.objects.find((x) => x.id === 'car');
for (const own of [true, false]) { const r = P.throwObject(ctx(100 * 907.18474, { ownRecoil: own }), o, 90); console.log('ownRecoil', own, 'R', r.anchor.R, 'v', r.v, 'recoilV', r.recoilV, 'heldBack', r.heldBack); }
