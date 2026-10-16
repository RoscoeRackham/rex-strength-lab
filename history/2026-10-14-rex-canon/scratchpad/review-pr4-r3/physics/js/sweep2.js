const { P, D, g, R3, O3, c3, dial, sig, surf } = require('./h.js');
const bad = []; const outs = {};
const lgs = [3.3, 3.41, 3.5, 4, 4.5, 4.96, 5.5, 6, 8, 12, Infinity];
for (const sf of D.surfaces) for (const lr of lgs) for (const lo of lgs) for (const ancR of ['friction', 'bolted']) for (const ancO of ['friction', 'bolted']) for (const ub of [true, false]) for (const mode of ['comic', 'real']) {
  const FR = isFinite(lr) ? Math.pow(10, lr) * g : Infinity, FO = isFinite(lo) ? Math.pow(10, lo) * g : Infinity;
  const x = { surface: sf, unbreakable: ub, mode };
  // Ollie pushes Rex (the page's default steady push)
  const r = P.standoff(c3(FO, O3, Object.assign({ anchor: ancO }, x)), c3(FR, R3, Object.assign({ anchor: ancR }, x)));
  const key = r.outcome + (r.rockGives ? '/rock' : '') + (r.cantStand ? '/lying' : '');
  outs[key] = (outs[key] || 0) + 1;
  const tag = [sf.id, 'R' + lr, 'O' + lo, ancR, ancO, ub, mode, r.outcome].join(' ');
  for (const [k, v] of Object.entries(r)) if (typeof v === 'number' && Number.isNaN(v)) bad.push(tag + ' NaN ' + k);
  if (r.drive) {
    const dv = r.drive; const terms = [dv.pB, dv.footB, -r.recoilAbsorbed.J];
    if (terms.every(isFinite)) { const s = terms.reduce((a, b) => a + b, 0); if (Math.abs(s) > 1e-9 * Math.abs(terms[2])) bad.push(tag + ' ledger ' + terms.map((t) => sig(t)).join(',')); }
    if (r.outcome !== 'forceWins') bad.push(tag + ' drive w/o forceWins');
  }
  if (r.outcome === 'forceWins' && r.ownRecoil && !r.drive) bad.push(tag + ' forceWins no drive');
}
console.log(JSON.stringify(outs));
console.log(bad.length, bad.slice(0, 30).join('\n'));
