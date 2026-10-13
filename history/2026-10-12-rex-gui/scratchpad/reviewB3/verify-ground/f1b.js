const { P, surf, ctx } = require('./common.js');
const sand = surf('sand');
const kg = 100 * 907.18474;
for (const [ub, tg] of [[true, false], [false, true], [false, false]]) {
  const cA = ctx(kg, { surface: sand, unbreakable: ub });
  const cB = ctx(kg, { surface: sand, unbreakable: ub });
  const r = P.collide(cA, cB, { source: "jump", bounce: false, toGround: tg });
  if (!r) { console.log(Object.keys(P).filter(k => /col/i.test(k))); process.exit(); }
  const tgx = r.toGround;
  const src = tgx ? P.impulseSource(sand, tgx.J, tgx.T) : null;
  console.log('unbreakable', ub, 'toGroundOpt', tg, 'v0', r.v0.toFixed(2), 'held', r.held, 'hold', r.hold.why, 'H', r.hold.H, 'Fheld', (r.Fheld/1e6).toFixed(2)+'MN', 'toGround', tgx ? JSON.stringify({ J: tgx.J.toExponential(3), T: tgx.T.toFixed(4), how: tgx.how, meankN: (tgx.J / tgx.T / 1e3).toFixed(0) }) : null);
  if (src) console.log('   ppv@5', (P.ppvAt(src, 5) * 1e3).toFixed(1), 'mm/s plasterReach', P.plasterReach(src).toFixed(1), 'm');
  if (ub) { const Hreal = P.holdOf(Object.assign({}, cB, { unbreakable: false }), false).H; console.log('   real bearing beyond weight', (Hreal/1e3).toFixed(1), 'kN'); }
}
