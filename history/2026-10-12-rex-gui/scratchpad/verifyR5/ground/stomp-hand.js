const { P, g, M, surf, rex, ollie, ON, ctxOf } = require('./env.js');
const fmt = (x) => Number(x).toPrecision(6);
for (const body of [rex, ollie]) for (const sf of ['sand', 'gravel', 'concrete', 'granite']) {
  const s = surf(sf), q = P.qultFor(s, body.footB), A = body.footArea, m = body.legEff, rho = s.rho;
  const dEdge = s.granular ? P.keptPrint(s, body) : 0.01;
  // bisect penetrationDepth = dEdge
  let lo = 0, hi = 1e4; for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (P.penetrationDepth(m, A, mid, q, rho) > dEdge) hi = mid; else lo = mid; }
  const r = P.stomp(ctxOf(1e12 * g, Object.assign({ body }, ON, { surface: s }))), b = M.stomp.blow(r, Object.assign({ surface: s, body }, ON));
  // the stamp extra term, via the engine at a stomp whose vFoot is just at the edge
  const qAT = q * A * b.T;
  // find the effort where realBreaks flips and read J just before
  let a = 0, z = 12; for (let i = 0; i < 80; i++) { const mid = (a + z) / 2; if (P.stomp(ctxOf(Math.pow(10, mid) * g, Object.assign({ body }, ON, { surface: s }))).realBreaks) z = mid; else a = mid; }
  const rA = P.stomp(ctxOf(Math.pow(10, a) * g, Object.assign({ body }, ON, { surface: s }))), bA = M.stomp.blow(rA, Object.assign({ surface: s, body }, ON));
  console.log(body.build, sf, 'dEdge', fmt(dEdge), 'printCap(stomp)', r.printCap, 'vEdge bisect', fmt(lo), 'vFoot at flip', fmt(rA.vFoot), 'J just below', fmt(bA.J), 'cap', fmt(b.J), 'qAT', fmt(qAT), 'realHole just below', fmt(rA.realHole));
}
