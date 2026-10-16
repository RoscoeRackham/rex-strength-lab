const { P, g, R3, O3, DIAL, ctx, sig } = require('./common.js');
const pick = (r) => { const o = {}; for (const k of ['outcome','winner','noAnswer','vA','vB','slideA','slideB','footA','footB','tornA','tornB','tearA','tearB','holdAfterA','holdAfterB','HA','HB','DA','DB','contact','t']) if (k in r) o[k] = typeof r[k] === 'number' ? Number(r[k].toPrecision(5)) : r[k]; if (r.recoilAbsorbedA) o.rA = r.recoilAbsorbedA.J; if (r.recoilAbsorbedB) o.rB = r.recoilAbsorbedB.J; return o; };
const pm = (FR, FO, xR, xO) => P.pushMatch(ctx(FR, R3, xR), ctx(FO, O3, xO));
const cases = {
  default: pm(DIAL, DIAL),
  rexBoltedRealRock: pm(DIAL, DIAL, { anchor: 'bolted', unbreakable: false }, { unbreakable: false }),
  rexBoltedUnbr: pm(DIAL, DIAL, { anchor: 'bolted' }),
  rexBolted5t: pm(5470 * g, 5470 * g, { anchor: 'bolted', unbreakable: false }, { unbreakable: false }),
  rexBolted70t: pm(70000 * g, 70000 * g, { anchor: 'bolted', unbreakable: false }, { unbreakable: false }),
  rexBolted72t: pm(72000 * g, 72000 * g, { anchor: 'bolted', unbreakable: false }, { unbreakable: false }),
  infOllieBolted: pm(Infinity, Infinity, {}, { anchor: 'bolted' }),
  infOllieBoltedReal: pm(Infinity, Infinity, { unbreakable: false }, { anchor: 'bolted', unbreakable: false }),
  infRexOllieWeakBolted: pm(Infinity, 1000 * g, {}, { anchor: 'bolted' }),
  e9OllieBolted: pm(1e9 * g, 1e9 * g, {}, { anchor: 'bolted' }),
};
for (const [k, r] of Object.entries(cases)) { const o = pick(r); const L = (o.pB||0); console.log(k, JSON.stringify(o)); if (r.recoilAbsorbedA && r.recoilAbsorbedB && isFinite(r.pA)) console.log('   ledger', r.pB - r.pA + r.footB - r.footA - r.recoilAbsorbedA.J + r.recoilAbsorbedB.J); }
