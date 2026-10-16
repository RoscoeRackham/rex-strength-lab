const { P, g, sig, F0, ctxOf, sf } = require('./common');
const c = P.K.c;
// Old engine at 3,000 kg
for (const [label, F, src, gb] of [['sprint, default dial', F0, 'sprint'], ['jump, dial 1e9', 1e9 * g, 'jump'], ['stomp, dial 1e9', 1e9*g, 'stomp'], ['set 0.1% c', 1e6 * g, 'set', 1e-3]]) {
  const cO = ctxOf('ollie', { F }), cR = ctxOf('rex', { F });
  for (const bounce of [false, true]) {
    const r = P.collide(cO, cR, { source: src, gb, bounce });
    const af = r.after && (bounce ? r.after.bounce : r.after.splat);
    console.log('OLD', label, bounce ? 'bounce' : 'splat', JSON.stringify({ v0: sig(r.v0), outcome: r.outcome, held: r.held, why: r.hold && r.hold.why, H: sig(r.hold && r.hold.H), Fheld: sig(r.Fheld), af: af && Object.fromEntries(Object.entries(af).map(([k, v]) => [k, sig(v)])), toGround: r.toGround && Object.fromEntries(Object.entries(r.toGround).map(([k, v]) => [k, sig(v)])), Q: sig(r.Q), Elocal: sig(r.Elocal), pA: sig(r.pA) }));
  }
}
// New: unbounded charger, roles swapped
const sprintV = P.collide(ctxOf('ollie'), ctxOf('rex'), { source: 'sprint' }).v0;
for (const [label, v] of [['sprint', sprintV], ['0.1% c', c * 1e-3 / Math.sqrt(1 + 1e-6)], ['set gb=1e-3 exact', c*1e-3/Math.sqrt(1+1e-6)], ['50% c', 0.5*c], ['90% c', 0.9*c]]) {
  const m = 3000, h = P.headOn(P.vToMomentum(v, m), m, Infinity);
  const vB = 2 * v / (1 + (v / c) * (v / c));
  console.log('NEW', label, JSON.stringify({ v: sig(v), splatP: sig(P.vToMomentum(v, m)), Q: sig(h.Q), bounceV: sig(vB), bounceP: sig(P.vToMomentum(vB, m)), elvA: sig(h.el.vA), elpT: sig(h.el.pT) }));
}
