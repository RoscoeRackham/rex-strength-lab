const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const ST = 907.18474;
const tiers = Object.fromEntries(D.tiers.map(t => [t.id, t.liftKg]));
function run(H, surfId, tier, mode='comic', anchor='friction') {
  const body = P.makeBody({ H, m: 180 * Math.pow(H / 2, 3) });
  const surface = D.surfaces.find(s => s.id === surfId);
  const c = { F: tiers[tier] * g, mode, body, surface, groundHolds: false, anchor };
  const L = P.lift(c, { m: 1 });
  const S = P.sprint(c);
  // stance-phase bearing check: one foot, stance-averaged vertical force = mg/beta
  const W = body.m * g;
  const footQ = surface.qult * body.footArea;   // one foot capacity
  const twoFoot = W / (2 * footQ);
  // stance-averaged ~2.5 BW (research file), peak 4.1-5 BW
  const stanceAvg = 2.5 * W / footQ;
  const stancePeak = 5 * W / footQ;
  // if bearing caps total normal at qult*2*footArea (most generous: both feet always loaded)
  const thrustCap = surface.mu * Math.min(W, 2 * footQ);
  const aCap = thrustCap / body.m;
  return { H, surfId, tier, mode, standRatio: L.standRatio.toFixed(2), twoFoot: twoFoot.toFixed(2),
    stanceAvgRatio: stanceAvg.toFixed(2), stancePeakRatio: stancePeak.toFixed(2),
    sprintAccelG: S.accelG.toFixed(3), t100: S.t100.toFixed(2), vTop: S.vTop.toFixed(1), limit: S.limit, topLimit: S.topLimit,
    sportsCarClaim: (S.limit === 'friction' && !S.relativistic && S.vTop > 27.78),
    capAccelG: (aCap / g).toFixed(3), capT100: (27.78 / aCap).toFixed(2) };
}
const rows = [];
for (const H of [0.4, 2, 50]) for (const s of ['sand', 'clay', 'asphalt', 'concrete']) rows.push(run(H, s, 'secretwars'));
console.table(rows);
console.table([run(2,'clay','human'), run(50,'clay','human'), run(50,'clay','spidey'), run(50,'clay','secretwars','real')]);
