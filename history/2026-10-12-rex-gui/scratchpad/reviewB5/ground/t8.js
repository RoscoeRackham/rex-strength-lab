const { P, D, surf, obj, rex, tons, ctx } = require('./lib.js');
const fmt = (x) => (typeof x === 'number' ? x.toPrecision(4) : x);
const body = rex(), sand = surf('sand');
const Nmax = P.qultFor(sand, body.footB) * 2 * body.footArea;
for (const own of [false, true]) for (const kg of [tons(100), 1e6]) for (const th of [0, 45]) {
  const c = ctx({ surface: 'sand', kg, extra: { ownRecoil: own } });
  const r = P.throwObject(c, obj('car'), th);
  const g = r.toGround, T = g.T, Jh = (g.whole || g.J) * Math.cos(th * Math.PI / 180);
  const src = P.impulseSource(sand, g.J, T);
  const capH = sand.mu * Nmax * T;
  const capped = P.impulseSource(sand, Math.hypot(Math.min(Jh, capH), 0), T);
  console.log('own', own, fmt(kg), 'kg th', th, 'v', fmt(r.v), 'recoilV', fmt(r.recoilV), 'toGround J', fmt(g.J), 'sideways', fmt(Jh), 'T', fmt(T), 'mean sideways force', fmt(Jh / T), 'N; sand mu*Nmax', fmt(sand.mu * Nmax), 'ppv5', fmt(P.ppvAt(src, 5) * 1e3), 'plaster', fmt(P.plasterReach(src)), '| sideways capped at mu Nmax T:', fmt(Math.min(Jh, capH)), 'ppv5', fmt(P.ppvAt(capped, 5) * 1e3), 'plaster', fmt(P.plasterReach(capped)));
}
