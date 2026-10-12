const { P, D, g, surf, obj, rex, ctxOf } = require('./lib.js');
const R = P.RESTRAINT, M = R.MOVES.stomp;
const W = rex.m * g;
const fp = 2 * P.WALK.STAMP.t * Math.sqrt(P.WALK.HIP * rex.H / P.WALK.HS.h);
const vSt = Math.sqrt(2 * g * P.WALK.STAMP.thigh * rex.H);
const sm = 0.5 * P.WALK.STAMP.kPeak * W * fp / vSt;
console.log('legEff', rex.legEff, 'footPulse', fp, 'vSt', vSt, 'stampMass', sm, 'ratio', sm / rex.legEff);
for (const sid of ['concrete', 'sand']) {
  const c = ctxOf(1e9, { surface: surf(sid) });
  const p = R.planNow('stomp', c, { near: 5 });
  const hz = p.result('hazard:plaster'), pr = p.result('preset:plaster'), gl = p.goal();
  const r = p.run(hz.use);
  const src = M.shake(r, p.opt);
  console.log(sid, 'goal', (gl.use / g).toPrecision(3), 'vFoot@goal', p.run(gl.use).vFoot.toFixed(2), 'plaster onset kg', (hz.use / g).toPrecision(3), 'vFoot', r.vFoot.toFixed(2), 'vBody', r.vBody.toFixed(3), 'hole', r.holeDepth, 'ceiling', p.ceiling().by, (p.ceiling().below/g).toPrecision(3));
  console.log('   src', JSON.stringify(src && { F: src.F, T: src.T, kind: src.kind }), 'J model (2·F·T/π ~?)', 'leg momentum', (rex.legEff * r.vFoot).toFixed(0), 'stamp-mass momentum', (sm * r.vFoot).toFixed(0));
  // alternative: J = legEff v + (sm - legEff) min(v, vSt)
  const alt = (u) => { const rr = p.run(u); if (!(rr.vFoot > 0)) return false; const J = rex.legEff * rr.vFoot + (sm - rex.legEff) * Math.min(rr.vFoot, vSt); const T = Math.max(fp, 2 * (rr.holeDepth || 0) / rr.vFoot); return P.ppvAt(P.vibSource(c.surface, "hann", 2 * J / T, T), 5) >= P.VIB.TH.plaster; };
  if (true) {
    let lo = p.lo, hi = c.F; if (alt(lo)) console.log('  alt at lo'); else if (!alt(hi)) console.log('  alt never'); else { for (let i = 0; i < 80; i++) { const mid = Math.sqrt(lo * hi); if (alt(mid)) hi = mid; else lo = mid; } console.log('  alt plaster onset kg', (hi / g).toPrecision(3), 'vFoot', p.run(hi).vFoot.toFixed(1)); }
  } else console.log('no impulseSource export');
}
