const L = require('./lib.js')(process.argv[2] || 'new');
const { P, g, rex, conc, obj, ctxOf } = L;
const M = P.RESTRAINT.MOVES.throw;
const cases = [];
const add = (id, kg, ang, sh, extra) => cases.push({ id, kg, ang, sh, extra: extra || {} });
for (const sh of [0, 0.5, 0.9, 0.99]) add('car', 1e15, 0, sh, { keepForm: true, unbreakable: true, ownRecoil: true });
for (const sh of [0.5, 0.9]) add('car', 1e15, 45, sh, { keepForm: true, unbreakable: true, ownRecoil: true });
for (const sh of [0.5, 0.9, 0.99]) add('baseball', 1e15, 0, sh, { keepForm: true, unbreakable: true, ownRecoil: true });
for (const sh of [0.5, 0.9]) add('pyramid', 1e25, 90, sh, { keepForm: true, unbreakable: true, ownRecoil: true });
for (const sh of [0.5, 0.9]) add('allstar', 1e40, 0, sh, { keepForm: true, unbreakable: true, ownRecoil: true });
const out = [];
for (const c of cases) {
  const pw = Object.assign({ airAbsorb: c.sh }, c.extra);
  const ctx = ctxOf(c.kg, pw);
  const o = obj(c.id);
  const r = P.throwObject(ctx, o, c.ang);
  const opt = Object.assign({ obj: o, angle: c.ang, surface: conc, body: rex, near: 5 }, ctx);
  const t0 = Date.now();
  const rc = P.RESTRAINT.reach('throw', r, opt);
  const dt = Date.now() - t0;
  const b = M.blastParts(r, opt);
  const fa = P.fastAir(o, r.Eobj, c.ang, 1 - c.sh);
  out.push({ id: c.id, kg: c.kg, ang: c.ang, sh: c.sh, rel: !!(r.flight && r.flight.relativistic), E: r.Eobj, m: o.m, A: o.area, land: b.land, path: b.path, hand: b.hand || 0,
    air: rc.air, airRattle: rc.airRattle, windows: rc.windows, houses: rc.houses, ms: dt, dHalf: fa.dHalf, Eair: fa.Eair, blastAtNull: M.blastAt(r, opt, 1000) == null });
}
console.log(JSON.stringify(out));
