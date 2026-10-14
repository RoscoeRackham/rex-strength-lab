const { P, D, rex, surf, obj, ctxOf } = require('./common.js');
const M = P.RESTRAINT.MOVES.stomp;
for (const sid of ['sand', 'gravel', 'softclay']) {
  const s = surf(sid);
  console.log('---', sid, 'qult', P.qultFor(s, rex.footB).toFixed(0));
  let prev = null;
  for (const t of [0.3, 0.5, 0.8, 0.9, 1.0, 1.05, 1.09, 1.095, 1.096, 1.097, 1.1, 1.2, 1.5, 2, 5, 10, 100, 1e4]) {
    const c = ctxOf({ F: t * 1000 * P.K.g, surface: s });
    const r = P.stomp(c);
    const o = { body: rex, surface: s, unbreakable: true, near: 5 };
    const b = M.blow(r, o);
    const src = M.shake(r, o);
    const ppv = P.ppvAt(src, 5) * 1000, ppv2 = P.ppvAt(src, 2) * 1000;
    const pl = P.plasterReach(src);
    console.log(`${t} t: vFoot=${r.vFoot.toFixed(2)} realHole=${(r.realHole*100).toFixed(2)}cm printCap=${r.printCap!=null?(r.printCap*100).toFixed(2):'-'}cm realBreaks=${r.realBreaks} J=${b.J.toFixed(0)} T=${(b.T*1000).toFixed(1)}ms whole=${b.whole?b.whole.toFixed(0):''} ppv5=${ppv.toFixed(2)} ppv2=${ppv2.toFixed(2)} rattleReach=${P.ppvReach(src, 0.001 * (P.VIB.TH.rattle/0.001)).toFixed(1)} plaster=${pl.toFixed(2)}m`);
  }
}
console.log('rattle threshold', P.VIB.TH.rattle, 'feelOnce', P.VIB.TH.feelOnce);
