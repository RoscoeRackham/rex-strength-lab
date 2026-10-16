const { P, D, g, R3, O3, c3, dial, sig, surf } = require('./h.js');
const bad = []; const outs = {};
const lgs = [3.3, 3.41, 3.5, 4, 4.5, 4.96, 5.5, 6, 8, 12, Infinity];
for (const sf of D.surfaces) for (const lr of lgs) for (const lo of lgs) for (const ancR of ['friction', 'bolted']) for (const ancO of ['friction', 'bolted']) for (const ub of [true, false]) for (const mode of ['comic', 'real']) {
  const FR = isFinite(lr) ? Math.pow(10, lr) * g : Infinity, FO = isFinite(lo) ? Math.pow(10, lo) * g : Infinity;
  const x = { surface: sf, unbreakable: ub, mode };
  const r = P.pushMatch(c3(FR, R3, Object.assign({ anchor: ancR }, x)), c3(FO, O3, Object.assign({ anchor: ancO }, x)));
  const key = r.outcome + (r.noAnswer ? '/na' : '');
  outs[key] = (outs[key] || 0) + 1;
  const tag = [sf.id, lr, lo, ancR, ancO, ub, mode, r.outcome].join(' ');
  for (const [k, v] of Object.entries(r)) if (typeof v === 'number' && Number.isNaN(v)) bad.push(tag + ' NaN ' + k);
  if (r.outcome === 'bothShoved' || r.outcome === 'shovedOff') {
    const rA = r.recoilAbsorbedA ? r.recoilAbsorbedA.J : 0, rB = r.recoilAbsorbedB ? r.recoilAbsorbedB.J : 0;
    const terms = [-r.pA, r.pB, -r.footA, r.footB, -rA, rB];
    if (terms.every(isFinite)) {
      const s = terms.reduce((a, b) => a + b, 0), big = Math.max(...terms.map(Math.abs));
      if (Math.abs(s) > 1e-6 * big) bad.push(tag + ' ledger open ' + sig(s / big) + ' ' + terms.map((t) => sig(t)).join(','));
    }
    if (!(Math.abs(r.xA + r.xB - r.d) <= 1e-9 * r.d) && isFinite(r.xA + r.xB)) bad.push(tag + ' x sum ' + (r.xA + r.xB) + ' vs ' + r.d);
  }
  if (r.outcome === 'walkOut') {
    const w = r.winner, wA = w === 'A', mw = wA ? R3.m : O3.m, ml = wA ? O3.m : R3.m, Dl = wA ? r.DB : r.DA, Hl = wA ? r.HB : r.HA;
    const recW = r['recoilAbsorbed' + w].J, recL = r['recoilAbsorbed' + (wA ? 'B' : 'A')] ? r['recoilAbsorbed' + (wA ? 'B' : 'A')].J : 0;
    // momentum along the winner's push: bodies (mw+ml) v = ground on winner (mw a + Dl during accel ... ) - Hl t + sources
    // check walkPush below the vCap equals Hl + ml a
    if (!(Math.abs(r.walkPush - (Hl + ml * r.accel)) < 1e-9 * r.walkPush)) bad.push(tag + ' walkPush');
    // winner's feet must be able to supply mw a + Dl
    const fw = (wA ? r.holdA : r.holdB);
    if (mw * r.accel + Dl > fw * (1 + 1e-9)) bad.push(tag + ' winner feet exceed footing');
    // the winner's walkPush must be <= his push capacity
    const Dw = wA ? r.DA : r.DB;
    if (r.walkPush > Dw * (1 + 1e-9)) bad.push(tag + ' walkPush exceeds Dw');
  }
}
console.log(JSON.stringify(outs));
console.log(bad.length, bad.slice(0, 30).join('\n'));
