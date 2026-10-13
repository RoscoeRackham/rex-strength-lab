const { P, D, body, surf, ctx } = require('./eng.js');
const M = P.RESTRAINT.MOVES.stomp;
for (const kg of [1e8, 1e14, 1e15, 1e20]) {
  for (const unb of [true, false]) {
    const c = ctx(kg, { unbreakable: unb });
    const r = P.stomp(c);
    const o = Object.assign({}, c, { body, surface: c.surface });
    console.log(kg.toExponential(0), 'unb', unb, 'vFoot/c', (r.vFoot / P.K.c).toPrecision(3), 'E', r.E.toPrecision(3), 'absorbed', r.absorbed, 'blast', M.blast(r, o));
  }
  const c = ctx(kg); const r = P.stomp(c);
  const v = Math.min(r.vFoot, P.K.c), g = 1 / Math.sqrt(1 - (v / P.K.c) ** 2);
  const mAir = P.K.rho0 * body.footArea * body.strokes.stomp;
  console.log('   foot air: footArea', body.footArea.toFixed(3), 'stroke', body.strokes.stomp, 'mAir', mAir.toFixed(3), 'E_upper', (g * mAir * v * v).toPrecision(3), 'J =', (g * mAir * v * v / 4.184e15).toPrecision(3), 'Mt; houses 26.8 kPa radius', P.blastRadius ? P.blastRadius(g * mAir * v * v, 26800).toPrecision(3) : '');
}
