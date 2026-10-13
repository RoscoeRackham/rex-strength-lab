const {P, obj, ctx, rex, ALL} = require('./load.js');
const g=P.K.g, c=P.K.c;
const allstar = 200e18 * 907.18474;
const b = obj('baseball');
for (const s of [0, 0.5, 0.9, 0.99, 1]) {
  const r = P.throwObject(ctx(allstar, { airAbsorb: s, keepForm: s>0 }), b, 0);
  const fa = s<1 ? P.fastAir(b, r.Eobj, 0, 1-s) : null;
  const bl = P.RESTRAINT.MOVES.throw.blastParts(r, { airAbsorb: s, keepForm: s>0, obj: b, body: rex, angle: 0 });
  console.log(s, 'v', r.v/c, 'E', r.Eobj.toExponential(3), 'gm1', (r.Eobj/(b.m*c*c)).toExponential(3), fa && ['x', fa.x.toExponential(3), 'Eair/E', (fa.Eair/r.Eobj).toFixed(5), 'vOut/c', fa.vOut/c, 'dHalf', fa.dHalf], 'blast', JSON.stringify(bl));
}
// independent snowplow check
function snow(gamma, x){ const gf=(gamma+x)/Math.sqrt(1+2*gamma*x+x*x); return (gf-1)/(gamma-1); }
const r0 = P.throwObject(ctx(allstar), b, 0); const gam = 1 + r0.Eobj/(b.m*c*c);
const col = 1.225*P.K.Hs/0.03, x = col*b.area/b.m;
console.log('gamma', gam, 'x', x, 'keep(x)', snow(gam,x), 'keep(x/2)', snow(gam,x/2), '1-keep', 1-snow(gam,x/2));
