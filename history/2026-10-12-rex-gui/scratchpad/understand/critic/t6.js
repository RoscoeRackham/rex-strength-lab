const { P, D, g, surf, obj, rex, ollie, ctx } = require('./base.js');
for (const id of ['baseball', 'car', 'bus', 'pyramid']) for (const kg of [1e25, 1e30, Infinity]) {
  const r = P.throwObject(ctx(kg), obj(id), 45);
  if (!r.canMove) { console.log(id, kg, 'cant'); continue; }
  console.log(id, kg.toExponential ? kg.toExponential(0) : kg, 'rel', !!r.flight.relativistic, 'v/c', (r.v / P.K.c).toFixed(6), 'recoil/c', (r.recoilV / P.K.c).toFixed(6), 'Eobj', r.Eobj.toExponential(2), 'recoilE', r.recoilE.toExponential(2), 'blast', P.RESTRAINT.MOVES.throw.blast(r, { obj: obj(id) }).toExponential(2));
}
console.log('pyramid m', obj('pyramid').m, 'noThrow', obj('pyramid').noThrow);
