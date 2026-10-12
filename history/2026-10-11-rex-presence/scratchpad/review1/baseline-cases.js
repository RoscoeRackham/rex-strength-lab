// The setting combinations and the outputs compared by the all-out regression check (test/presence.js).
const g = 9.80665;
function cases(D) {
  const out = [];
  const bodies = { rex: { build: 'rex', H: 3.048, m: 3007 }, cal: { build: 'human', H: 2, m: 180 } };
  for (const bk of Object.keys(bodies)) for (const mode of ['comic', 'real']) for (const sid of ['sand', 'concrete', 'granite']) for (const lg of [2.7, 4, 5, 7, 12, 20]) for (const anchor of ['friction', 'braced', 'bolted']) for (const gh of [false, true]) {
    out.push({ key: [bk, mode, sid, lg, anchor, gh].join('|'), body: bodies[bk], mode, sid, F: Math.pow(10, lg) * g, anchor, groundHolds: gh });
  }
  return out;
}
const r6 = (x) => (typeof x === 'number' && isFinite(x) ? Number(x.toPrecision(12)) : String(x));
function summarize(P, D, c, extra) {
  const body = P.makeBody(c.body), surface = D.surfaces.find((s) => s.id === c.sid);
  const ctx = Object.assign({ F: c.F, mode: c.mode, body, surface, groundHolds: c.groundHolds, anchor: c.anchor }, extra || {});
  const obj = (id) => D.objects.find((o) => o.id === id);
  const t = P.throwObject(ctx, obj('car'), 45), tb = P.throwObject(ctx, obj('baseball'), 30), j = P.jump(ctx), st = P.stomp(ctx), pu = P.punch(ctx), cl = P.clap(ctx), sp = P.sprint(ctx), pl = P.pull(ctx, obj('bus')), li = P.lift(ctx, obj('pickup'));
  return [t.v, t.flight && t.flight.range, t.recoilV, t.gripRatio, t.sinkRatio, tb.v, tb.flight && tb.flight.range, j.v, j.flight && j.flight.apex, j.Eground, st.E, st.vFoot, st.holeDepth, pu.E, pu.vFist, pu.recoilV, cl.E, cl.vHand, sp.vTop, sp.thrust, pl.t10m, pl.canMove, li.canLift, li.groundRatio, li.gripRatio].map(r6);
}
module.exports = { cases, summarize };
