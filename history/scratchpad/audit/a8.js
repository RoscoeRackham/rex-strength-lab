const { P, D, g, S, O, T, ctx } = require('./common');
// Vesic (1973) surface footing on cohesionless soil: q_ult = 0.5 * gamma * B * N_gamma * s_gamma
const Nq = (phi) => Math.exp(Math.PI * Math.tan(phi)) * Math.tan(Math.PI / 4 + phi / 2) ** 2;
const Ng = (phi) => 2 * (Nq(phi) + 1) * Math.tan(phi);
const deg = Math.PI / 180;
const gamma = 1600 * g;
for (const H of [0.4, 2, 50, 500]) {
  const body = P.makeBody({ H });
  const B = Math.sqrt(body.footArea);
  const pStand = body.m * g / (2 * body.footArea);
  const row = [];
  for (const phi of [28, 30, 32, 35]) {
    const q = 0.5 * gamma * B * Ng(phi * deg) * 0.6; // square footing shape factor 1-0.4B/L
    row.push(`phi${phi}: q_ult=${(q / 1e3).toFixed(1)} kPa standRatio=${(pStand / q).toFixed(2)}`);
  }
  const c = ctx(511, { H, surface: 'sand' });
  const l = P.lift(c, O.car);
  const j = P.jump(c);
  console.log(`H=${H} m  B=${B.toFixed(3)} m  stand pressure=${(pStand / 1e3).toFixed(1)} kPa  ENGINE standRatio(sand,150kPa)=${l.standRatio.toFixed(3)} jump RB=${j.groundLimitForce.toPrecision(3)} N\n   ` + row.join(' | '));
}
console.log('Ngamma(30)=', Ng(30 * deg).toFixed(2), 'Nq(30)=', Nq(30 * deg).toFixed(2));
// Kaiju standRatio on all surfaces
for (const sid of Object.keys(S)) { const c = ctx(511, { H: 50, surface: sid }); console.log('kaiju', sid, 'standRatio', P.lift(c, O.car).standRatio.toFixed(3)); }
