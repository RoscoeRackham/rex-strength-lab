const { P, D, surf, obj, rex, ollie, tons, ctx } = require('./lib.js');
const fmt = (x) => (typeof x === 'number' ? x.toPrecision(4) : x);
for (const s of ['concrete', 'sand', 'granite']) for (const anc of ['bolted', 'friction']) {
  const cO = ctx({ body: ollie(), surface: s }), cR = ctx({ body: rex(), surface: s, extra: { anchor: anc } });
  const r = P.collide(cO, cR, { source: 'sprint', bounce: false });
  const src = r.toGround ? P.impulseSource(cR.surface, r.toGround.J, r.toGround.T) : null;
  console.log(s, anc, 'v0', fmt(r.v0), 'outcome', r.outcome, 'toGround', r.toGround ? fmt(r.toGround.J) + '/' + fmt(r.toGround.T) + ' ' + r.toGround.how : '-', 'ppv5', fmt(P.ppvAt(src, 5) * 1e3), 'plaster', fmt(P.plasterReach(src)), 'limit', src ? fmt(P.plasterLimitHz(1 / src.T) * 1e3) : '');
}
