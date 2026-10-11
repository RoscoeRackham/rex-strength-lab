const { P, g, ctx, obj } = require('./common.js');
const { refHill } = require('./ref.js');
function cases(kg, extra) {
  const c = ctx(kg, 'real', extra); const b = c.body; const F = c.F;
  const anc0 = P.anchorCapacity({ body: b, surface: c.surface, theta: 0, anchor: c.anchor, groundHolds: c.groundHolds });
  const out = {};
  out.punch = [{ F: F * 0.3, d: b.strokes.punch, mA: b.m - b.handEff, mB: b.handEff, RA: anc0.R, RB: 0, vmax: 17 }, 'vB'];
  out.stompBody = [{ F: F * 0.5, d: b.strokes.stomp, mA: b.m - b.legEff, mB: b.legEff, RA: (b.m - b.legEff) * g, RB: 0, vmax: 16 }, 'vA'];
  out.jump = [{ F: F, d: b.strokes.leg, mA: b.m - b.feetMass, mB: b.feetMass, RA: (b.m - b.feetMass) * g, RB: c.groundHolds ? Infinity : c.surface.qult * 2 * b.footArea, vmax: 30 }, 'vA'];
  for (const id of ['shot', 'car', 'bus']) {
    const o = obj(id), th = Math.PI / 4, hands = o.m > 20 ? 2 : 1, arm = hands * b.handEff;
    const anc = P.anchorCapacity({ body: b, surface: c.surface, theta: th, anchor: c.anchor, groundHolds: c.groundHolds, extraMass: o.m });
    out[id + '45'] = [{ F: F * 0.3, d: b.strokes.throw, mA: b.m - arm, mB: o.m + arm, RA: anc.R, RB: (o.m + arm) * g * Math.sin(th), vmax: 55 }, 'vB'];
  }
  return out;
}
for (const extra of [{}, { groundHolds: true }, { surface: 'sand' }]) {
  console.log('== real, 1e14 kg (Hulk tier),', JSON.stringify(extra));
  for (const [name, [o, side]] of Object.entries(cases(1.36e14, extra))) {
    const e = P.pushApart(Object.assign({ mode: 'real' }, o)), r = refHill(Object.assign({ N: 50000 }, o));
    console.log('  ', name.padEnd(10), 'engine', e[side].toFixed(3), e.saturated ? '(saturated)' : '', ' reference', r[side].toFixed(3), ' ratio', (e[side] / r[side]).toFixed(3));
  }
}
// what jump() reports
for (const s of ['concrete', 'sand', 'granite']) {
  const j = P.jump(ctx(1.36e14, 'real', { surface: s }));
  const fl = P.fly({ v0: 30 * (180 - 5.22) / 180, thetaDeg: 90, h0: 0, m: 180, A: 0.3, Cd: 1 });
  console.log('jump() Hulk real', s, 'v', j.v.toFixed(3), 'apex', j.flight.apex.toFixed(4), 'm; correct v', (30 * (180 - 5.22) / 180).toFixed(2), 'apex', fl.apex.toFixed(1), 'm');
}
