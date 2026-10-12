const { P, D, g, surf, obj, ctx, rex } = require('./lib.js');
const b = rex();
console.log('legEff', b.legEff, 'm', b.m, 'H', b.H, 'strokes.stomp', b.strokes.stomp);
for (const sid of ['concrete', 'sand']) {
  const s = surf(sid);
  const st = P.walkStep(b, s, { pace: 'walk', effort: 1 });
  const hann = st.src.find(x => x.kind === 'hann');
  const J = hann.F * hann.T / 2;
  console.log(sid, 'walk stamp: Fpulse', st.Fpulse.toFixed(0), 'T', st.Tpulse.toFixed(4), 'impulse N s', J.toFixed(0), 'J/W', (J / st.W).toFixed(3), 'PPV@3m mm/s', (1e3 * P.ppvAt(st.src, 3)).toFixed(2));
  // stomp at various efforts: find foot speed and PPV@3
  const M = P.RESTRAINT.MOVES.stomp;
  const o = { near: 5, body: b, surface: s };
  let found37 = false, found = null, found127 = null;
  for (let i = 0; i <= 600; i++) {
    const kg = 30 * Math.pow(1e8 / 30, i / 600);
    const r = P.stomp(ctx({ surface: s, use: kg * g, F: 1e8 * g }));
    const src = M.shake(r, o);
    const v3 = P.ppvAt(src, 3);
    if (!found37 && r.vFoot >= 3.7) { found37 = true; console.log('  stomp first vFoot>=3.7 at', kg.toFixed(0), 'kg: vFoot', r.vFoot.toFixed(2), 'impulse', (b.legEff * r.vFoot).toFixed(0), 'PPV@3 mm/s', (1e3 * v3).toFixed(3)); }
    if (!found && v3 >= P.ppvAt(st.src, 3)) { found = 1; console.log('  stomp matches stamp PPV@3 at', kg.toFixed(0), 'kg: vFoot', r.vFoot.toFixed(1), 'hole', (r.holeDepth || 0).toFixed(3), 'crater', r.crater); }
    if (!found127 && v3 >= 12.7e-3) { found127 = 1; console.log('  stomp 12.7 mm/s at 3 m at', kg.toExponential(2), 'kg: vFoot', r.vFoot.toFixed(1), 'hole', (r.holeDepth || 0).toFixed(3)); }
  }
}
