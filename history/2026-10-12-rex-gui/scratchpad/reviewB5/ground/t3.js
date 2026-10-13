const { P, D, surf, obj, rex, tons, ctx } = require('./lib.js');
const M = P.RESTRAINT.MOVES;
const fmt = (x) => (typeof x === 'number' ? x.toPrecision(4) : x);
const body = rex();
for (const s of ['sand', 'gravel']) {
  let prev = null;
  for (let lt = -0.5; lt <= 2.0; lt += 0.02) {
    const t = Math.pow(10, lt);
    const c = Object.assign(ctx({ surface: s, kg: tons(t) }));
    const o = Object.assign({ body, surface: c.surface, m: body.m, near: 5, anchor: 'friction' }, c);
    const r = M.stomp.run(c, o), b = M.stomp.blow(r, o), sh = M.stomp.shake(r, o);
    const ppv = P.ppvAt(sh, 5) * 1e3;
    if (prev && r.realBreaks !== prev.rb) console.log(s, 'flip at', fmt(t), 't: before ppv5', fmt(prev.ppv), 'J', fmt(prev.J), '-> after ppv5', fmt(ppv), 'J', fmt(b.J), 'realHole', fmt(r.realHole), 'printCap', fmt(r.printCap), 'reach rattle', fmt(P.ppvReach(sh, 1e-3)), 'prev rattle', fmt(prev.rr));
    prev = { rb: r.realBreaks, ppv, J: b.J, rr: P.ppvReach(sh, 1e-3) };
  }
}
// the hold of 1 foot on sand: qult*A
console.log('sand qult', P.qultFor(surf('sand'), body.footB), 'footArea', body.footArea, 'legEff', body.legEff, 'footB', body.footB);
