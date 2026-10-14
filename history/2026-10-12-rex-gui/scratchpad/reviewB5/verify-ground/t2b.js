const { P, D, rex, surf, obj, ctxOf } = require('./common.js');
const M = P.RESTRAINT.MOVES.stomp;
for (const sid of ['concrete', 'asphalt', 'granite', 'stiffclay', 'gravel', 'sand']) {
  const s = surf(sid);
  let prev = null, drops = [];
  for (let lg = -1; lg <= 7; lg += 0.01) {
    const t = Math.pow(10, lg);
    const c = ctxOf({ F: t * 1000 * P.K.g, surface: s });
    const r = P.stomp(c);
    const o = { body: rex, surface: s, unbreakable: true, near: 5 };
    const b = M.blow(r, o); if (!b) continue;
    const ppv = P.ppvAt(M.shake(r, o), 5) * 1000;
    if (prev && ppv < prev.ppv * 0.98) drops.push(`${prev.t.toPrecision(3)}t->${t.toPrecision(3)}t: J ${prev.J.toFixed(0)}->${b.J.toFixed(0)} ppv5 ${prev.ppv.toFixed(2)}->${ppv.toFixed(2)} (realBreaks ${prev.rb}->${r.realBreaks})`);
    prev = { t, J: b.J, ppv, rb: r.realBreaks };
  }
  console.log(sid, 'qult', P.qultFor(s, rex.footB).toFixed(0), drops.length ? drops.join('; ') : 'monotone');
}
