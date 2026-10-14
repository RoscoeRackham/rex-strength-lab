const L = require('./lib.js')('new');
const { P, rex, conc, obj, ctxOf } = L;
const M = P.RESTRAINT.MOVES.throw, ON = { keepForm: true, unbreakable: true, ownRecoil: true };
const id = process.argv[2] || 'car', ang = +(process.argv[3] || 0), sh = +(process.argv[4] || 0.9);
const f = (v) => (v == null ? '-' : (+v).toPrecision(3));
for (let lg = 8; lg <= 15.01; lg += 1) {
  const ctx = ctxOf(Math.pow(10, lg), Object.assign({ airAbsorb: sh }, ON)), o = obj(id);
  const r = P.throwObject(ctx, o, ang), opt = Object.assign({ obj: o, angle: ang, surface: conc, body: rex, near: 5 }, ctx);
  const rc = P.RESTRAINT.reach('throw', r, opt);
  const b = M.blastParts(r, opt);
  const whole = r.dragLoss != null ? r.dragLoss + (b.hand || 0) : null;
  console.log('logkg', lg, 'v', f(r.v), 'Mach', f(r.v / P.K.a0), 'rel', !!r.flight.relativistic, 'range km', f(r.flight.range / 1e3), 'eFold m', f(r.flight.eFold), 'dragLoss', f(r.dragLoss), 'blast', f(M.blast(r, opt)), 'reach shown km', f(rc.air / 1e3), 'reach if slowed take counted km', whole ? f(P.blastRadius(Math.max(whole, b.land), 100) / 1e3) : '-', 'flight time s', f(r.flight.time));
}
