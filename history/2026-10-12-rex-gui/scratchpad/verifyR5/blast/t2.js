const tree = process.argv[2] || 'new', id = process.argv[3] || 'car', ang = +(process.argv[4] || 0), sh = +(process.argv[5] || 0.9);
const L = require('./lib.js')(tree);
const { P, rex, conc, obj, ctxOf } = L;
const M = P.RESTRAINT.MOVES.throw;
const ON = { keepForm: true, unbreakable: true, ownRecoil: true };
const o = obj(id);
for (let lg = +(process.argv[6] || 14); lg <= +(process.argv[7] || 16); lg += +(process.argv[8] || 0.1)) {
  const ctx = ctxOf(Math.pow(10, lg), Object.assign({ airAbsorb: sh }, ON));
  const r = P.throwObject(ctx, o, ang);
  const opt = Object.assign({ obj: o, angle: ang, surface: conc, body: rex, near: 5 }, ctx);
  const rc = P.RESTRAINT.reach('throw', r, opt), b = M.blastParts(r, opt);
  const f = (v) => (v == null ? '-' : (+v).toPrecision(4));
  console.log('logkg', lg.toFixed(2), 'v/c', f(r.v / P.K.c), 'rel', !!r.flight.relativistic, 'E', f(r.Eobj), 'dragLoss', f(r.dragLoss), 'dragLoss0', f(r.dragLoss0), 'blast', f(M.blast(r, opt)), 'land', f(b.land), 'path', f(b.path), 'reach100Pa km', f(rc.air / 1e3), 'houses km', f(rc.houses / 1e3));
}
