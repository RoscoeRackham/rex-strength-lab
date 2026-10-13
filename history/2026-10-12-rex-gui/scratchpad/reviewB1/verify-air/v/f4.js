const { P, obj, rex, ctx, K } = require('./env.js');
const b = obj('baseball');
const c = ctx(1.81436948e23, rex(), { airAbsorb: 0, keepForm: false });
const r = P.throwObject(c, b, 0);
const E = r.Eobj, m = b.m, g = 1 + E / (m * K.c * K.c);
for (const k of [1, 0.5]) {
  const fa = P.fastAir ? P.fastAir(b, E, 0, k) : null;
  const x = k * (K.rho0 * K.Hs / 0.03) * b.area / m;
  const S = Math.sqrt(1 + 2 * g * x + x * x), gf = (g + x) / S, heatRest = S - 1 - x;
  const Em = g - 1;
  console.log(`k=${k} x=${x.toFixed(0)} m/A=${(m/b.area).toFixed(1)} kg/m2 column=${(K.rho0*K.Hs/0.03).toFixed(0)} kg/m2 | rest heat ${(heatRest/Em*100).toFixed(2)}% (code fa.E/E=${fa ? (fa.E/E*100).toFixed(2)+'%' : 'n/a'}) | gamma_f=${gf.toFixed(3)} ball KE left ${((gf-1)/Em*100).toExponential(2)}% | lab heat ${(gf*heatRest/Em*100).toFixed(1)}% | swept air KE ${((gf-1)*x/Em*100).toFixed(1)}% | lump bulk KE ${((gf-1)*S/Em*100).toFixed(1)}%`);
}
// at x = 1 (27.8 m swept its own mass)
{ const x = 1, S = Math.sqrt(1 + 2 * g * x + x * x), gf = (g + x) / S; console.log('x=1 unit length', (m / (K.rho0 * b.area)).toFixed(1), 'm; ball KE left', ((gf - 1) / (g - 1) * 100).toFixed(3) + '%', 'rest heat', ((S-2)/(g-1)*100).toFixed(3)+'%'); }
const bl = P.MOVES ? P.MOVES.throw.blast(r, Object.assign({}, c, { obj: b, angle: 0 })) : null;
console.log('MOVES.throw.blast at 0% / E =', bl != null ? bl / E : 'no MOVES export');
