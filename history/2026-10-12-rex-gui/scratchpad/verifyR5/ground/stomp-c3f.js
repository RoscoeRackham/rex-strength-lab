const { P, g, M, surf, rex, ON, ctxOf } = require('./envfix4.js');
const fmt = (x) => Number(x).toPrecision(4);
let worst = [];
for (let lg = 25; lg <= 34; lg += 0.01) {
  const c = ctxOf(Math.pow(10, lg) * g, Object.assign({}, ON)), r = P.stomp(c), b = M.stomp.blow(r, Object.assign({ surface: c.surface, body: rex }, ON));
  const pE = Math.sqrt(r.E * r.E + 2 * r.E * rex.legEff * P.K.c * P.K.c) / P.K.c, k = b.whole / pE;
  if (Math.abs(k - 1) > 0.05) worst.push(lg.toFixed(2) + ':' + fmt(k));
}
console.log(worst.length, 'dials (0.01 steps from 10^25 to 10^34) where the stomp whole momentum is off by >5%');
console.log(worst.join(' '));
