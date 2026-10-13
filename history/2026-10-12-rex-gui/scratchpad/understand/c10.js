global.window = {};
const P = require('./head/engine.js'); require('./head/data.js'); const D = window.DINO_DATA;
const g = 9.80665;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const f = (x) => (typeof x === 'number' ? x.toPrecision(3) : String(x));
const F100 = 100 * 907.18474 * g;
for (const [ang, anchor, F] of [[30, 'friction', F100], [45, 'friction', F100], [30, 'bolted', F100], [30, 'friction', 1e6 * g], [30, 'bolted', 1e6 * g]]) {
  const R = { F, mode: 'comic', body: P.makeBody({ H: 3.048, m: 3007, build: 'rex' }), surface: surf('concrete'), groundHolds: false, anchor };
  const O = Object.assign({}, R, { body: P.makeBody({ H: 3.048, m: 3007, build: 'ollie' }), anchor: 'friction' });
  const t = P.throwPartner(R, O, ang), r = t.r, p = r.push;
  const th = ang * Math.PI / 180, RB = r.mB * g * Math.sin(th);
  const Jline = p.pB + RB * p.t - p.pA;   // impulse along the throw line through his feet
  const src = P.vibSource(R.surface, 'hann', 2 * Jline / p.t, p.t);
  const land = P.RESTRAINT.MOVES.throw.shake(r, { obj: t.obj, surface: R.surface });
  console.log('angle', ang, anchor, 'F', f(F / g), 'kgf | v', f(r.v), 'range', f(r.flight.range), 'push t', f(p.t), 'pA', f(p.pA), 'pB', f(p.pB), 'J_feet', f(Jline), '| feet ppv5', f(P.ppvAt(src, 5) * 1e3), 'plaster@5', P.plasterOver(src, 5), '| landing ppv5', f(P.ppvAt(land, 5) * 1e3), 'plaster@5', P.plasterOver(land, 5));
}
