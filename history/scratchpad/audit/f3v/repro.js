global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const { refHill, quadHill } = require('./ref.js');
const g = P.K.g;
const S = Object.fromEntries(D.surfaces.map(s => [s.id, s]));
function ctx(kg, o) { o = o || {}; const H = o.H || 2; const body = P.makeBody({ H, m: 180 * Math.pow(H / 2, 3) });
  return { F: kg * g, mode: 'real', body, surface: S[o.surface || 'concrete'], groundHolds: !!o.groundHolds, anchor: o.anchor || 'friction' }; }
// 1) Punch at 1e8 kg, default body, concrete (app default surface), real mode
for (const surf of ['concrete', 'granite']) {
  const c = ctx(1e8, { surface: surf });
  const p = P.punch(c);
  const o = { F: p.F, d: c.body.strokes.punch, mA: c.body.m - c.body.handEff, mB: c.body.handEff, RA: p.anchor.R, RB: 0, vmax: 17 };
  const r = refHill(o), q = quadHill(o);
  console.log(`punch 1e8 kg ${surf}: engine vFist=${p.vFist} stalled=${p.push.stalled} sat=${p.push.saturated} t=${p.push.t.toExponential(3)} | refRK4 vB=${r.vB.toFixed(4)} done=${r.done} | quad vB=${q.vB.toFixed(4)}`);
}
// 2) Jump at 1e9 kg
{ const c = ctx(1e9, { surface: 'granite', groundHolds: true }); const j = P.jump(c);
  const o = { F: j.F, d: c.body.strokes.leg, mA: c.body.m - c.body.feetMass, mB: c.body.feetMass, RA: (c.body.m - c.body.feetMass) * g, RB: Infinity, vmax: 30 };
  const r = refHill(o), q = quadHill(o);
  console.log(`jump 1e9 kg: engine v=${j.v} pushA=${j.push.vA} stalled=${j.push.stalled} | ref vA=${r.vA.toFixed(4)} -> body v=${(r.vA * o.mA / c.body.m).toFixed(4)} | quad vA=${q.vA.toFixed(4)}`); }
// 3) First-step stall condition, analytic: 0.5*dt*(aA+aB) >= vmax with dt = max(tComic, d/vmax)/4000
function predictedStallLow(action) {
  const b = P.makeBody({});
  const cfg = { punch: { d: b.strokes.punch, mL: b.handEff, vmax: 17, frac: 0.3 } }[action];
  const dt = cfg.d / cfg.vmax / 4000;
  const F0 = 2 * cfg.vmax * cfg.mL / dt; // ignoring A side (small)
  return Math.log10(F0 / (cfg.frac * g));
}
console.log('predicted punch stall onset (light-body only) log10 kg =', predictedStallLow('punch').toFixed(3));
