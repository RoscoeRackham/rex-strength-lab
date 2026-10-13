const { P, body, obj, ctx } = require('./load.js');
const bb = obj('baseball');
for (const s of [0, 0.5, 0.9, 0.99, 1]) {
  for (const kf of [false, true]) {
    const c = ctx({ F: 1.81436948e23 * P.K.g, airAbsorb: s, keepForm: kf, unbreakable: true, ownRecoil: true });
    const r = P.throwObject(c, bb, 0);
    const fa = P.fastAir(bb, r.Eobj, 0, 1 - s);
    const g = 1 + r.Eobj / (bb.m * P.K.c ** 2);
    console.log(s, kf, 'v/c', r.v / P.K.c, 'gamma', g.toExponential(4), 'Eobj', r.Eobj.toExponential(4), 'line', JSON.stringify(r.line), 'fastAir k', fa.k, 'x', fa.x.toFixed(1), 'Eair/E', (fa.Eair / r.Eobj).toFixed(4), 'Eair0/E', (fa.Eair0/r.Eobj).toFixed(5), 'dHalf', fa.dHalf, 'vOut', fa.vOut, 'recoilV', r.recoilV);
  }
}
