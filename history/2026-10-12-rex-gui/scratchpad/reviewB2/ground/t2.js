const { P, D, rex, surf, obj, ctx, ON, K } = require('./h.js');
for (const sid of ['sand','gravel','softclay','stiffclay']) {
  for (const m of [3007, 30070, 300700]) {
    const b = rex(m);
    for (const e of [0.5, 1]) {
      const s0 = P.walkStep(b, surf(sid), { effort: e, pace: 'walk' });
      const s1 = P.walkStep(b, surf(sid), { effort: e, pace: 'walk', unbreakable: true });
      console.log(sid, m, 'effort', e, 'off:', JSON.stringify(s0.footprint), ' on:', JSON.stringify(s1.footprint));
    }
  }
}
// stomp on soft clay at modest effort
for (const sid of ['softclay','stiffclay','sand']) {
 for (const kg of [3e3, 1e4, 3e4, 1e5]) {
  const c0 = ctx({ F: kg*K.g, surface: surf(sid) });
  const r0 = P.stomp(c0), r1 = P.stomp(Object.assign({}, c0, { unbreakable: true }));
  console.log('stomp', sid, kg, 'off hole', r0.holeDepth.toFixed(3), 'on hole', r1.holeDepth.toFixed(3), 'realBreaks', r1.realBreaks, 'vFoot', r1.vFoot.toFixed(1));
 }
}
