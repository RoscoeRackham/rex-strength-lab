const {P, obj, ctx, rex, ALL} = require('./load.js');
const c=P.K.c, M=P.RESTRAINT.MOVES;
// independent relativistic snowplow: share of energy left after sweeping x of its own masses
const keep = (gm1, x) => { const g=1+gm1; const gf=(g+x)/Math.sqrt(1+2*g*x+x*x); return (gf-1)/gm1; };
const keepS = (gm1, x) => { const S=Math.sqrt((1+x)*(1+x)+2*gm1*x); return (gm1+2)/(S*(1+x+gm1+S)); };
function show(label, kg, id, ang, s) {
  const o=obj(id); const cc = ctx(kg, Object.assign({}, ALL, { airAbsorb: s }));
  const r = P.throwObject(cc, o, ang);
  const opt = Object.assign({ obj: o, angle: ang, body: rex }, ALL, { airAbsorb: s });
  const b = M.throw.blastParts(r, opt);
  const gm1 = r.Eobj/(o.m*c*c), unit = o.m/(1.225*o.area), k=1-s;
  const fa = P.fastAir(o, r.Eobj, ang, k);
  const within = (d) => 1 - keepS(gm1, k*d/unit);
  console.log(label, 'v/c', (r.v/c).toPrecision(6), 'E', r.Eobj.toExponential(3), 'gm1', gm1.toExponential(2), 'share', s,
    '| blast land (engine, near him)', (b.land/r.Eobj).toPrecision(3), 'x E; hand', b.hand ? (b.hand/r.Eobj).toPrecision(3)+' x E' : '-',
    '| snowplow deposits within 1 m:', within(1).toPrecision(4), ' 5 m:', within(5).toPrecision(4), ' 15 m:', within(15).toPrecision(4), ' whole path:', (fa.Eair/r.Eobj).toPrecision(5), ' dHalf', fa.dHalf.toPrecision(3), 'm');
}
show('allstar', 200e18*907.18474, 'baseball', 0, 0.5);
show('allstar', 200e18*907.18474, 'baseball', 0, 0.9);
show('allstar', 200e18*907.18474, 'baseball', 0, 0.99);
show('car 1e17', 1e17, 'car', 45, 0.5);
show('car 1e17', 1e17, 'car', 45, 0.99);
show('car 1e20', 1e20, 'car', 45, 0.9);
show('pyramid 1e24', 1e24, 'pyramid', 45, 0.9);
