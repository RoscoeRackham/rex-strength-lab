const { P, D, surf, obj, rex, tons, ctx } = require('./lib.js');
const M = P.RESTRAINT.MOVES;
const fmt = (x) => (typeof x === 'number' ? x.toPrecision(4) : x);
const body = rex(), T = P.limbPulse(body);
for (const s of ['sand', 'gravel']) {
  const sf = surf(s), q = P.qultFor(sf, body.footB), sd = P.standDepth(sf, 0, body.footB, body.H);
  console.log(s, 'qult', fmt(q), 'qFail', fmt(sd.qFail), 'cap(qult)', fmt(q * body.footArea * T), 'cap(qFail)', fmt(sd.qFail * body.footArea * T), 'Nmax(qult) both feet', fmt(2 * q * body.footArea), 'Nmax(qFail)', fmt(2 * sd.qFail * body.footArea));
  for (const t of [0.5, 1, 1.096, 1.2, 6, 100, 1e4]) {
    const c = ctx({ surface: s, kg: tons(t) }); const o = Object.assign({ body, surface: sf, m: body.m, near: 5, anchor: 'friction' }, c);
    const r = M.stomp.run(c, o), b = M.stomp.blow(r, o);
    const Jfull = b.whole || b.J, capF = sd.qFail * body.footArea * T, Jalt = r.realBreaks ? Math.min(Jfull, capF) : Jfull;
    console.log('  ', t + 't', 'realBreaks', r.realBreaks, 'J now', fmt(b.J), 'ppv5 now', fmt(P.ppvAt(P.impulseSource(sf, b.J, b.T), 5) * 1e3), '| with qFail cap J', fmt(Jalt), 'ppv5', fmt(P.ppvAt(P.impulseSource(sf, Jalt, b.T), 5) * 1e3));
  }
}
