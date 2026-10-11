const { P, D, g, S, O, T, ctx } = require('./common');
const f = (x) => x.toPrecision(4);
for (const mode of ['real', 'comic']) for (const kg of [511, 1300, 1400, 2000, 5000, 9072, 1e5, 1e6, 1.36e11]) {
  const c = ctx(kg, { surface: 'sand', mode });
  const r = P.jump(c);
  const EB = r.push.EB, EA = r.push.EA;
  console.log(mode, 'sand lift', kg, 'v', f(r.v), 'apex', f(r.flight.apex), 'fails', r.groundFails, 'saturated', !!r.push.saturated, '| pA', f(r.push.pA), 'pB', f(r.push.pB), '| work F*d', f(r.F * 0.5), 'body KE', f(r.Ebody), 'feet KE (discarded)', f(EB));
}
// sprint vs standing bearing at kaiju size on clay
const ck = ctx(511, { H: 50, surface: 'clay' });
const sp = P.sprint(ck), li = P.lift(ck, O.car);
console.log('kaiju clay: lift standRatio', li.standRatio.toFixed(2), '| sprint accelG', sp.accelG.toFixed(2), 't100', sp.t100.toFixed(2), 'limit', sp.limit);
// comic ground semantics: sprint unlimited grip vs pull/throw friction-limited
const cg = ctx(1.8e20, { surface: 'concrete', groundHolds: true });
const pl = P.pull(cg, O.tank), spr = P.sprint(cg), pu = P.punch(cg);
console.log('comic ground All-Star: pull tank canMove', pl.canMove, 'anchor R', pl.anchor.R.toFixed(0), 'limitedBy', pl.limitedBy, '| sprint thrust', spr.thrust.toPrecision(3), 'limit', spr.limit, '| punch anchor', pu.anchor.R.toFixed(0));
