const { P, D, body, surf, ctx } = require('./eng.js');
const o = D.objects.find((x) => x.id === 'car');
for (const own of [true, false]) { const c = ctx(100 * 907.18474, { ownRecoil: own }); const r = P.throwObject(c, o, 45); console.log('ownRecoil', own, 'anchor.R', r.anchor && r.anchor.R, 'v', r.v, 'recoilV', r.recoilV); }
