const { P, g, M, surf, rex, ON, ctxOf } = require(process.env.FIX2 ? './envfix2.js' : process.env.FIX ? './envfix.js' : './env.js');
const sf = process.argv[2] || 'concrete';
const fmt = (x) => x == null ? '-' : Number(x).toPrecision(4);
for (let lg = 4; lg <= 12.41; lg += 0.4) {
  const PW = process.env.OFF ? {} : ON; const c = ctxOf(Math.pow(10, lg) * g, Object.assign({}, PW, { surface: surf(sf) })), r = P.jump(c);
  const o = Object.assign({ surface: c.surface, body: rex, m: rex.m, near: 5 }, PW), re = P.RESTRAINT.reach('jump', r, o);
  console.log(lg.toFixed(1), 'plaster', fmt(re.plaster), 'rattle', fmt(re.rattle), 'feel', fmt(re.feel), 'ppv5', fmt(P.ppvAt(M.jump.shake(r, o), 5) * 1000), 'mm/s');
}
