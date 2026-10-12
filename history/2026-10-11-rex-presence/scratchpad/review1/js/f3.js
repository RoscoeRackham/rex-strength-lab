const { P, g, ctxOf, surf, rex } = require('./env.js');
const M = P.RESTRAINT.MOVES.stomp;
for (const sid of ['concrete', 'granite', 'sand', 'asphalt']) {
  const sf = surf(sid); if (!sf) continue;
  for (const kg of [90718.474, 1e6, 1e7, 1e8, 1e9]) {
    const r = P.stomp(ctxOf(kg * g, { surface: sf }));
    const src = M.shake(r, { surface: sf, body: rex });
    const v3 = src ? P.ppvAt(src, 3) : 0, vh3 = src ? P.ppvAt(src, 3, true) : 0;
    console.log(sid, kg.toExponential(2), 'vFoot', r.vFoot.toFixed(2), 'PPV@3m mm/s', (v3 * 1e3).toPrecision(3), 'horiz', (vh3 * 1e3).toPrecision(3), 'TH plaster', P.VIB.TH.plaster * 1e3, 'plasterWalk', (P.VIB.TH.plasterWalk * 1e3).toFixed(2), 'feel', P.VIB.TH.feel * 1e3, 'shimmer', P.VIB.TH.shimmer * 1e3);
  }
  // walk: stamp at e=1
  const st = P.walkStep(rex, sf, { effort: 1, pace: 'walk' });
  if (st.modelled) console.log('  walk stamp PPV@3m', (P.ppvAt(st.src, 3) * 1e3).toPrecision(3), 'horiz', (P.ppvAt(st.src, 3, true) * 1e3).toPrecision(3));
}
