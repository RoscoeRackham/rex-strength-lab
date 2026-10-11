global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const { refHill } = require('./ref.js'); const g = P.K.g;
const S = Object.fromEntries(D.surfaces.map(s => [s.id, s]));
for (const [H, kg, surf, gh] of [[0.4, 100 * 907.18474, 'concrete', false], [2, 1e7, 'concrete', false], [2, 1e8, 'concrete', false], [2, 1e9, 'granite', true], [2, 3e10, 'granite', true]]) {
  const body = P.makeBody({ H, m: 180 * Math.pow(H / 2, 3) });
  const c = { F: kg * g, mode: 'real', body, surface: S[surf], groundHolds: gh, anchor: 'friction' };
  const j = P.jump(c);
  const o = { F: c.F, d: body.strokes.leg, mA: body.m - body.feetMass, mB: body.feetMass, RA: (body.m - body.feetMass) * g, RB: gh ? Infinity : S[surf].qult * 2 * body.footArea, vmax: 30 * body.s };
  const r = refHill(o);
  console.log(`jump H=${H} ${kg.toExponential(2)} kg ${surf} gh=${gh}: engine v=${j.v.toFixed(3)} stalled=${j.push.stalled} sat=${!!j.push.saturated} | ref body v=${(r.vA * o.mA / body.m).toFixed(3)} (vA ${r.vA.toFixed(3)}, feet vB ${r.vB.toFixed(3)})`);
}
