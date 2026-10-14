const { P, D, surf, obj, rex, tons, ctx } = require('./lib.js');
const M = P.RESTRAINT.MOVES;
const fmt = (x) => (typeof x === 'number' ? x.toPrecision(4) : x);
const body = rex();
function show(label, c, o, th) {
  const r = P.throwObject(c, o, th);
  const pObj = r.push ? r.push.pB * o.m / r.mB : 0;
  const mo = Object.assign({ body, surface: c.surface, obj: o, angle: th, near: 5, m: body.m }, c);
  const sh = M.throw.shake(r, mo);
  const own = r.toGround ? P.impulseSource(c.surface, r.toGround.J, r.toGround.T) : null;
  console.log(label, 'v', fmt(r.v), 'pObj', fmt(pObj), 'recoilV', fmt(r.recoilV), 'toGround', r.toGround ? JSON.stringify(Object.fromEntries(Object.entries(r.toGround).map(([k, v]) => [k, +v.toPrecision(4)]))) : '-',
    'ppv5 own', fmt(P.ppvAt(own, 5) * 1e3), 'mm/s; plaster own', fmt(P.plasterReach(own)), 'slide', fmt(M.throw.slide(r, mo)), 'sinkRatio', fmt(r.sinkRatio), 'sinkRaw', fmt(r.sinkRatioRaw));
  return r;
}
// bus on ice: presence test's case
for (const pw of [true, false]) for (const ow of [true, false]) {
  const c = ctx({ surface: 'ice', kg: tons(100), extra: { ownRecoil: ow, unbreakable: pw } });
  show('bus ice unb=' + pw + ' own=' + ow, c, obj('bus'), 45);
}
// all-star baseball
for (const ow of [true, false]) {
  const c = ctx({ surface: 'concrete', kg: 1.81e23, extra: { ownRecoil: ow } });
  show('allstar own=' + ow, c, obj('baseball'), 0);
}
// car on sand at 0, 45, 90 with powers on, 100 t and 1e6 kg
for (const kg of [tons(100), 1e6, 1e9]) for (const th of [0, 30, 45, 60, 90]) {
  const c = ctx({ surface: 'sand', kg });
  show('car sand ' + fmt(kg) + 'kg th' + th, c, obj('car'), th);
}
const sand = surf('sand');
const Nmax = P.qultFor(sand, body.footB) * 2 * body.footArea;
console.log('sand Nmax', fmt(Nmax), 'Rex+car weight', fmt((body.m + 1340) * 9.80665), 'mu Nmax T', fmt(sand.mu * Nmax * P.limbPulse(body)), 'limbPulse', P.limbPulse(body));
