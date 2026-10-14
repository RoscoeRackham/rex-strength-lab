const { P, D, g, obj, rex, ollie, ctxOf, sig } = require('./common.js');
const M = P.RESTRAINT.MOVES;
const run = (id, kg, share, angle) => {
  const ex = { airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true };
  const cx = ctxOf(kg * g, ex);
  const o = Object.assign({}, cx, { obj: obj(id), angle, target: 0 });
  return { r: M.throw.run(cx, o), o };
};
const find = (id, vT, share, angle) => { let lo = 1, hi = 1e30; for (let i = 0; i < 200; i++) { const mid = Math.sqrt(lo * hi); if (run(id, mid, share, angle).r.v < vT) lo = mid; else hi = mid; } return hi; };
for (const [id, vT, angle] of [['pyramid', 15000, 90], ['everest', 20000, 60]]) {
  if (!obj(id)) { console.log('no', id, D.objects.map(x => x.id).join(',')); continue; }
  const kg = find(id, vT, 0.5, angle);
  const { r, o } = run(id, kg, 0.5, angle);
  const b = M.throw.blastParts(r, o);
  const ob = obj(id);
  const f0 = P.fly({ v0: r.vOut, thetaDeg: angle, h0: rex.releaseHeight, m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup });
  const fr = P.fly({ v0: r.vOut, thetaDeg: angle, h0: rex.releaseHeight, m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup, dragK: 1 - 1e-9 });
  console.log(id, 'kg', sig(kg), 'v', sig(r.v), 'Eobj', sig(r.Eobj), 'blast', sig(M.throw.blast(r, o)), 'path', sig(b.path), 'dragLoss0', sig(r.dragLoss0), 'flight.air.E (50%)', r.flight.air ? sig(r.flight.air.E) : '-', 'escaped50', r.flight.escaped, 'f0 landed', f0.landed, 'f0 escaped', f0.escaped, 'realAir.E', fr.air ? sig(fr.air.E) : '-', 'k*real', fr.air ? sig(0.5 * fr.air.E) : '-');
}
