const { P, D, g, surf, obj, ctxOf } = require('./eng.js');
for (const lk of [9, 12, 15, 18, 20, 22, 25]) {
  const c = ctxOf(Math.pow(10, lk));
  const r = P.punch(c), cl = P.clap(c);
  const gb = P.grownBody(c.body, r.E, 0.5);
  console.log(lk, 'punch E', r.E.toExponential(2), 'ratio', gb.ratio.toExponential(3), 'clap E', cl.E.toExponential(2));
}
