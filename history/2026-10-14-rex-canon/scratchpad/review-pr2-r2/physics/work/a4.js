const { P, D, rex, ollie, surf, objs, ON, OFF, ctx } = require('./h.js');
const g = P.K.g, c = P.K.c;
const pick = (r) => JSON.stringify({ clash: r.clash, oneSided: r.oneSided, vA: r.vA, vB: r.vB, slideA: r.slideA, tearA: r.tearA, tearB: r.tearB, stalled: r.stalled, rA: r.recoilAbsorbed, toGround: r.toGround, toGroundB: r.toGroundB });
for (const s of ['concrete', 'sand', 'granite', 'ice']) for (const [lab, pw] of [['ON unbreakable off', Object.assign({}, ON, { unbreakable: false })], ['ON', ON], ['own only', Object.assign({}, OFF, { ownRecoil: true })], ['OFF', OFF]]) for (const aA of ['friction', 'bolted']) {
  const cA = ctx(Infinity, pw, { surface: surf(s), anchor: aA }), cB = Object.assign({}, cA, { body: ollie, anchor: 'bolted' });
  console.log(s, lab, 'Rex', aA, '->', pick(P.shove(cA, cB)));
}
// finite huge shove into bolted Ollie, power on: stalls
const cA = ctx(1e20, ON), cB = Object.assign({}, cA, { body: ollie, anchor: 'bolted' });
console.log('1e20 finite', pick(P.shove(cA, cB)), 'tear limit', (surf('concrete').shear * ollie.digArea).toFixed(0));
