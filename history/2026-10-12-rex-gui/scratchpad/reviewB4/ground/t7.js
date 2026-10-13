const { P, D, rex, surf, obj, ctx, ON } = require('./h.js');
const RS = P.RESTRAINT;
// bus on ice
for (const pw of [{}, { ownRecoil: true }, ON]) {
  const c = ctx(Object.assign({ kg: 1e5, s: 'ice' }, pw));
  const r = P.throwObject(c, obj('bus'), 45);
  const o = Object.assign({ near: 5, body: rex, surface: surf('ice'), anchor: 'friction', m: rex.m, obj: obj('bus'), angle: 45 }, pw);
  console.log('bus/ice', JSON.stringify(pw), 'v', r.v.toFixed(2), 'recoilV', r.recoilV.toFixed(3), 'slide', RS.MOVES.throw.slide(r, o).toFixed(2), 'toGround', JSON.stringify(r.toGround), 'pObj', (r.v * obj('bus').m).toFixed(0), 'shake', JSON.stringify(RS.MOVES.throw.shake(r, o)));
}
// All-Star baseball
for (const pw of [{}, ON]) {
  const c = ctx(Object.assign({ kg: 1.81436948e23, s: 'concrete' }, pw));
  const r = P.throwObject(c, obj('allstar') ? obj('baseball') : obj('baseball'), 0);
  const o = Object.assign({ near: 5, body: rex, surface: surf('concrete'), anchor: 'friction', m: rex.m, obj: obj('baseball'), angle: 0 }, pw);
  const src = RS.MOVES.throw.shake(r, o);
  console.log('allstar', JSON.stringify(pw), 'v/c', (r.v / P.K.c), 'Eobj', r.Eobj.toExponential(3), 'recoilV/c', r.recoilV / P.K.c, 'toGround', JSON.stringify(r.toGround), 'pObj from E', (Math.sqrt(r.Eobj * (r.Eobj + 2 * 0.1453 * P.K.c ** 2)) / P.K.c).toExponential(4), 'ppv5', P.ppvAt(src, 5), 'plaster', P.plasterReach(src), 'nonlin', P.ppvNonlinear(src, 5));
}
