global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const { refHill } = require('./ref.js'); const g = P.K.g;
const S = Object.fromEntries(D.surfaces.map(s => [s.id, s])); const O = Object.fromEntries(D.objects.map(o => [o.id, o]));
const body = P.makeBody({});
for (const kg of [1e6, 1e11, 1e12, 1e15, 1.36e14]) {
  const c = { F: kg * g, mode: 'real', body, surface: S.concrete, groundHolds: false, anchor: 'friction' };
  const j = P.jump(c);
  const o = { F: j.F, d: body.strokes.leg, mA: body.m - body.feetMass, mB: body.feetMass, RA: (body.m - body.feetMass) * g, RB: S.concrete.qult * 2 * body.footArea, vmax: 30 };
  const r = refHill(o);
  const t = P.throwObject(c, O.car, 45);
  const tr = refHill({ F: t.F, d: body.strokes.throw, mA: body.m - 2 * body.handEff, mB: 1360 + 2 * body.handEff, RA: t.anchor.R, RB: (1360 + 2 * body.handEff) * g * Math.sin(Math.PI / 4), vmax: 55 });
  console.log(`${kg.toExponential(2)} kg concrete real: jump engine v=${j.v.toFixed(3)} sat=${!!j.push.saturated} stalled=${j.push.stalled} | ref body v=${(r.vA * o.mA / body.m).toFixed(3)} || car engine v=${t.v.toFixed(3)} sat=${!!t.push.saturated} | ref ${tr.vB.toFixed(3)}`);
}
