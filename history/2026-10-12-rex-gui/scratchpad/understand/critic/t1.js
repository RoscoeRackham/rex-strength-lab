const { P, D, g, surf, obj, rex, ollie, ctx } = require('./base.js');
for (const kg of [1.8e23, Math.pow(10, Math.log10(1.81436948e23))]) {
  const r = P.throwObject(ctx(kg), obj('baseball'), 0);
  console.log(kg.toExponential(4), 'v/c', 1 - r.v / P.K.c, 'Eobj', r.Eobj.toExponential(3), 'recoil/c', (r.recoilV / P.K.c).toFixed(5), 'recoilE', r.recoilE.toExponential(3), 'rel', r.flight.relativistic, 'blast', P.RESTRAINT.MOVES.throw.blast(r, { near: 5 }).toExponential(3), 'from', P.RESTRAINT.MOVES.throw.blastFrom(r, {}));
}
console.log(Object.keys(P).filter(k=>/impulse|ppv|plaster|footPulse|vibSource|DUO|headOn|catchLeg|throwObject/.test(k)));
