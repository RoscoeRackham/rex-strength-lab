global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const { refHill } = require('./ref.js');
const g = P.K.g;
const S = Object.fromEntries(D.surfaces.map(s => [s.id, s]));
const O = Object.fromEntries(D.objects.map(o => [o.id, o]));
function ctx(kg, H, surf) { const body = P.makeBody({ H, m: 180 * Math.pow(H / 2, 3) });
  return { F: kg * g, mode: 'real', body, surface: S[surf || 'concrete'], groundHolds: false, anchor: 'friction' }; }
// reference wrappers mirroring engine's per-action pushApart arguments
function refPunch(c) { const b = c.body; const anc = P.anchorCapacity({ body: b, surface: c.surface, theta: 0, anchor: c.anchor, groundHolds: c.groundHolds });
  return refHill({ F: c.F * 0.3, d: b.strokes.punch, mA: b.m - b.handEff, mB: b.handEff, RA: anc.R, RB: 0, vmax: 17 * b.s }).vB; }
function refClap(c) { const b = c.body; return refHill({ F: c.F * 0.3, d: b.strokes.clap, mA: b.m, mB: b.handEff, RA: Infinity, RB: 0, vmax: 17 * b.s }).vB; }
function refStomp(c) { const b = c.body; return refHill({ F: c.F * 0.5, d: b.strokes.stomp, mA: b.m - b.legEff, mB: b.legEff, RA: (b.m - b.legEff) * g, RB: 0, vmax: 16 * b.s }).vB; }
function refThrow(c, obj, th) { const b = c.body; const t = th * Math.PI / 180; const whip = obj.m <= 1; const hands = obj.m > 20 ? 2 : 1;
  const arm = hands * (whip ? b.whipEff : b.handEff); const anc = P.anchorCapacity({ body: b, surface: c.surface, theta: t, anchor: c.anchor, groundHolds: c.groundHolds, extraMass: obj.m });
  const mB = obj.m + arm; return refHill({ F: c.F * 0.3, d: whip ? b.strokes.whip : b.strokes.throw, mA: b.m - arm, mB, RA: anc.R, RB: mB * g * Math.sin(t), vmax: 55 * b.s }).vB; }
for (const H of [0.4, 2, 50]) for (const t of D.tiers.filter(t => isFinite(t.liftKg))) {
  const c = ctx(t.liftKg, H);
  const e = { punch: P.punch(c).vFist, clap: P.clap(c).vHand, stomp: P.stomp(c).vFoot, jump: P.jump(c).v, ball: P.throwObject(c, O.baseball, 0).v, ballMove: P.throwObject(c, O.baseball, 0).canMove };
  const zeros = Object.entries(e).filter(([k, v]) => v === 0 || v === false).map(([k]) => k);
  if (!zeros.length) continue;
  const r = { punch: refPunch(c), clap: refClap(c), stomp: refStomp(c), ball: refThrow(c, O.baseball, 0) };
  console.log(`H=${H} m tier=${t.id} (${t.liftKg.toExponential(2)} kg): engine zero: ${zeros.join(',')} | engine punch ${e.punch.toFixed(2)} clap ${e.clap.toFixed(2)} stomp ${e.stomp.toFixed(2)} jump ${e.jump.toFixed(2)} ball ${e.ball.toFixed(2)} | ref punch ${r.punch.toFixed(2)} clap ${r.clap.toFixed(2)} stomp ${r.stomp.toFixed(2)} ball ${r.ball.toFixed(2)}`);
}
